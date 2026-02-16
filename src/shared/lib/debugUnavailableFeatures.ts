/**
 * Debug utility for unavailable features
 *
 * Usage in browser console:
 * - Enable: __DEBUG_UNAVAILABLE_FEATURES__.enable()
 * - Disable: __DEBUG_UNAVAILABLE_FEATURES__.disable()
 * - Check: __DEBUG_UNAVAILABLE_FEATURES__.isEnabled()
 * - Help: __DEBUG_UNAVAILABLE_FEATURES__.help()
 */

declare global {
  interface Window {
    __DEBUG_UNAVAILABLE_FEATURES__?: {
      enable: () => void;
      disable: () => void;
      isEnabled: () => boolean;
      help: () => void;
    };
  }
}

const STORAGE_KEY = 'DEBUG_UNAVAILABLE_FEATURES';

/**
 * Check if debug mode for unavailable features is enabled
 */
export function isDebugUnavailableFeaturesEnabled(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Enable debug mode
 */
export function enableDebugUnavailableFeatures(): void {
  try {
    localStorage.setItem(STORAGE_KEY, 'true');
    console.info('✅ Debug unavailable features enabled');
    console.info('All unavailable features will now show as blocked. Refresh page to see changes.');
  } catch {
    console.error('Failed to enable debug mode');
  }
}

/**
 * Disable debug mode
 */
export function disableDebugUnavailableFeatures(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.info('❌ Debug unavailable features disabled');
    console.info('Refresh page to see changes.');
  } catch {
    console.error('Failed to disable debug mode');
  }
}

const debugAPI = {
  enable: enableDebugUnavailableFeatures,
  disable: disableDebugUnavailableFeatures,
  isEnabled: isDebugUnavailableFeaturesEnabled,
  help: () => {
    console.info('Debug Unavailable Features Help:');
    console.info('Enable:  __DEBUG_UNAVAILABLE_FEATURES__.enable()');
    console.info('Disable: __DEBUG_UNAVAILABLE_FEATURES__.disable()');
    console.info('Check:   __DEBUG_UNAVAILABLE_FEATURES__.isEnabled()');
  }
};

/**
 * Expose debug functions globally for console access
 */
if (typeof window !== 'undefined') {
  window.__DEBUG_UNAVAILABLE_FEATURES__ = debugAPI;
}
