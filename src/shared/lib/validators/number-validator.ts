export function isNumber(val: string): boolean {
    const number = Number(val);
    return isFinite(number);
}
