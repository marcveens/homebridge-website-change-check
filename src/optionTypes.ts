export type ChangeCheck = {
    name: string;
    url: string;
    selector: string;
    ignoreText?: string;
    checkInterval?: number;
};

export type Options = {
    changeChecks: ChangeCheck[];
};