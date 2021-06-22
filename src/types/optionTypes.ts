import { TriggerStep } from './TriggerStep';

export type ChangeCheck = {
    name: string;
    url: string;
    selector: string;
    checkInterval?: number;
    stepsBeforeCheck?: TriggerStep[];
    ignoreValues?: string[];
};

export type Options = {
    changeChecks: ChangeCheck[];
    verbose?: boolean;
};