import { mockLogger } from "../mock/mockLogger";
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
            browserPath: process.env.PUPPETEER_PATH || '',
            log: mockLogger,
            waitForSelectorTimeout: 5000
        })
            .then(value => {
                expect(value).toBe('homebridge-website-change-check');
            });
    }, 10000);

    it('should return null if selector not found', () => {
        // arrange + act + assert
        return getValueFromPage({
            changeCheck: {
                name: 'test',
                selector: '.markdown-body h98',
                url: 'http://localhost:8080/available-selector',
            },
            browserPath: process.env.PUPPETEER_PATH || '',
            log: mockLogger,
            waitForSelectorTimeout: 1000 // Used to make the test not wait 30 seconds before timing out
        })
            .then(value => {
                expect(value).toBe(undefined);
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
            browserPath: process.env.PUPPETEER_PATH || '',
            log: mockLogger,
            waitForSelectorTimeout: 5000
        })
            .then(value => {
                expect(value).toBe('This is what I\'m looking for.');
            });
    }, 10000);

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
            browserPath: process.env.PUPPETEER_PATH || '',
            log: mockLogger,
            waitForSelectorTimeout: 5000
        })
            .then(value => {
                expect(value).toBe('This is what I\'m looking for.');
            });
    }, 10000);

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
    //         log: mockLogger,
    //         waitForSelectorTimeout: 7000
    //     })
    //         .then(value => {
    //             expect(value).toBe('This is what I\'m looking for.');
    //         });
    // }, 20000);
});