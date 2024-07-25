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

    deleteSite = this.sites$.createAsyncAction(
        async (id: number) => {
            await mockLoaders.deleteSite(id);
            return this.sites$.value.filter(site => site.id !== id);
        },
        {
            successToast: {
                title: 'Site deleted successfully'
            },
            errorToast: e => {
                const error = e as AxiosError;
                const response = error.response?.data as { error: string };

                return {
                    title: 'Site deleting error',
                    description: response?.error
                };
            }
        }
    );

    updateEndpoints = this.sites$.createAsyncAction(
        async (siteId: number, endpoints: string[]) => {
            await mockLoaders.updateEndpoints(siteId, endpoints);
            return this.sites$.value.map(site =>
                site.id === siteId ? { ...site, endpoints } : site
            );
        },
        {
            successToast: {
                title: 'Endpoint saved successfully'
            },
            errorToast: e => {
                const error = e as AxiosError;
                const response = error.response?.data as { error: string };

                return {
                    title: 'Endpoint saving error',
                    description: response?.error
                };
            }
        }
    );

    getSiteByDomain(domain: string): Site | undefined {
        return this.sites$.value.find(site => site.domain === domain);
    }

    clearState(): void {
        this.sites$.clear();
    }
}

export const sitesStore = new SitesStore();
