import { AxiosError } from 'axios';
import { makeAutoObservable } from 'mobx';
import { projectsStore } from 'src/entities';
import { DTOCnftConfig, Loadable, apiClient } from 'src/shared';

export type IndexingCnftCollectionDataT = Parameters<
    typeof apiClient.api.indexingCnftCollection
>[1];

class CNFTStore {
    cnftConfig$ = new Loadable<DTOCnftConfig | null>(null);

    get pricePerNFT(): number | null {
        return this.cnftConfig$.value?.price_per_nft ?? null;
    }

    constructor() {
        makeAutoObservable(this);
        this.loadConfig();
    }

    loadConfig = this.cnftConfig$.createAsyncAction(async () => {
        const response = await apiClient.api.cnftConfig();

        this.cnftConfig$.value = response.data;
        return response.data;
    });

    addCNFT = this.cnftConfig$.createAsyncAction(
        async (data: IndexingCnftCollectionDataT) => {
            return apiClient.api.indexingCnftCollection(
                { project_id: projectsStore.selectedProject!.id },
                data
            );
        },
        {
            successToast: {
                title: 'cNFT added successfully'
            },
            errorToast: e => {
                const error = e as AxiosError;
                const response = error.response?.data as { error: string };

                return {
                    title: 'cNFT adding error',
                    description: response?.error
                };
            }
        }
    );

    clearState(): void {
        this.cnftConfig$.clear();
    }
}

export const cnftStore = new CNFTStore();
