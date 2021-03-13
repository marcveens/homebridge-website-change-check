import { Logging } from 'homebridge';
import puppeteer from 'puppeteer-core';
import { runStepsBeforeCheck } from './runStepsBeforeCheck';
import { ChangeCheck } from './types/optionTypes';

require('dotenv').config();

type getValueFromPageProps = {
    executablePath: string;
    changeCheck: ChangeCheck;
    waitForSelectorTimeout?: number;
    log: Logging;
    verboseLogging?: boolean;
    previousValue?: string;
};

export const getValueFromPage = async (props: getValueFromPageProps) => {
    let foundValue: string | undefined = undefined;
    const browser = await puppeteer.launch({
        executablePath: props.executablePath,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        if (props.verboseLogging) { props.log('Initialize browser'); }

        const page = await browser.newPage();
        if (props.verboseLogging) { props.log('Browser initialized'); }
        await page.goto(props.changeCheck.url, { waitUntil: 'networkidle2' });

        // Execute steps before actual check
        if (props.changeCheck.stepsBeforeCheck) {
            await runStepsBeforeCheck(page, props.changeCheck.stepsBeforeCheck);
        }

        await page.waitForSelector(props.changeCheck.selector, {
            timeout: props.waitForSelectorTimeout || 30000 // 30 seconds
        });

        if (props.verboseLogging) { props.log('Selector loaded'); }

        const element = await page.$(props.changeCheck.selector);
        const text = await page.evaluate(element => { return element.textContent; }, element);

        foundValue = text.replace(/(?:\r\n|\r|\n)/g, '').replace(/\s+/g, ' ').trim();
    } catch (e) {
        props.log.warn.bind(e.toString());

        foundValue = props.previousValue;
    } finally {
        await browser.close();

        return foundValue;
    }
}