export interface AreaChartData<T extends Record<string, number> = Record<string, number>> {
    xAxisKey: keyof T;
    points: T[];
}
