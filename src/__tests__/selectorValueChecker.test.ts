import { Logging } from "homebridge";
import { getValueFromPage } from "../selectorValueChecker";

describe('selectorValueChecker', () => {
    it('should be able to fetch value from webpage', () => {
        // arrange + act + assert
        return getValueFromPage({
            changeCheck: {
                name: 'test',
                selector: '.markdown-body h1',
                url: 'http://localhost:8080/available-selector',
            },
            executablePath: process.env.PUPPETEER_PATH || '',
            log: console as unknown as Logging,
        })
            .then(value => {
                expect(value).toBe('homebridge-website-change-check');
            });
    });

    it('should return null if selector not found', () => {
        // arrange + act + assert
        return getValueFromPage({
            changeCheck: {
                name: 'test',
                selector: '.markdown-body h98',
                url: 'http://localhost:8080/available-selector',
            },
            executablePath: process.env.PUPPETEER_PATH || '',
            log: console as unknown as Logging,
            waitForSelectorTimeout: 1000 // Used to make the test not wait 30 seconds before timing out
        })
            .then(value => {
                expect(value).toBe(undefined);
            });
    });

    it('should return previous value if selector not found after first visit', () => {
        // arrange + act + assert
        return getValueFromPage({
            changeCheck: {
                name: 'test',
                selector: '.markdown-body h98',
                url: 'http://localhost:8080/available-selector',
            },
            executablePath: process.env.PUPPETEER_PATH || '',
            log: console as unknown as Logging,
            waitForSelectorTimeout: 1000, // Used to make the test not wait 30 seconds before timing out,
            previousValue: 'testValue'
        })
            .then(value => {
                expect(value).toBe('testValue');
            });
    });

    it('should return value after a select and input change', () => {
        // arrange + act + assert
        return getValueFromPage({
            changeCheck: {
                name: 'test',
                selector: '.output-value',
                url: 'http://localhost:8080/form-change',
                stepsBeforeCheck: [
                    { action: 'setSelectValue', selector: '#select', value: '2' },
                    { action: 'setInputValue', selector: '#input', value: 'test' }
                ]
            },
            executablePath: process.env.PUPPETEER_PATH || '',
            log: console as unknown as Logging,
            waitForSelectorTimeout: 7000
        })
            .then(value => {
                expect(value).toBe('This is what I\'m looking for.');
            });
    });

    it('should return value after a select and input change and button click', () => {
        // arrange + act + assert
        return getValueFromPage({
            changeCheck: {
                name: 'test',
                selector: '.output-value',
                url: 'http://localhost:8080/form-click',
                stepsBeforeCheck: [
                    { action: 'setSelectValue', selector: '#select', value: '2' },
                    { action: 'setInputValue', selector: '#input', value: 'test' },
                    { action: 'click', selector: '#button' }
                ]
            },
            executablePath: process.env.PUPPETEER_PATH || '',
            log: console as unknown as Logging,
            waitForSelectorTimeout: 7000
        })
            .then(value => {
                expect(value).toBe('This is what I\'m looking for.');
            });
    });

    // it('should run practice test', () => {
    //     // arrange + act + assert
    //     return getValueFromPage({
    //         changeCheck: {
    //             "name": "communityvaccination",
    //             "url": "https://www.communityvaccination.org/default.aspx",
    //             "selector": "#ContentPlaceHolder1_UpdatePanelSchedule tr:nth-child(2)",
    //             "checkInterval": 300000,
    //             "stepsBeforeCheck": [
    //                 {
    //                     "action": "setSelectValue",
    //                     "selector": "#ContentPlaceHolder1_DropDownListProfessions",
    //                     "value": "68"
    //                 },
    //                 {
    //                     "action": "waitForMilliseconds",
    //                     "value": 2000
    //                 },
    //                 {
    //                     "action": "setSelectValue",
    //                     "selector": "#ContentPlaceHolder1_DropDownListOpKey",
    //                     "value": "*"
    //                 }
    //             ]
    //         },
    //         executablePath: process.env.PUPPETEER_PATH || '',
    //         log: console as unknown as Logging,
    //         waitForSelectorTimeout: 7000
    //     })
    //         .then(value => {
    //             expect(value).toBe('This is what I\'m looking for.');
    //         });
    // }, 20000);
});