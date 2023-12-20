export type AnalyticsTablesSchema = Record<string, readonly string[]>;

export type AnalyticsTablePagination = {
    filter: {
        type?: AnalyticsQueryType[];
        onlyRepeating: boolean;
    };
};

export type AnalyticsQueryType = 'sql' | 'gpt' | 'graph';
