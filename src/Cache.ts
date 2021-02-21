type CacheEntries = {
    [key: string]: CacheEntry;
}

class CacheEntry {
    value: string | undefined = undefined;
    // Used to know if it's the first value after initializing the Homebridge plugin
    nthValue: number = 0;
}

export class Cache {
    private cache: CacheEntries = {};

    setValue(key: string, value: string | undefined) {
        if (!this.exists(key)) {
            this.createEntry(key);
        }

        this.cache[key].value = value;
        this.cache[key].nthValue++;
    }

    getValue(key: string) {
        return this.exists(key) ? this.cache[key].value : undefined;
    }

    hasValueChangedMoreThanOnce(key: string) {
        return this.exists(key) ? this.cache[key].nthValue > 1 : false;
    }

    private exists(key: string) {
        return !!this.cache[key];
    }

    private createEntry(key: string) {
        this.cache[key] = new CacheEntry();
    }
}