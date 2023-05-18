import { RefCallBack } from 'react-hook-form';
import { ForwardedRef, MutableRefObject, Ref } from 'react';

export function mergeRefs(
    ...refs: (
        | RefCallBack
        | MutableRefObject<unknown>
        | ForwardedRef<unknown>
        | Ref<unknown>
        | undefined
    )[]
): RefCallBack {
    return ref => {
        refs.forEach(item => {
            if (!item) {
                return;
            }

            if ('current' in item) {
                (item as unknown as MutableRefObject<unknown>).current = ref;
            } else {
                item(ref);
            }
        });
    };
}
