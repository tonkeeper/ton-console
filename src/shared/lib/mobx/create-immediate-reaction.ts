import { reaction } from 'mobx';

export function createImmediateReaction<T>(
    ...args: Parameters<typeof reaction<T, true>>
): () => void {
    return reaction(args[0], args[1], { fireImmediately: true, ...(args[2] || {}) });
}
