import { Loadable } from 'src/shared';
import { when } from 'mobx';

export async function awaitValueResolved<T>(value$: Loadable<T>): Promise<T> {
    if (value$.isResolved) {
        return value$.value;
    }

    await when(() => value$.isResolved);
    return value$.value;
}
