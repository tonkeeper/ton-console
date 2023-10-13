import { TonCurrencyAmount } from 'src/shared';

export interface AnalyticsQueryTemplate {
    request: string;
    estimatedTimeMS: number;
    estimatedCost: TonCurrencyAmount;
}

export interface AnalyticsQueryBasic extends AnalyticsQueryTemplate {
    id: string;
    status: 'executing' | 'success' | 'error';
    creationDate: Date;
}

export interface AnalyticsQueryCompleted extends AnalyticsQueryBasic {
    status: 'success' | 'error';
    spentTime: number;
    cost: TonCurrencyAmount;
}

export interface AnalyticsQuerySuccessful extends AnalyticsQueryCompleted {
    status: 'success';
    csvUrl: string;
}

export interface AnalyticsQueryErrored extends AnalyticsQueryBasic {
    status: 'error';
    errorReason: string;
}

export interface AnalyticsQueryPending extends AnalyticsQueryBasic {
    status: 'executing';
}

export type AnalyticsQuery =
    | AnalyticsQueryPending
    | AnalyticsQuerySuccessful
    | AnalyticsQueryErrored;
