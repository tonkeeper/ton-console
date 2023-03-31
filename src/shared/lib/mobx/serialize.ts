import { Loadable } from './loadable';
import { TokenCurrencyAmount } from '../blockchain';
import { toJS } from 'mobx';

const dateFormat =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;

const serializables = [TokenCurrencyAmount];

function reviver(_: string, value: unknown): unknown {
    if (typeof value === 'string' && dateFormat.test(value)) {
        return new Date(value);
    }

    if (value && typeof value === 'object' && '$type' in value) {
        const Constructor = serializables.find(item => item.name === value.$type);
        if (Constructor) {
            return new Constructor(
                value as unknown as ConstructorParameters<typeof Constructor>[0]
            );
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

export function serializeLoadableState<T>(state: Loadable<T>): string {
    return serializeState(state.value);
}

export function deserializeLoadableState<T>(stateString: string): Loadable<T> {
    return new Loadable<T>(deserializeState(stateString));
}
