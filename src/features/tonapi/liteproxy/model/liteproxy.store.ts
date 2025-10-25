import {
    createImmediateReaction,
    Loadable
} from 'src/shared';
import {
    DTOLiteproxyKey,
    DTOLiteproxyTier,
    DTOProjectLiteproxyTierDetail,
    getLiteproxyKeys,
    createLiteproxyKeys,
    getLiteproxyTiers,
    getProjectLiteproxyTier,
    updateLiteproxyTier
} from 'src/shared/api';
import { projectsStore } from 'src/shared/stores';
import { makeAutoObservable } from 'mobx';

export class LiteproxysStore {
    liteproxyList$ = new Loadable<DTOLiteproxyKey[]>([]);

    liteproxyTiers$ = new Loadable<DTOLiteproxyTier[] | null>(null);

    selectedTier$ = new Loadable<DTOProjectLiteproxyTierDetail | null>(null);

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

    fetchLiteproxyList = this.liteproxyList$.createAsyncAction(async () => {
        const { data, error } = await getLiteproxyKeys({
            query: { project_id: projectsStore.selectedProject!.id }
        });

        if (error) {
            if (error.error === 'keys not found') return [];
            throw error;
        }

        return data.keys;
    });

    fetchLiteproxyTiers = this.liteproxyTiers$.createAsyncAction(async () => {
        const { data, error } = await getLiteproxyTiers();
        if (error) throw error

        return data.tiers;
    });

    fetchSelectedTier = this.selectedTier$.createAsyncAction(async () => {
        const { data, error } = await getProjectLiteproxyTier({
            query: { project_id: projectsStore.selectedProject!.id }
        });

        if (error) throw error

        return data.tier;
    });

    createLiteproxy = this.liteproxyList$.createAsyncAction(
        async () => {
            const { data, error } = await createLiteproxyKeys({
                query: { project_id: projectsStore.selectedProject!.id }
            });

            if (error) throw error

            return data.keys;
        },
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
            const { error } = await updateLiteproxyTier({
                query: { project_id: projectsStore.selectedProject!.id },
                body: { tier_id: tierId }
            });

            if (error) throw error

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
