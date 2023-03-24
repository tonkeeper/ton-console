import { reaction } from 'mobx';

export function createReaction(...args: Parameters<typeof reaction>): void {
    setTimeout(() => reaction(...args));
}
