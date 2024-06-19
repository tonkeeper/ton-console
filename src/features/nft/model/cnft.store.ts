import { AxiosError } from 'axios';
import { makeAutoObservable } from 'mobx';
import { projectsStore } from 'src/entities';
import { DTOCnftCollection, Loadable, TonCurrencyAmount, apiClient } from 'src/shared';
import { CnftCollection } from './interfaces/CnftCollection';
import { Address } from 'ton-core';

export type IndexingCnftCollectionDataT = Parameters<
    typeof apiClient.api.indexingCNftCollection
>[1];

class CNFTStore {
    pricePerNFT$ = new Loadable<TonCurrencyAmount | undefined>(undefined);

    history$ = new Loadable<CnftCollection[]>([]);

    constructor() {
        makeAutoObservable(this);
        this.loadConfig();
        this.loadHistory();
    }

    loadConfig = this.pricePerNFT$.createAsyncAction(async () => {
        const response = await apiClient.api.getCNftConfig();
        return new TonCurrencyAmount(response.data.price_per_nft);
    });

    loadHistory = this.history$.createAsyncAction(getPaidCNftCollections);

    addCNFT = this.history$.createAsyncAction(
        async (data: IndexingCnftCollectionDataT) => {
            await apiClient.api.indexingCNftCollection(
                { project_id: projectsStore.selectedProject!.id },
                data
            );

            return getPaidCNftCollections();
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

async function getPaidCNftCollections() {
    const res = await apiClient.api.getPaidCNftCollections({
        project_id: projectsStore.selectedProject!.id
    });

    return res.data.items.map(mapDTOCnftCollectionToCnftCollection);
}

function mapDTOCnftCollectionToCnftCollection(dto: DTOCnftCollection): CnftCollection {
    return {
        ...dto,
        account: Address.parse(dto.account)
    };
}

export const cnftStore = new CNFTStore();
