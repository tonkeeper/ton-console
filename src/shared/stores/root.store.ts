import { ProjectsStore } from 'src/entities/project/model/projects.store';
import { InvoicesAppStore } from 'src/features/invoices/models/invoices-app.store';
import { InvoicesTableStore } from 'src/features/invoices/models/invoices-table.store';
import { UserStore } from 'src/entities/user/model/user.store';
import { AppStore } from './app.store';
import { awaitValueResolved } from 'src/shared';
import { client } from 'src/shared/api';

// Initialize API client with base URL from env
const apiClientBaseURL = import.meta.env.VITE_BASE_URL;
client.setConfig({ baseUrl: apiClientBaseURL, credentials: 'include' });

export const userStore = new UserStore();
export const projectsStore = new ProjectsStore();
export const appStore = new AppStore({ userStore, projectsStore });

let invoicesAppStore: InvoicesAppStore;
let invoicesTableStore: InvoicesTableStore;

const initializeDependentStores = () => {
    invoicesAppStore = new InvoicesAppStore();
    invoicesTableStore = new InvoicesTableStore();
};

awaitValueResolved(projectsStore.projects$).then(() => {
    initializeDependentStores();
});

export {
    invoicesAppStore,
    invoicesTableStore
};
