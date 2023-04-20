import BigNumber from 'bignumber.js';

export type Amount = string | number | BigNumber;

export function hasProperties<T extends string>(
    value: unknown,
    propertyKeys: T[]
): value is Record<T, unknown> {
    if (!value || typeof value !== 'object') {
        return false;
    }

    return propertyKeys.every(propertyKey => propertyKey in value);
}

export function hasProperty<T extends string>(
    value: unknown,
    propertyKey: T
): value is Record<T, unknown> {
    return hasProperties(value, [propertyKey]);
}

export function exhaustiveCheck(val: never): void {
    console.error('Case', val, 'was not included to the switch-case');
}
