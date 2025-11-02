import { TonAddress, UsdCurrencyAmount } from 'src/shared';

export interface AnalyticsGraphQueryBasic {
    type: 'graph';
    id: string;
    addresses: TonAddress[];
    isBetweenSelectedOnly: boolean;
    creationDate: Date;
}

export interface AnalyticsGraphQuerySuccess extends AnalyticsGraphQueryBasic {
    status: 'success';
    resultUrl: string;
    spentTimeMS: number;
    cost: UsdCurrencyAmount;
}

export interface AnalyticsGraphQueryPending extends AnalyticsGraphQueryBasic {
    status: 'executing';
}

export interface AnalyticsGraphQueryError extends AnalyticsGraphQueryBasic {
    status: 'error';
    errorReason: string;
    spentTimeMS: number;
    cost?: UsdCurrencyAmount;
}

export type AnalyticsGraphQuery =
    | AnalyticsGraphQuerySuccess
    | AnalyticsGraphQueryPending
    | AnalyticsGraphQueryError;
