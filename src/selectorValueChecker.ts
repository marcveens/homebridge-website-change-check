import { Logging } from 'homebridge';
import { selectors, webkit } from 'playwright';
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
    const browser = await webkit.launch();

    try {
        if (props.verboseLogging) { props.log('Initialize browser'); }
        
        const page = await browser.newPage();
        if (props.verboseLogging) { props.log('Browser initialized'); }
        await page.goto(props.changeCheck.url, { waitUntil: 'networkidle' });

        // Execute steps before actual check
        if (props.changeCheck.stepsBeforeCheck) {
            await runStepsBeforeCheck(page, props.changeCheck.stepsBeforeCheck);
        }

        const text = await page.innerText(props.changeCheck.selector, {
            timeout: props.waitForSelectorTimeout || 30000 // 30 seconds
        });

        if (props.verboseLogging) { props.log('Selector loaded'); }

        if (text) {
            foundValue = text.replace(/(?:\r\n|\r|\n)/g, '').replace(/\s+/g, ' ').trim();
        }
    } catch (e) {
        props.log.warn(e.toString());

        foundValue = props.previousValue;
    } finally {
        await browser.close();

        return foundValue;
    }
}