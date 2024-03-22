import { AnalyticsChartOptions, AnalyticsQuery } from 'src/features';

export type AnalyticsDashboardWidgetOptions =
    | AnalyticsChartOptions
    | {
          type: 'table';
      };

export interface AnalyticsDashboardWidget {
    options: AnalyticsDashboardWidgetOptions;
    queryId: AnalyticsQuery['id'];
}
