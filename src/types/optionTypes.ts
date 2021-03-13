import { TriggerStep } from './TriggerStep';

export type ChangeCheck = {
    name: string;
    url: string;
    selector: string;
    checkInterval?: number;
    stepsBeforeCheck?: TriggerStep[];
};

export type Options = {
    changeChecks: ChangeCheck[];
    verbose?: boolean;
};