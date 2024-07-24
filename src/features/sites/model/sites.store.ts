import { AxiosError } from 'axios';
import { makeAutoObservable } from 'mobx';
import { projectsStore } from 'src/entities';
import { Loadable, createImmediateReaction } from 'src/shared';
import { mockLoaders } from './__mocks__/loaders';

export interface Site {
    id: number;
    domain: string;
    adnl_address: string;
    endpoints: string[];
}

class SitesStore {
    sites$ = new Loadable<Site[]>([]);

    constructor() {
        makeAutoObservable(this);

        createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                this.clearState();

                if (project) {
                    this.loadSites();
                }
            }
        );
    }

    loadSites = this.sites$.createAsyncAction(async () => {
        const response = await mockLoaders.getSites();
        return response;
    });

    addSite = this.sites$.createAsyncAction(
        async (data: { domain: string }) =>
            mockLoaders.addSite(data).then(site => [...this.sites$.value, site]),
        {
            successToast: {
                title: 'Site added successfully'
            },
            errorToast: e => {
                const error = e as AxiosError;
                const response = error.response?.data as { error: string };

                return {
                    title: 'Site adding error',
                    description: response?.error
                };
            }
        }
    );

    clearState(): void {
        this.sites$.clear();
    }
}

export const sitesStore = new SitesStore();
