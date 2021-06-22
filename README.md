<span align="center">

# homebridge-website-change-check

[![verified-by-homebridge](https://badgen.net/badge/homebridge/verified/purple)](https://github.com/homebridge/homebridge/wiki/Verified-Plugins)
[![homebridge-website-change-check](https://badgen.net/npm/v/homebridge-website-change-check?icon=npm)](https://www.npmjs.com/package/homebridge-website-change-check)
[![mit-license](https://badgen.net/npm/license/homebridge-website-change-check)](https://github.com/marcveens/homebridge-website-change-check/blob/master/LICENSE)
[![Build Status](https://travis-ci.com/marcveens/homebridge-website-change-check.svg?branch=master)](https://travis-ci.com/marcveens/homebridge-website-change-check)

</span>

`homebridge-website-change-check` is a plugin for homebridge which allows you to check if a value on a website has changed. The special part of this plugin is that values are checked using a headless browser. Therefor values can even be fetched on websites with asynchronous data calls.

## Installation

If you are new to homebridge, please first read the homebridge [documentation](https://www.npmjs.com/package/homebridge).
If you are running on a Raspberry, you will find a tutorial in the [homebridge wiki](https://github.com/homebridge/homebridge/wiki/Install-Homebridge-on-Raspbian).

Install homebridge:
```sh
sudo npm install -g homebridge
```

Install homebridge-website-change-check:
```sh
sudo npm install -g homebridge-website-change-check
```

In the Homebridge terminal, run:
```sh
sudo apt install chromium-browser chromium-codecs-ffmpeg
```

This is necessary when running on an ARM processor, like on a Raspberry Pi. This will install a headless Chromium browser which is used for change detection. 

## Configuration

Add the `WebsiteChangeCheck` platform in `config.json` in your home directory inside `.homebridge`.

Example configuration:

```js
{
  "platforms": [
    {
        "platform": "WebsiteChangeCheck",
        "changeChecks": [
            {
                "name": "BBC check",
                "url": "http://bbc.com/",
                "selector": ".module--header .module__title span",
                "checkInterval": 300000,
                "ignoreValues": []
            }
        ]
    }
  ]
}
```

Every device stated in the config will be automatically added as an accessory to Homekit. 

### Platform Configuration fields

Property | Required? | Remarks
--- | :-: | ---
`platform` | :heavy_check_mark: | Should always be **"WebsiteChangeCheck"**.
`changeChecks` | :heavy_check_mark: | A list of your website checks.

### changeChecks configuration fields
Property | Required? | Remarks
--- | :-: | ---
`name` | :heavy_check_mark: |Custom name for your check
`url` | :heavy_check_mark: | URL of the website/page you want to check
`selector` | :heavy_check_mark: | Selector of the value you want to compare. 
`checkInterval` | | Interval of the checks
`stepsBeforeCheck` | | List of steps that should be executed before checking for the selector. Could be useful if, for example, a value is only visible after filling in a form. See [configuration](#stepsbeforecheck-configuration-fields)
`ignoreValues` | | List of change values that do not cause a motion trigger
### stepsBeforeCheck configuration options
Type | Remarks 
--- | ---
`{ action: 'setSelectValue', selector: string, value: string \| number \| '*' }` | Used for selecting a value in a `select` element. The value can be either a string, a number, or a `*`. The `*` value makes sure the first possible truthy value will be set. 
`{ action: 'setInputValue', selector: string, value: string \| number }` | Used for setting a value in an `input` element.
`{ action: 'click', selector: string }` | Used for clicking an element
`{ action: 'waitForMilliseconds', value: number }` | Used for waiting a certain amount of milliseconds before the next action takes place

#### stepsBeforeCheck example usage in config
```js
{
  "platforms": [
    {
        "platform": "WebsiteChangeCheck",
        "changeChecks": [
            {
                "name": "BBC check",
                "url": "http://bbc.com/",
                "selector": ".module--header .module__title span",
                "checkInterval": 300000,
                "stepsBeforeCheck": [
                    {
                        "action": "waitForMilliseconds",
                        "value": 500
                    },
                    {
                        "action": "setSelectValue", 
                        "selector": "#mySelectId", 
                        "value": "*"
                    }
                ]
            }
        ]
    }
  ]
}
```
In this example the script will wait 500 milliseconds, then set the first possible truthy value in the #mySelectId `select` element, after which it checks the value in `.module--header .module__title span`.


## Contributors
If you'd like to contribute to this repository, feel free to! 
 
Only know that if you're testing the scripts locally, you have to install Chromium yourself. This is because `puppeteer` with Chromium included didn't work on my RaspberryPi Homebridge, therefor like stated above, it requires a manual installation. For that reason you need to download it locally as well. You can find the right version for you over [here](https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html). Just make sure that the correct path is included in a `.env` file. For an example of the `.env` file, see `.env.example`. 