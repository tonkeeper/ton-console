import { ProjectsStore } from 'src/entities/project/model/projects.store';
import { AnalyticsGraphQueryStore } from 'src/features/analytics/model/analytics-graph-query.store';
import { AnalyticsHistoryTableStore } from 'src/features/analytics/model/analytics-history-table.store';
import { AnalyticsQueryStore } from 'src/features/analytics/model/analytics-query.store';
import { AnalyticsQueryRequestStore } from 'src/features/analytics/model/analytics-query-request.store';
import { AppMessagesStore } from 'src/features/app-messages/model/app-messages.store';
import { InvoicesAppStore } from 'src/features/invoices/models/invoices-app.store';
import { InvoicesTableStore } from 'src/features/invoices/models/invoices-table.store';
import { LiteproxysStore } from 'src/features/tonapi/liteproxy/model/liteproxy.store';
import { TonApiStatsStore } from 'src/features/tonapi/statistics/model/ton-api-stats.store';
import { BalanceStore } from 'src/entities/balance/balance.store';
import { DappStore } from 'src/entities/dapp/model/dapp.store';
import { AnalyticsGPTGenerationStore } from 'src/features/analytics/model/analytics-gpt-generation.store';
import { UserStore } from 'src/entities/user/model/user.store';
import { AppStore } from './app.store';
import { awaitValueResolved } from 'src/shared';
import { RestApiTiersStore } from 'src/features/tonapi/pricing/model/rest-api-tiers.store';

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
let appMessagesStore: AppMessagesStore;
let invoicesAppStore: InvoicesAppStore;
let invoicesTableStore: InvoicesTableStore;
let liteproxysStore: LiteproxysStore;
let tonApiStatsStore: TonApiStatsStore;
let restApiTiersStore: RestApiTiersStore;

const initializeDependentStores = () => {
    balanceStore = new BalanceStore(projectsStore);
    dappStore = new DappStore(projectsStore);
    analyticsGraphQueryStore = new AnalyticsGraphQueryStore();
    analyticsHistoryTableStore = new AnalyticsHistoryTableStore();
    analyticsQueryStore = new AnalyticsQueryStore();
    analyticsQuerySQLRequestStore = new AnalyticsQueryRequestStore();
    analyticsQueryGPTRequestStore = new AnalyticsQueryRequestStore();
    analyticsGPTGenerationStore = new AnalyticsGPTGenerationStore();
    appMessagesStore = new AppMessagesStore();
    invoicesAppStore = new InvoicesAppStore();
    invoicesTableStore = new InvoicesTableStore();
    liteproxysStore = new LiteproxysStore();
    tonApiStatsStore = new TonApiStatsStore();
    restApiTiersStore = new RestApiTiersStore();
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
    appMessagesStore,
    invoicesAppStore,
    invoicesTableStore,
    liteproxysStore,
    tonApiStatsStore,
    restApiTiersStore
};
