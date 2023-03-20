export function getWindow(): Window | undefined {
    if (typeof window !== 'undefined') {
        return window;
    }
}
