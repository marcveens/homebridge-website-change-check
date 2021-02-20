import {
    API,
    APIEvent,
    DynamicPlatformPlugin,
    HAP,
    Logging,
    PlatformAccessory,
    PlatformConfig
} from "homebridge";
import puppeteer from 'puppeteer';
import { ChangeCheck, Options } from './optionTypes';

type CustomPlatformConfig = PlatformConfig & Options;

const PLUGIN_NAME = "homebridge-website-change-check";
const PLATFORM_NAME = "WebsiteChangeCheck";

let hap: HAP;
let Accessory: typeof PlatformAccessory;

export = (api: API) => {
    hap = api.hap;
    Accessory = api.platformAccessory;

    api.registerPlatform(PLUGIN_NAME, PLATFORM_NAME, WebsiteChangeCheckPlatform);
};

class WebsiteChangeCheckPlatform implements DynamicPlatformPlugin {

    private readonly log: Logging;
    private readonly api: API;
    private readonly config: CustomPlatformConfig;
    private checkStateIntervals: NodeJS.Timeout[] = [];
    private lastValue: { [key: string]: string } = {};

    private readonly accessories: PlatformAccessory[] = [];
    private readonly accessoriesToRemove: PlatformAccessory[] = [];

    constructor(log: Logging, defaultConfig: PlatformConfig, api: API) {
        this.log = log;
        this.api = api;
        this.config = defaultConfig as CustomPlatformConfig;

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
        console.log(`configureAccessory: ${accessory.displayName}, ${!this.accessoryRegisteredInConfig(accessory)}`);
        if (!this.accessoryRegisteredInConfig(accessory)) {
            this.accessoriesToRemove.push(accessory);
        } else {
            this.accessories.push(accessory);
        }
    }

    // --------------------------- CUSTOM METHODS ---------------------------

    /** Initialize website check watcher */
    initializeWatchers() {
        this.log(`Accessories total: ${this.accessories.length}`);
        for (let i = 0; i < this.accessories.length; i++) {
            const deviceConfig = this.config.changeChecks.find(c => c.name === this.accessories[i].displayName);

            if (deviceConfig) {
                this.log(`initialize interval of ${deviceConfig.name} with interval of ${Math.max(5000, (deviceConfig?.checkInterval || 300000))}`);
                this.checkStateIntervals.push(
                    setInterval(
                        this.updateAccessoryState.bind(this, this.accessories[i], deviceConfig),
                        Math.max(5000, (deviceConfig?.checkInterval || 300000)) // default of 5 minutes with a minimum of 5 seconds
                    )
                );
            }
        }
    }

    async updateAccessoryState(accessory: PlatformAccessory, config: ChangeCheck) {
        const service = accessory.getService(hap.Service.OccupancySensor);
        const status = service?.getCharacteristic(hap.Characteristic.OccupancyDetected).value;
        this.log(`Current status: ${status}, acc: ${config.name}`);

        const value = await this.getValueFromPage(config);
        this.log('Value found: ', value);
        if (this.lastValue[config.name] !== value) {
            this.log('New value!');
            this.lastValue[config.name] = value;

            service?.updateCharacteristic(hap.Characteristic.OccupancyDetected, hap.Characteristic.OccupancyDetected.OCCUPANCY_DETECTED);

            setTimeout(() => {
                service?.updateCharacteristic(hap.Characteristic.OccupancyDetected, hap.Characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED);
            }, 1000);
        } else {
            this.log('Value not new');
            service?.updateCharacteristic(hap.Characteristic.OccupancyDetected, hap.Characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED);
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
        this.log(`Remove outdated accessories: ${this.accessoriesToRemove.map(a => a.displayName).join(', ')}`);
        this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, this.accessoriesToRemove);
    }

    /** Register unregistered devices to Homebridge */
    addNewDevices() {
        const accessoriesToRegister = this.config.changeChecks.filter(d => !this.accessories.find(a => a.displayName === d.name));
        accessoriesToRegister.forEach(acc => {
            const uuid = hap.uuid.generate(acc.name);
            const accessory = new Accessory(acc.name, uuid);
            this.log(`addNewDevices: ${acc.name}`);

            accessory.addService(hap.Service.OccupancySensor, acc.name);
            this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
        });
    }

    // ----------------------------------------------------------------------

    async getValueFromPage(config: ChangeCheck) {
        this.log('Initialize browser');
        const browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium-browser',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        this.log('Browser initialized');
        const page = await browser.newPage();
        await page.goto(config.url, { waitUntil: 'networkidle2' });
        await page.waitForSelector(config.selector);
        this.log('Selector loaded');
        const element = await page.$(config.selector);
        const text = await page.evaluate(element => { return element.textContent; }, element);
        await browser.close();

        return text;
    }
}
