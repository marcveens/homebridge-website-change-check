import { Page } from 'playwright-core';
import { TriggerStep } from './types/TriggerStep';

const asyncTimeout = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const runStepsBeforeCheck = async (page: Page, steps: TriggerStep[]) => {
    for (const step of steps) {
        if (step.action === 'setInputValue') {
            await page.fill(step.selector, step.value.toString());
            await page.dispatchEvent(step.selector, 'change');

        } else if (step.action === 'setSelectValue') {
            let stepValue = step.value.toString();

            if (step.value === '*') {
                stepValue = await page.$eval(`${step.selector} option:not([value=""]):not([value="-1"])`, el => (el as HTMLOptionElement).value);
            }

            await page.selectOption(step.selector, stepValue);

        } else if (step.action === 'waitForMilliseconds') {
            await asyncTimeout(Number(step.value));

        }
    }
};