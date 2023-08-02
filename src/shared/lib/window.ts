export function getWindow(): Window | undefined {
    if (typeof window !== 'undefined') {
        return window;
    }
}

export function openLink(href: string, target = '_self'): void {
    const window = getWindow();
    if (!window) {
        return;
    }

    window.open(href, target, 'noopener');
}

export function openLinkBlank(href: string): void {
    openLink(href, '_blank');
}

export function subscribeToVisibilitychange(onFocus: () => void, onHide: () => void): () => void {
    const document = getWindow()?.document;
    if (!document) {
        return () => {};
    }

    if (!document.hidden) {
        onFocus();
    }

    const listener = (): void => {
        if (!document.hidden) {
            onFocus();
        } else {
            onHide();
        }
    };

    document.addEventListener('visibilitychange', listener);
    return () => document.removeEventListener('visibilitychange', listener);
}

export function setIntervalWhenPageOnFocus(
    intervalCallback: () => void,
    timeout: number
): () => void {
    let interval: ReturnType<typeof setInterval>;
    const dispose = subscribeToVisibilitychange(
        () => (interval = setInterval(intervalCallback, timeout)),
        () => clearInterval(interval)
    );

    return () => {
        dispose();
        clearInterval(interval);
    };
}
