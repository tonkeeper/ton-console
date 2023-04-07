export function toColor(value: number): string {
    value = value % 255;

    const getComponent = (shift: 0 | 2 | 4): number =>
        Math.round(Math.sin(0.024 * value + shift) * 127 + 128);

    const r = getComponent(0);
    const g = getComponent(2);
    const b = getComponent(4);
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}
