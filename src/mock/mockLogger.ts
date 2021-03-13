import { Logging, LogLevel } from "homebridge";

export const mockLogger: Logging = (message: string, ...parameters: any[]) => {
    console.log(message, ...parameters);
};

mockLogger.prefix = '';

mockLogger.info = (message: string, ...parameters: any[]) => {
    console.info(message, ...parameters);
};

mockLogger.warn = (message: string, ...parameters: any[]) => {
    console.warn(message, ...parameters);
};

mockLogger.error = (message: string, ...parameters: any[]) => {
    console.error(message, ...parameters);
};

mockLogger.debug = (message: string, ...parameters: any[]) => {
    console.debug(message, ...parameters);
};

mockLogger.log = (level: LogLevel, message: string, ...parameters: any[]) => {
    console.log(message, parameters);
};