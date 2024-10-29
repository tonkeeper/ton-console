import {
    apiClient,
    createImmediateReaction,
    DTOLiteproxyKey,
    DTOLiteproxyTier,
    Loadable
} from 'src/shared';
import { projectsStore } from 'src/entities';
import { makeAutoObservable, reaction } from 'mobx';

class LiteproxysStore {
    liteproxyList$ = new Loadable<DTOLiteproxyKey[]>([]);

    liteproxyTiers$ = new Loadable<DTOLiteproxyTier[] | null>(null);

    selectedTier: DTOLiteproxyTier | null = null;

    constructor() {
        makeAutoObservable(this);

        createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                this.clearStore();

                if (project) {
                    this.fetchLiteproxyList();
                    this.fetchLiteproxyTiers();
                }
            }
        );

        reaction(
            () => [this.liteproxyList$.state, this.liteproxyTiers$.state],
            () => {
                if (this.liteproxyList$.isResolved && this.liteproxyTiers$.isResolved) {
                    this.updateSelectedTier();
                }
            }
        );
    }

    updateSelectedTier(): void {
        if (!this.liteproxyList$.value || !this.liteproxyTiers$.value) return;

        const matchingTier = this.liteproxyTiers$.value!.find(tier =>
            this.liteproxyList$.value!.some(key => key.rps === tier.rps)
        );

        this.selectedTier = matchingTier || null;
    }

    fetchLiteproxyList = this.liteproxyList$.createAsyncAction(() =>
        apiClient.api
            .getLiteproxyKeys({ project_id: projectsStore.selectedProject!.id })
            .then(({ data }) => data.keys)
            .catch(({ response }) => {
                console.log(response);

                if (response.data.error === 'keys not found') {
                    return [];
                }

                throw Error(response);
            })
    );

    fetchLiteproxyTiers = this.liteproxyTiers$.createAsyncAction(() =>
        apiClient.api.getLiteproxyTiers().then(({ data }) => data.tiers)
    );

    // fetchSelectedTier = this.selectedTier$.createAsyncAction(
    //     async () => {
    //         return apiClient.api
    //             .get(id)
    //             .then(({ data }) => data.tier);
    //     }
    // );

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

    clearStore(): void {
        this.liteproxyList$.clear();
        this.liteproxyTiers$.clear();
    }
}

export const liteproxysStore = new LiteproxysStore();
