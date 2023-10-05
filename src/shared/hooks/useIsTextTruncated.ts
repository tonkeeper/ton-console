import { useCallback, useLayoutEffect, useState } from 'react';
import useResizeObserver from '@react-hook/resize-observer';

export function useIsTextTruncated(): {
    isTruncated: boolean;
    ref: (node: HTMLElement | null) => void;
} {
    const [isTruncated, setIsTruncated] = useState(false);
    const [node, ref] = useState<HTMLElement | null>(null);

    const computeIsEllipseActive = useCallback(() => {
        setIsTruncated(
            node
                ? node.offsetWidth < node.scrollWidth || node.offsetHeight < node.scrollHeight
                : false
        );
    }, [node]);

    useLayoutEffect(() => {
        computeIsEllipseActive();
    }, [computeIsEllipseActive]);

    useResizeObserver(node, computeIsEllipseActive);
    return { isTruncated, ref };
}
