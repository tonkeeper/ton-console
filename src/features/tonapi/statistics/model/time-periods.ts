/**
 * Time period configuration for statistics charts
 * Ensures all charts use consistent time ranges with optimal step size (max 500 data points)
 */

export type TimePeriod = 'last_6h' | 'last_24h' | 'last_7d' | 'last_30d';

export interface PeriodConfig {
    period: TimePeriod;
    label: string;
    durationSeconds: number;
    stepSeconds: number;
    maxPoints: number;
}

const PERIODS: Record<TimePeriod, PeriodConfig> = {
    last_6h: {
        period: 'last_6h',
        label: '6 hours',
        durationSeconds: 6 * 3600,
        stepSeconds: 60, // 1 minute → 360 points
        maxPoints: 360
    },
    last_24h: {
        period: 'last_24h',
        label: '24 hours',
        durationSeconds: 24 * 3600,
        stepSeconds: 180, // 3 minutes → 480 points
        maxPoints: 480
    },
    last_7d: {
        period: 'last_7d',
        label: '7 days',
        durationSeconds: 7 * 24 * 3600,
        stepSeconds: 1800, // 30 minutes → 336 points
        maxPoints: 336
    },
    last_30d: {
        period: 'last_30d',
        label: '30 days',
        durationSeconds: 30 * 24 * 3600,
        stepSeconds: 7200, // 2 hours → 360 points
        maxPoints: 360
    }
};

/**
 * Get configuration for a specific time period
 */
export function getPeriodConfig(period: TimePeriod = 'last_6h'): PeriodConfig {
    return PERIODS[period];
}

/**
 * Calculate start and end timestamps for a given period
 * @param period - Time period to calculate
 * @returns Object with start and end timestamps (in seconds)
 */
export function getTimestampRange(period: TimePeriod = 'last_6h'): {
    start: number;
    end: number;
} {
    const config = getPeriodConfig(period);
    const now = Math.floor(Date.now() / 1000);
    const start = now - config.durationSeconds;

    return { start, end: now };
}

/**
 * Get all available periods for UI selection
 */
export function getAllPeriods(): Array<{ value: TimePeriod; label: string }> {
    return [
        { value: 'last_6h', label: '6 hours' },
        { value: 'last_24h', label: '24 hours' },
        { value: 'last_7d', label: '7 days' },
        { value: 'last_30d', label: '30 days' }
    ];
}
