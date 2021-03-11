import fs from 'fs';

export class FileCheck {
    public static async exists(path: string) {
        return new Promise<boolean>(resolve => {
            fs.access(path, (err) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }
}