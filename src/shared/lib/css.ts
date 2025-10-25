import { crc32c } from '@ton/core';
import { Buffer } from 'buffer';

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

export function hexToRGBA(hex: string, alpha?: string | number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    } else {
        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }
}

export function hashString(str: string): number {
    const uintArray = crc32c(Buffer.from(str, 'utf-8'));
    const buf = Buffer.from(uintArray.buffer, uintArray.byteOffset, uintArray.byteLength);
    const byteLength = Math.min(buf.length, 6);

    return buf.readUIntBE(0, byteLength);
}

export function lightHashString(str: string): number {
    let hash = 0;

    if (str.length === 0) {
        return 0;
    }

    for (let i = 0; i < str.length; i++) {
        const chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
    }
    return hash;
}
