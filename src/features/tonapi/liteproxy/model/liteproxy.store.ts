import {
    apiClient,
    createImmediateReaction,
    DTOLiteproxyKey,
    DTOLiteproxyTier,
    Loadable
} from 'src/shared';
import { projectsStore } from 'src/entities';
import { makeAutoObservable } from 'mobx';

class LiteproxysStore {
    liteproxyList$ = new Loadable<DTOLiteproxyKey[]>([]);

    liteproxyTiers$ = new Loadable<DTOLiteproxyTier[] | null>(null);

    selectedTier$ = new Loadable<DTOLiteproxyTier | null>(null);

    constructor() {
        makeAutoObservable(this);

        createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                this.clearStore();

                if (project) {
                    this.fetchLiteproxyList();
                    this.fetchLiteproxyTiers();
                    this.fetchSelectedTier();
                }
            }
        );
    }

    fetchLiteproxyList = this.liteproxyList$.createAsyncAction(() =>
        apiClient.api
            .getLiteproxyKeys({ project_id: projectsStore.selectedProject!.id })
            .then(({ data }) => data.keys)
            .catch(({ response }) => {
                if (response.data.error === 'keys not found') {
                    return [];
                }

                throw Error(response);
            })
    );

    fetchLiteproxyTiers = this.liteproxyTiers$.createAsyncAction(() =>
        apiClient.api.getLiteproxyTiers().then(({ data }) => data.tiers)
    );

    fetchSelectedTier = this.selectedTier$.createAsyncAction(async () => {
        return apiClient.api
            .getProjectLiteproxyTier({ project_id: projectsStore.selectedProject!.id })
            .then(({ data }) => data.tier);
    });

    createLiteproxy = this.liteproxyList$.createAsyncAction(
        () =>
            apiClient.api
                .createLiteproxyKeys({ project_id: projectsStore.selectedProject!.id })
                .then(({ data }) => data.keys),
        {
            successToast: {
                title: 'Api key has been created successfully'
            },
            errorToast: {
                title: "Api key wasn't created"
            }
        }
    );

    selectTier = this.selectedTier$.createAsyncAction(
        async (tierId: number) => {
            await apiClient.api.updateLiteproxyTier(
                { project_id: projectsStore.selectedProject!.id },
                {
                    tier_id: tierId
                }
            );

            this.fetchSelectedTier();
        },
        {
            successToast: {
                title: 'Successful purchase'
            },
            errorToast: {
                title: 'Unsuccessful purchase'
            }
        }
    );

    clearStore(): void {
        this.liteproxyList$.clear();
        this.liteproxyTiers$.clear();
    }
}

export const liteproxysStore = new LiteproxysStore();
