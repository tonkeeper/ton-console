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
