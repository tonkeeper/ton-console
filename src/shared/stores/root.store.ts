import { ProjectsStore } from 'src/entities/project/model/projects.store';
import { AnalyticsGraphQueryStore } from 'src/features/analytics/model/analytics-graph-query.store';
import { AnalyticsHistoryTableStore } from 'src/features/analytics/model/analytics-history-table.store';
import { AnalyticsQueryStore } from 'src/features/analytics/model/analytics-query.store';
import { AnalyticsQueryRequestStore } from 'src/features/analytics/model/analytics-query-request.store';
import { ApiKeysStore } from 'src/features/tonapi/api-keys/model/api-keys.store';
import { AppMessagesStore } from 'src/features/app-messages/model/app-messages.store';
import { InvoicesAppStore } from 'src/features/invoices/models/invoices-app.store';
import { InvoicesTableStore } from 'src/features/invoices/models/invoices-table.store';
import { JettonStore } from 'src/features/jetton/model/jetton.store';
import { LiteproxysStore } from 'src/features/tonapi/liteproxy/model/liteproxy.store';
import { TonApiStatsStore } from 'src/features/tonapi/statistics/model/ton-api-stats.store';
import { TonApiTiersStore } from 'src/features/tonapi/pricing/model/ton-api-tiers.store';
import { BalanceStore } from 'src/entities/balance/model/balance.store';
import { DappStore } from 'src/entities/dapp/model/dapp.store';
import { AnalyticsGPTGenerationStore } from 'src/features/analytics/model/analytics-gpt-generation.store';
import { UserStore } from 'src/entities/user/model/user.store';
import { AppStore } from './app.store';
import { awaitValueResolved } from 'src/shared';

export const userStore = new UserStore();
export const projectsStore = new ProjectsStore();
export const appStore = new AppStore({ userStore, projectsStore });

let balanceStore: BalanceStore;
let dappStore: DappStore;
let analyticsGraphQueryStore: AnalyticsGraphQueryStore;
let analyticsHistoryTableStore: AnalyticsHistoryTableStore;
let analyticsQueryStore: AnalyticsQueryStore;
let analyticsQuerySQLRequestStore: AnalyticsQueryRequestStore;
let analyticsQueryGPTRequestStore: AnalyticsQueryRequestStore;
let analyticsGPTGenerationStore: AnalyticsGPTGenerationStore;
let apiKeysStore: ApiKeysStore;
let appMessagesStore: AppMessagesStore;
let invoicesAppStore: InvoicesAppStore;
let invoicesTableStore: InvoicesTableStore;
let jettonStore: JettonStore;
let liteproxysStore: LiteproxysStore;
let tonApiStatsStore: TonApiStatsStore;
let tonApiTiersStore: TonApiTiersStore;

const initializeDependentStores = () => {
    balanceStore = new BalanceStore(projectsStore);
    dappStore = new DappStore(projectsStore);
    analyticsGraphQueryStore = new AnalyticsGraphQueryStore();
    analyticsHistoryTableStore = new AnalyticsHistoryTableStore();
    analyticsQueryStore = new AnalyticsQueryStore();
    analyticsQuerySQLRequestStore = new AnalyticsQueryRequestStore();
    analyticsQueryGPTRequestStore = new AnalyticsQueryRequestStore();
    analyticsGPTGenerationStore = new AnalyticsGPTGenerationStore();
    apiKeysStore = new ApiKeysStore();
    appMessagesStore = new AppMessagesStore();
    invoicesAppStore = new InvoicesAppStore();
    invoicesTableStore = new InvoicesTableStore();
    jettonStore = new JettonStore();
    liteproxysStore = new LiteproxysStore();
    tonApiStatsStore = new TonApiStatsStore();
    tonApiTiersStore = new TonApiTiersStore();
};

awaitValueResolved(projectsStore.projects$).then(() => {
    initializeDependentStores();
});

export {
    balanceStore,
    dappStore,
    analyticsGraphQueryStore,
    analyticsHistoryTableStore,
    analyticsQueryStore,
    analyticsQuerySQLRequestStore,
    analyticsQueryGPTRequestStore,
    analyticsGPTGenerationStore,
    apiKeysStore,
    appMessagesStore,
    invoicesAppStore,
    invoicesTableStore,
    jettonStore,
    liteproxysStore,
    tonApiStatsStore,
    tonApiTiersStore
};
