import { Cache } from '../Cache';

describe('Cache', () => {
    let cache: Cache;

    beforeEach(() => {
        cache = new Cache();
    });

    it('should start with empty cache', () => {
        // arrange + act + assert
        expect(cache.getValue('myKey')).toBe(undefined);
    });

    it('should set + get value', () => {
        // arrange + act
        cache.setValue('myKey', '12345');

        // act + assert
        expect(cache.getValue('myKey')).toBe('12345');
    });

    it('should not confirm that a value has changed more than once after first change', () => {
        // arrange + act + assert
        expect(cache.hasValueChangedMoreThanOnce('myKey')).toBe(false);
        cache.setValue('myKey', 'firstUpdate');
        expect(cache.hasValueChangedMoreThanOnce('myKey')).toBe(false);
        cache.setValue('myKey', 'secondUpdate');
        expect(cache.hasValueChangedMoreThanOnce('myKey')).toBe(true);
    });
});