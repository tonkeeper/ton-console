import { BasicCurrencyAmount, TokenCurrencyAmount } from '../currency';
import { toJS } from 'mobx';

const dateFormat =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;

const serializables = [TokenCurrencyAmount, BasicCurrencyAmount];

function reviver(_: string, value: unknown): unknown {
    if (typeof value === 'string' && dateFormat.test(value)) {
        return new Date(value);
    }

    if (value && typeof value === 'object' && '$type' in value) {
        const Constructor = serializables.find(item => item.name === value.$type);
        if (Constructor) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            return new Constructor(value as any);
        }
    }

    return value;
}

export function serializeState<T>(state: T): string {
    return toJS(JSON.stringify(state));
}

export function deserializeState<T>(value: string): T {
    return JSON.parse(value, reviver);
}
