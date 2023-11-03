export function addPath(url: string, path: string): string {
    const urlWithoutSlash = url.endsWith('/') ? url.slice(0, -1) : url;
    return `${urlWithoutSlash}/${path}`;
}

export function eqPaths(url1: string | undefined, url2: string | undefined): boolean {
    if (!url1 || !url2) {
        return false;
    }

    if (!url1.startsWith('/')) {
        url1 = `/${url1}`;
    }

    if (!url2.startsWith('/')) {
        url2 = `/${url2}`;
    }
    return url1 === url2;
}
