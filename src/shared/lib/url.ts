export function addPath(url: string, path: string): string {
    const urlWithoutSlash = url.endsWith('/') ? url.slice(0, -1) : url;
    return `${urlWithoutSlash}/${path}`;
}
