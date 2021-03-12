import puppeteer from 'puppeteer-core';
import { TriggerStep } from './types/TriggerStep';

export const runStepsBeforeCheck = async (page: puppeteer.Page, steps: TriggerStep[]) => {
    for (const step of steps) {
        if (step.action === 'setInputValue') {
            await page.waitForSelector(step.selector);
            await page.$eval(step.selector, (el, value) => {
                (el as HTMLInputElement).value = value as string;
                el.dispatchEvent(new Event('change'));
            }, step.value.toString());
        } else if (step.action === 'setSelectValue') {
            await page.waitForSelector(step.selector);
            await page.select(step.selector, step.value.toString());
        }
    }
};