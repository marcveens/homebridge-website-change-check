<span align="center">

# homebridge-website-change-check

[![homebridge-website-change-check](https://badgen.net/npm/v/homebridge-website-change-check?icon=npm)](https://www.npmjs.com/package/homebridge-website-change-check)
[![mit-license](https://badgen.net/npm/license/homebridge-website-change-check)](https://github.com/marcveens/homebridge-website-change-check/blob/master/LICENSE)

</span>

`homebridge-website-change-check` is a plugin for homebridge which allows you to check ...

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

## Configuration

Add the `DeviceAlive` platform in `config.json` in your home directory inside `.homebridge`.

Example configuration:

```js
{
  "platforms": [
    {
        "platform": "DeviceAlive",
        "checkInterval": 5000,
        "devices": [
            {
                "name": "Soundbar",
                "mac": "ff:ff:ff:ff:ff:ff"
            },
            {
                "name": "Phone",
                "ip": "192.168.172.10"
            }
        ],
    }
  ]
}
```

Every device stated in the config will be automatically added as an accessory to Homekit. 

#### Platform Configuration fields
- `platform` [required]
Should always be **"DeviceAlive"**.
- `devices` [required]
A list of your devices.
#### Device Configuration fields
Either mac or IP address is required.
- `name` [required]
Name of the device you want to add
- `mac` [optional]
Mac address of the device you want to check on your local network. Should be in lowerCase.
- `ip` [optional]
IP address of the device you want to check on your local network

### Backstory
This plugin is actually developed for use in Apple Shortcuts. I had a problem where I wanted to use a IR blaster to turn on and off some devices, but only had 1 signal for both statuses. I could not check if the device was already turned off when I ran a shortcut, thus the device would turn on again. This plugin can make sure no signal is sent if the device is already turned off.  