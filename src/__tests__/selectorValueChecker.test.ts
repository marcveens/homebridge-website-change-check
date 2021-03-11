import { getValueFromPage } from "../selectorValueChecker";

describe('selectorValueChecker', () => {
    it('should be able to fetch value from webpage', () => {
        // arrange + act + assert
        return getValueFromPage({
            changeCheck: {
                name: 'test',
                selector: '.markdown-body h1',
                url: 'https://github.com/marcveens/homebridge-website-change-check',
            },
            executablePath: process.env.PUPPETEER_PATH || '',
            log: console.log
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
                url: 'https://github.com/marcveens/homebridge-website-change-check',
            },
            executablePath: process.env.PUPPETEER_PATH || '',
            log: console.log,
            waitForSelectorTimeout: 2000 // Used to make the test not wait 30 seconds before timing out
        })
            .then(value => {
                expect(value).toBe(undefined);
            });
    });
});