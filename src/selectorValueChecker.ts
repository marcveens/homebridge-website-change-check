import { Logging } from 'homebridge';
import puppeteer from 'puppeteer-core';
import { ChangeCheck } from './types/optionTypes';

require('dotenv').config();

type getValueFromPageProps = {
    changeCheck: ChangeCheck;
    waitForSelectorTimeout?: number;
    log: Logging | Console['log'];
    verboseLogging?: boolean;
};

export const getValueFromPage = async (props: getValueFromPageProps) => {
    let foundValue: string | undefined = undefined;
    const browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_PATH || '/usr/bin/chromium-browser',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        if (props.verboseLogging) { props.log('Initialize browser'); }


        if (props.verboseLogging) { props.log('Browser initialized'); }

        const page = await browser.newPage();
        await page.goto(props.changeCheck.url, { waitUntil: 'networkidle2' });
        await page.waitForSelector(props.changeCheck.selector, {
            timeout: props.waitForSelectorTimeout || 30000 // 30 seconds
        });

        if (props.verboseLogging) { props.log('Selector loaded'); }

        const element = await page.$(props.changeCheck.selector);
        const text = await page.evaluate(element => { return element.textContent; }, element);

        foundValue = text;
    } catch (e) {
        props.log(e);

        foundValue = undefined;
    } finally {
        await browser.close();

        return foundValue;
    }
}