import fs from 'fs';

export class FileCheck {
    public static async exists(path: string) {
        return new Promise<boolean>((resolve, reject) => {
            fs.access(path, (err) => {
                if (err) {
                    reject(false);
                } else {
                    resolve(true);
                }
            });
        });
    }
}