<span align="center">

# homebridge-website-change-check

[![verified-by-homebridge](https://badgen.net/badge/homebridge/verified/purple)](https://github.com/homebridge/homebridge/wiki/Verified-Plugins)
[![homebridge-website-change-check](https://badgen.net/npm/v/homebridge-website-change-check?icon=npm)](https://www.npmjs.com/package/homebridge-website-change-check)
[![mit-license](https://badgen.net/npm/license/homebridge-website-change-check)](https://github.com/marcveens/homebridge-website-change-check/blob/master/LICENSE)

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
                "checkInterval": 300000
            }
        ],
    }
  ]
}
```

Every device stated in the config will be automatically added as an accessory to Homekit. 

#### Platform Configuration fields
- `platform` [required]
Should always be **"WebsiteChangeCheck"**.
- `changeChecks` [required]
A list of your website checks.
#### changeChecks Configuration fields
- `name` [required]
Custom name for your check
- `url` [required]
URL of the website/page you want to check
- `selector` [required]
Selector of the value you want to compare. 
- `checkInterval` [optional]
Interval of the checks

## Contributors
If you'd like to contribute to this repository, feel free to! 
 
Only know that if you're testing the scripts locally, you have to install Chromium yourself. This is because `puppeteer` with Chromium included didn't work on my RaspberryPi Homebridge, therefor like stated above, it requires a manual installation. For that reason you need to download it locally as well. You can find the right version for you over [here](https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html). Just make sure that the correct path is included in a `.env` file. For an example of the `.env` file, see `.env.example`. 