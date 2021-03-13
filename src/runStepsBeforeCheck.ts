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
            let stepValue = step.value.toString();
            await page.waitForSelector(step.selector);

            if (step.value === '*') {
                stepValue = await page.$eval(`${step.selector} option:not([value=""]):not([value="-1"])`, el => (el as HTMLOptionElement).value);
            }

            await page.select(step.selector, stepValue);

        } else if (step.action === 'waitForMilliseconds') {
            await page.waitForTimeout(Number(step.value));
        }
    }
};