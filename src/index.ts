import {
    API,
    APIEvent,
    DynamicPlatformPlugin,
    HAP,
    Logging,
    PlatformAccessory,
    PlatformConfig
} from 'homebridge';
import { ChangeCheck, Options } from './types/optionTypes';
import { getValueFromPage } from './selectorValueChecker';
import { Cache } from './Cache';
import { FileCheck } from './FileCheck';

type CustomPlatformConfig = PlatformConfig & Options;

const PLUGIN_NAME = 'homebridge-website-change-check';
const PLATFORM_NAME = 'WebsiteChangeCheck';

let hap: HAP;
let Accessory: typeof PlatformAccessory;

export = (api: API) => {
    hap = api.hap;
    Accessory = api.platformAccessory;

    api.registerPlatform(PLUGIN_NAME, PLATFORM_NAME, WebsiteChangeCheckPlatform);
};

const chromiumPath = process.env.PUPPETEER_PATH || '/usr/bin/chromium-browser';

class WebsiteChangeCheckPlatform implements DynamicPlatformPlugin {
    private readonly log: Logging;
    private readonly api: API;
    private readonly config: CustomPlatformConfig;
    private checkStateIntervals: NodeJS.Timeout[] = [];
    private cache = new Cache();

    private readonly accessories: PlatformAccessory[] = [];
    private readonly accessoriesToRemove: PlatformAccessory[] = [];

    constructor(log: Logging, defaultConfig: PlatformConfig, api: API) {
        this.log = log;
        this.api = api;
        this.config = Object.assign({}, {
            changeChecks: [],
            platform: ''
        }, defaultConfig as CustomPlatformConfig);

        /*
         * When this event is fired, homebridge restored all cached accessories from disk and did call their respective
         * `configureAccessory` method for all of them. Dynamic Platform plugins should only register new accessories
         * after this event was fired, in order to ensure they weren't added to homebridge already.
         * This event can also be used to start discovery of new accessories.
         */
        api.on(APIEvent.DID_FINISH_LAUNCHING, () => {
            this.addNewDevices();
            this.removeOutdatedAccessories();

            this.initializeWatchers();
        });

        api.on(APIEvent.SHUTDOWN, () => {
            for (let i = 0; i < this.checkStateIntervals.length; i++) {
                clearInterval(this.checkStateIntervals[i]);
            }
        });
    }

    /*
     * This function is invoked when homebridge restores cached accessories from disk at startup.
     * It should be used to setup event handlers for characteristics and update respective values.
     */
    configureAccessory(accessory: PlatformAccessory): void {
        if (this.config.verbose) {
            this.log(`configureAccessory: ${accessory.displayName}, ${!this.accessoryRegisteredInConfig(accessory)}`);
        }
        if (!this.accessoryRegisteredInConfig(accessory)) {
            this.accessoriesToRemove.push(accessory);
        } else {
            this.accessories.push(accessory);
        }
    }

    // --------------------------- CUSTOM METHODS ---------------------------

    /** Initialize website check watcher */
    async initializeWatchers() {
        if (this.config.verbose) {
            this.log(`Accessories total: ${this.accessories.length}`);
        }

        if (!await FileCheck.exists(chromiumPath)) {
            this.log.error('Chromium browser is required but is not installed. \nRun "sudo apt install chromium-browser chromium-codecs-ffmpeg" in the Homebridge terminal in order to fix this.');
            return;
        }

        for (let i = 0; i < this.accessories.length; i++) {
            const deviceConfig = this.config.changeChecks.find(c => c.name === this.accessories[i].displayName);

            if (deviceConfig) {
                if (this.config.verbose) {
                    this.log(`initialize interval of ${deviceConfig.name} with interval of ${Math.max(5000, (deviceConfig?.checkInterval || 300000))}`);
                }

                this.checkStateIntervals.push(
                    setInterval(
                        this.updateAccessoryState.bind(this, this.accessories[i], deviceConfig),
                        Math.max(5000, (deviceConfig?.checkInterval || 300000)) // default of 5 minutes with a minimum of 5 seconds
                    )
                );
            }
        }
    }

    async updateAccessoryState(accessory: PlatformAccessory, changeCheck: ChangeCheck) {
        const service = accessory.getService(hap.Service.MotionSensor);
        const value = await getValueFromPage({
            executablePath: chromiumPath,
            changeCheck,
            log: this.log,
            verboseLogging: this.config.verbose,
            previousValue: this.cache.getValue(changeCheck.name)
        });

        this.log(`(${changeCheck.name}) Value found: "${value}". Old value: "${this.cache.getValue(changeCheck.name)}". Value changed? ${this.cache.getValue(changeCheck.name) !== value}`);

        if (this.cache.getValue(changeCheck.name) !== value) {
            this.cache.setValue(changeCheck.name, value);

            // Only send update if a value changed more than once. This prevents detection from firing on first run. 
            if (this.cache.hasValueChangedMoreThanOnce(changeCheck.name)) {
                service?.updateCharacteristic(hap.Characteristic.MotionDetected, true);

                // Disable motion sensor automatically after 1 second
                setTimeout(() => {
                    service?.updateCharacteristic(hap.Characteristic.MotionDetected, false);
                }, 1000);
            }
        } else {
            service?.updateCharacteristic(hap.Characteristic.MotionDetected, false);
        }
    }

    /** Check if accessory is registered in the Homebridge config */
    accessoryRegisteredInConfig(accessory: PlatformAccessory) {
        return this.config.changeChecks.find(d => d.name === accessory.displayName);
    }

    /** Check if accessory is registered in the Homebridge config */
    accessoryMissingInHomebridge(accessory: PlatformAccessory) {
        return this.config.changeChecks.find(d => d.name === accessory.displayName);
    }

    /** Remove outdated accessories from Homebridge */
    removeOutdatedAccessories() {
        if (this.config.verbose) {
            this.log(`Remove outdated accessories: ${this.accessoriesToRemove.map(a => a.displayName).join(', ')}`);
        }
        this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, this.accessoriesToRemove);
    }

    /** Register unregistered devices to Homebridge */
    addNewDevices() {
        const accessoriesToRegister = this.config.changeChecks.filter(d => !this.accessories.find(a => a.displayName === d.name));
        accessoriesToRegister.forEach(acc => {
            const uuid = hap.uuid.generate(acc.name);
            const accessory = new Accessory(acc.name, uuid);

            if (this.config.verbose) { this.log(`addNewDevices: ${acc.name}`); }

            accessory.addService(hap.Service.MotionSensor, acc.name);
            this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
            this.accessories.push(accessory);
        });
    }
}
