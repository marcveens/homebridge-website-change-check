import { mockLogger } from '../mock/mockLogger';
import { getValueFromPage } from '../selectorValueChecker';

// This test is especially made for you to test locally with, since it can be 
// a pain to test using only the Homebridge plugin. This test makes sure 
// screenshots are made of every processed step. You can find them in the
// src/__tests__/screenshots folder after running the test.

describe('localDebugger', () => {
    it('should succeed the local debugger test', async () => {
        return getValueFromPage({
            changeCheck: {
                name: 'localDebugger',
                selector: 'main h1',
                url: 'https://www.npmjs.com',
                stepsBeforeCheck: [
                    { action: 'setInputValue', selector: '[type="search"]', value: 'homebridge-website-change-check' },
                    { action: 'waitForMilliseconds', value: 1000 },
                    { action: 'click', selector: '.fixed.top-0.left-0.bottom-0.right-0' },
                    { action: 'click', selector: '#search [type="submit"]' },
                ]
            },
            browserPath: process.env.PUPPETEER_PATH || '',
            log: mockLogger,
            waitForSelectorTimeout: 5000,
            debugMode: true
        })
            .then(value => {
                expect(value).toBe('homebridge-website-change-check');
            });
    }, 60000); // Timeout in milliseconds for the entire test
});
