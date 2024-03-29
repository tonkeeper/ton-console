export function replaceIfNotEqual<T extends object, P extends keyof T>(
    object: T,
    property: P,
    value: T[P],
    comparator?: (a: T[P], b: T[P]) => boolean
): void {
    comparator ||= (a, b) => a === b;

    if (comparator(object[property], value)) {
        return;
    }

    object[property] = value;
}

export function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}
