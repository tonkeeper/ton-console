import { RefCallBack } from 'react-hook-form';
import { MutableRefObject } from 'react';

export function mergeRefs(...refs: (RefCallBack | MutableRefObject<unknown>)[]): RefCallBack {
    return ref => {
        refs.forEach(item => {
            if ('current' in item) {
                item.current = ref;
            } else {
                item(ref);
            }
        });
    };
}
