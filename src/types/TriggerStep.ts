export type TriggerStep = 
    | { action: 'setSelectValue', selector: string, value: string | number | '*' }
    | { action: 'setInputValue', selector: string, value: string | number }
    | { action: 'waitForMilliseconds', value: number }
    | { action: 'click', selector: string }
    ;