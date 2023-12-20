export function isNumber(val: string | number): boolean {
    const number = Number(val);
    return isFinite(number);
}
