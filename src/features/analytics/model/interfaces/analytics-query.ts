import { TonCurrencyAmount } from 'src/shared';

export interface AnalyticsTableSource {
    headings: string[];
    data: string[][];
    isAllDataPresented: boolean;
}

export interface AnalyticsQueryTemplate {
    request: string;
    estimatedTimeMS: number;
    estimatedCost: TonCurrencyAmount;
}

export interface AnalyticsQueryBasic extends AnalyticsQueryTemplate {
    type: 'query';
    id: string;
    status: 'executing' | 'success' | 'error';
    gptPrompt?: string;
    creationDate: Date;
}

export interface AnalyticsQueryCompleted extends AnalyticsQueryBasic {
    status: 'success' | 'error';
    spentTimeMS: number;
    cost: TonCurrencyAmount;
}

export interface AnalyticsQuerySuccessful extends AnalyticsQueryCompleted {
    status: 'success';
    csvUrl: string;
    preview: AnalyticsTableSource;
}

export interface AnalyticsQueryErrored extends AnalyticsQueryCompleted {
    status: 'error';
    errorReason: string;
}

export interface AnalyticsQueryPending extends AnalyticsQueryBasic {
    status: 'executing';
}

export function isAnalyticsQueryCompleted(
    query: AnalyticsQueryBasic
): query is AnalyticsQueryCompleted {
    return query.status === 'success' || query.status === 'error';
}

export function isAnalyticsQuerySuccessful(
    query: AnalyticsQueryBasic
): query is AnalyticsQuerySuccessful {
    return query.status === 'success';
}

export type AnalyticsQuery =
    | AnalyticsQueryPending
    | AnalyticsQuerySuccessful
    | AnalyticsQueryErrored;
