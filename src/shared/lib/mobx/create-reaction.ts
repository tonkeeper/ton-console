import { reaction } from 'mobx';

export function createReaction<T, FireImmediately extends boolean = false>(
    ...args: Parameters<typeof reaction<T, FireImmediately>>
): void {
    setTimeout(() => reaction(...args));
}
