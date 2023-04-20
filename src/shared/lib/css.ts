export function toColor(value: number, range?: { min?: number; max?: number }): string {
    range ||= {} as { min: number; max: number };
    range.min ||= 0;
    range.max ||= 255;
    const rangeLimit = range.max - range.min;
    value = (value % rangeLimit) + range.min;

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

export function subtractPixels(value: string, subtrahend: string): string {
    value = value.replace('px', '');
    subtrahend = subtrahend.replace('px', '');
    return (Number(value) - Number(subtrahend)).toString() + 'px';
}
