export function isDevelopmentMode(): boolean {
    return import.meta.env.MODE === 'development';
}
