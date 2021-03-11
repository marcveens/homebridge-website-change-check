import { FileCheck } from '../FileCheck';
import path from 'path';

describe('FileCheck', () => {
    it('should return true if file exists', async () => {
        // arrange + act + assert
        return expect(FileCheck.exists(path.join(__dirname, './data/mock.txt'))).resolves.toBe(true);
    });

    it('should return false if file does not exists', async () => {
        // arrange + act + assert
        return expect(FileCheck.exists(path.join(__dirname, './data/mock2.txt'))).rejects.toBe(false);
    });
});