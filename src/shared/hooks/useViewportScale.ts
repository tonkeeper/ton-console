import { useEffect } from 'react';
import { isDevelopmentMode } from 'src/shared';

/**
 * Hook to manage viewport meta tag scaling based on user authentication
 * Scales layout for mobile devices until adaptive layout is ready
 */
export function useViewportScale(isAuthenticated: boolean) {
    useEffect(() => {
        const metatag = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
        if (!metatag || isDevelopmentMode()) {
            return;
        }

        metatag.content = isAuthenticated 
            ? 'width=1350px' 
            : 'width=device-width, initial-scale=1.0';
    }, [isAuthenticated]);
}

