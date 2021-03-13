import { Logging } from "homebridge";
import { Cache } from "./Cache";
import { getValueFromPage } from "./selectorValueChecker";
import { ChangeCheck } from "./types/optionTypes";
import { asyncTimeout } from "./utils/asyncTimeout";

type HandlerProps = {
    browserPath: string;
    changeCheck: ChangeCheck;
    cache: Cache;
    log: Logging;
    verboseLogging?: boolean;
    waitForSelectorTimeout?: number;
    toggleUpdate: (state: boolean) => void;
};

export const updateAccessoryStateHandler = async (props: HandlerProps) => {
    const { browserPath, cache, changeCheck, log, verboseLogging, waitForSelectorTimeout, toggleUpdate } = props;

    const value = await getValueFromPage({
        browserPath,
        changeCheck,
        log,
        verboseLogging,
        waitForSelectorTimeout
    });

    if (value) {
        props.log(`(${changeCheck.name}) Value found: "${value}". Old value: "${cache.getValue(changeCheck.name)}". Value changed? ${cache.getValue(changeCheck.name) !== value}`);
    }

    if (value && cache.getValue(changeCheck.name) !== value) {
        cache.setValue(changeCheck.name, value);
        props.log('save to cache', changeCheck.name, value);

        console.log('hasValueChangedMoreThanOnce ', cache.hasValueChangedMoreThanOnce(changeCheck.name));
        // Only send update if a value changed more than once. This prevents detection from firing on first run. 
        if (cache.hasValueChangedMoreThanOnce(changeCheck.name)) {
            props.log('trigger true');
            toggleUpdate(true);
            
            // Disable motion sensor automatically after 1 second
            asyncTimeout(1000);
            toggleUpdate(false);
        }
    } else {
        props.log('trigger false');
        toggleUpdate(false);
    }
};