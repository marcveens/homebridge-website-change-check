import { Cache } from '../Cache';
import { mockLogger } from '../mock/mockLogger';
import { updateAccessoryStateHandler } from '../updateAccessoryStateHandler';

describe('updateAccessoryStateHandler', () => {
    let cache: Cache;

    beforeAll(() => {
        cache = new Cache();
    });

    it('should trigger update when selector value is found from clean cache', () => {
        // arrange
        const triggerTrue = jest.fn();
        const triggerFalse = jest.fn();

        // act + assert
        return updateAccessoryStateHandler({
            changeCheck: {
                name: 'test',
                selector: '.markdown-body h1',
                url: 'http://localhost:8080/available-selector',
            },
            browserPath: process.env.PUPPETEER_PATH || '',
            log: mockLogger,
            waitForSelectorTimeout: 1000,
            cache,
            toggleUpdate: state => {
                if (state) {
                    triggerTrue();
                } else {
                    triggerFalse();
                }
            }
        })
            .then(() => {
                return updateAccessoryStateHandler({
                    changeCheck: {
                        name: 'test',
                        selector: '.markdown-body h2',
                        url: 'http://localhost:8080/available-selector',
                    },
                    browserPath: process.env.PUPPETEER_PATH || '',
                    log: mockLogger,
                    waitForSelectorTimeout: 1000,
                    cache,
                    toggleUpdate: state => {
                        if (state) {
                            triggerTrue();
                        } else {
                            triggerFalse();
                        }
                    }
                })
            })
            .then(() => {
                expect(triggerTrue).toHaveBeenCalledTimes(1);
                expect(triggerFalse).toHaveBeenCalledTimes(1);
            });
    });

    it('should trigger update when selector value is found', () => {
        // arrange
        cache.setValue('test', 'initial');

        const triggerTrue = jest.fn();
        const triggerFalse = jest.fn();

        // act + assert
        return updateAccessoryStateHandler({
            changeCheck: {
                name: 'test',
                selector: '.markdown-body h1',
                url: 'http://localhost:8080/available-selector',
            },
            browserPath: process.env.PUPPETEER_PATH || '',
            log: mockLogger,
            waitForSelectorTimeout: 1000,
            cache,
            toggleUpdate: state => {
                if (state) {
                    triggerTrue();
                } else {
                    triggerFalse();
                }
            }
        }).then(() => {
            expect(triggerTrue).toHaveBeenCalledTimes(1);
            expect(triggerFalse).toHaveBeenCalledTimes(1);
        });
    });

    it('should trigger false when selector value is not found', () => {
        // arrange
        cache.setValue('test', 'initial');

        const triggerTrue = jest.fn();
        const triggerFalse = jest.fn();

        // act + assert
        return updateAccessoryStateHandler({
            changeCheck: {
                name: 'test',
                selector: '.markdown-body h19',
                url: 'http://localhost:8080/available-selector',
            },
            browserPath: process.env.PUPPETEER_PATH || '',
            log: mockLogger,
            waitForSelectorTimeout: 1000,
            cache,
            toggleUpdate: state => {
                if (state) {
                    triggerTrue();
                } else {
                    triggerFalse();
                }
            }
        }).then(() => {
            expect(triggerTrue).toHaveBeenCalledTimes(0);
            expect(triggerFalse).toHaveBeenCalledTimes(1);
        });
    });

    it('should trigger false when value is in ignoreValues list', () => {
        // arrange
        cache.setValue('test', 'initial');

        const triggerTrue = jest.fn();
        const triggerFalse = jest.fn();

        // act + assert
        return updateAccessoryStateHandler({
            changeCheck: {
                name: 'test',
                selector: '.markdown-body h1',
                url: 'http://localhost:8080/available-selector',
                ignoreValues: ['homebridge-website-change-check']
            },
            browserPath: process.env.PUPPETEER_PATH || '',
            log: mockLogger,
            waitForSelectorTimeout: 1000,
            cache,
            toggleUpdate: state => {
                if (state) {
                    triggerTrue();
                } else {
                    triggerFalse();
                }
            }
        }).then(() => {
            expect(triggerTrue).toHaveBeenCalledTimes(0);
            expect(triggerFalse).toHaveBeenCalledTimes(1);
        });
    });
});