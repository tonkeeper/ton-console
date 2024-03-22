import { AreaChartOptions } from './area-chart-options';
import { BarChartOptions } from './bar-chart-options';
import { PieChartOptions } from './pie-chart-options';
import { LineChartOptions } from './line-chart-options';

export type AnalyticsChart = AnalyticsChartOptions['type'];

export type AnalyticsChartOptions =
    | AreaChartOptions
    | LineChartOptions
    | PieChartOptions
    | BarChartOptions;

export type AnalyticsChartsConfig = AnalyticsChartOptions[];
