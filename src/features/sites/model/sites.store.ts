import { AxiosError } from 'axios';
import { makeAutoObservable } from 'mobx';
import { projectsStore } from 'src/entities';
import { DTOTonSite, Loadable, apiClient, createImmediateReaction } from 'src/shared';

class SitesStore {
    sites$ = new Loadable<DTOTonSite[]>([]);

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
        if (!projectsStore.selectedProject) {
            throw new Error('No project selected');
        }

        const response = await apiClient.api.getTonSites({
            project_id: projectsStore.selectedProject.id
        });
        return response.data.items;
    });

    addSite = this.sites$.createAsyncAction(
        async (data: { domain: string }) => {
            if (!projectsStore.selectedProject) {
                throw new Error('No project selected');
            }

            return apiClient.api
                .createTonSite(
                    {
                        project_id: projectsStore.selectedProject.id
                    },
                    data
                )
                .then(response => [response.data.site, ...this.sites$.value]);
        },
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
        async (siteId: string) => {
            if (!projectsStore.selectedProject) {
                throw new Error('No project selected');
            }

            await apiClient.api.deleteTonSite(siteId, {
                project_id: projectsStore.selectedProject.id
            });

            return this.sites$.value.filter(site => site.id !== siteId);
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
        async (siteId: string, endpoints: string[]) => {
            if (!projectsStore.selectedProject) {
                throw new Error('No project selected');
            }

            await apiClient.api.updateTonSitesEndpoints(
                siteId,
                {
                    project_id: projectsStore.selectedProject.id
                },
                endpoints
            );

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

    getSiteByDomain(domain: string): DTOTonSite | undefined {
        return this.sites$.value.find(site => site.domain === domain);
    }

    clearState(): void {
        this.sites$.clear();
    }
}

export const sitesStore = new SitesStore();
