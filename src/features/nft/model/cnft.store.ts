import { AxiosError } from 'axios';
import { makeAutoObservable } from 'mobx';
import { projectsStore } from 'src/entities';
import { DTOCnftCollection, Loadable, TonCurrencyAmount, apiClient } from 'src/shared';

export type IndexingCnftCollectionDataT = Parameters<
    typeof apiClient.api.indexingCnftCollection
>[1];

class CNFTStore {
    pricePerNFT$ = new Loadable<TonCurrencyAmount | undefined>(undefined);

    history$ = new Loadable<DTOCnftCollection[]>([]);

    constructor() {
        makeAutoObservable(this);
        this.loadConfig();
    }

    loadConfig = this.pricePerNFT$.createAsyncAction(async () => {
        const response = await apiClient.api.cnftConfig();
        return new TonCurrencyAmount(response.data.price_per_nft);
    });

    addCNFT = this.history$.createAsyncAction(
        async (data: IndexingCnftCollectionDataT) => {
            const res = await apiClient.api.indexingCnftCollection(
                { project_id: projectsStore.selectedProject!.id },
                data
            );
            return this.history$.value.concat(res.data);
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
        this.pricePerNFT$.clear();
        this.history$.clear();
    }
}

export const cnftStore = new CNFTStore();
