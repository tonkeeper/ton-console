import { ProjectsStore } from 'src/entities/project/model/projects.store';
import { AppMessagesStore } from 'src/features/app-messages/model/app-messages.store';
import { InvoicesAppStore } from 'src/features/invoices/models/invoices-app.store';
import { InvoicesTableStore } from 'src/features/invoices/models/invoices-table.store';
import { LiteproxysStore } from 'src/features/tonapi/liteproxy/model/liteproxy.store';
import { TonApiStatsStore } from 'src/features/tonapi/statistics/model/ton-api-stats.store';
import { BalanceStore } from 'src/entities/balance/balance.store';
import { DappStore } from 'src/entities/dapp/model/dapp.store';
import { UserStore } from 'src/entities/user/model/user.store';
import { AppStore } from './app.store';
import { awaitValueResolved } from 'src/shared';
import { RestApiTiersStore } from 'src/features/tonapi/pricing/model/rest-api-tiers.store';
import { client } from 'src/shared/api';

// Initialize API client with base URL from env
const apiClientBaseURL = import.meta.env.VITE_BASE_URL;
client.setConfig({ baseUrl: apiClientBaseURL });

export const userStore = new UserStore();
export const projectsStore = new ProjectsStore();
export const appStore = new AppStore({ userStore, projectsStore });

let balanceStore: BalanceStore;
let dappStore: DappStore;
let appMessagesStore: AppMessagesStore;
let invoicesAppStore: InvoicesAppStore;
let invoicesTableStore: InvoicesTableStore;
let liteproxysStore: LiteproxysStore;
let tonApiStatsStore: TonApiStatsStore;
let restApiTiersStore: RestApiTiersStore;

const initializeDependentStores = () => {
    balanceStore = new BalanceStore(projectsStore);
    dappStore = new DappStore(projectsStore);
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
    appMessagesStore,
    invoicesAppStore,
    invoicesTableStore,
    liteproxysStore,
    tonApiStatsStore,
    restApiTiersStore
};
