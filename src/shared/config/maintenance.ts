interface MaintenanceConfig {
    enabled: boolean;
    /** ISO 8601 date string for estimated recovery, e.g. "2026-02-14T10:00:00Z" */
    estimatedEndTime?: string;
    /** Custom message to display instead of the default */
    message?: string;
}

const BYPASS_KEY = 'bypass_maintenance';

export const maintenanceConfig: MaintenanceConfig = {
    enabled: false,
    // estimatedEndTime: "2026-02-16T08:30:00Z",
    // message: "We are performing scheduled maintenance to improve our services."
};

export function isMaintenanceActive(): boolean {
    return maintenanceConfig.enabled && localStorage.getItem(BYPASS_KEY) !== '1';
}
