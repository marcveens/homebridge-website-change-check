export const asyncTimeout = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};