import { AxiosError } from 'axios';
import { makeAutoObservable } from 'mobx';
import { projectsStore } from 'src/shared/stores';
import { Loadable, TonCurrencyAmount, createImmediateReaction, isAddressValid } from 'src/shared';
import {
    getCNftConfig,
    getPaidCNftCollections,
    indexingCNftCollection,
    getInfoCNftCollectionAccount,
    DTOCnftCollection,
    DTOCnftIndexing
} from 'src/shared/api';
import { CnftCollection } from './interfaces/CnftCollection';
import { Address } from '@ton/core';

export type IndexingCnftCollectionDataT = DTOCnftIndexing;

export class CNFTStore {
    pricePerNFT$ = new Loadable<TonCurrencyAmount | undefined>(undefined);

    history$ = new Loadable<CnftCollection[]>([]);

    currentAddress$ = new Loadable<CnftCollection | null>(null);

    private disposers: Array<() => void> = [];

    constructor() {
        makeAutoObservable(this);

        const dispose = createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                this.clearState();

                if (project) {
                    this.loadConfig();
                    this.loadHistory();
                }
            }
        );
        this.disposers.push(dispose);
    }

    loadConfig = this.pricePerNFT$.createAsyncAction(async () => {
        const { data, error } = await getCNftConfig();
        if (error) throw error;
        return new TonCurrencyAmount(data.usd_price_per_nft);
    });

    loadHistory = this.history$.createAsyncAction(getPaidCNftCollectionsData);

    addCNFT = this.history$.createAsyncAction(
        async (requestData: IndexingCnftCollectionDataT) => {
            const { error } = await indexingCNftCollection({
                query: { project_id: projectsStore.selectedProject!.id },
                body: requestData
            });
            if (error) throw error;
            return getPaidCNftCollectionsData();
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

    checkCNFT = this.currentAddress$.createAsyncAction(async (addressString: string) => {
        const isValid = isAddressValid(addressString, { acceptRaw: true });
        if (!isValid) return null;

        const { data, error } = await getInfoCNftCollectionAccount({
            path: { account: addressString }
        });

        if (error) return null;
        return data ? mapDTOCnftCollectionToCnftCollection(data) : null;
    });

    clearState(): void {
        this.pricePerNFT$.clear();
        this.history$.clear();
        this.currentAddress$.clear();
    }

    destroy(): void {
        this.disposers.forEach(dispose => dispose?.());
        this.disposers = [];
    }
}

async function getPaidCNftCollectionsData() {
    const { data, error } = await getPaidCNftCollections({
        query: { project_id: projectsStore.selectedProject!.id }
    });

    if (error) throw error;
    return data.items.map(mapDTOCnftCollectionToCnftCollection);
}

function mapDTOCnftCollectionToCnftCollection(dto: DTOCnftCollection): CnftCollection {
    return {
        ...dto,
        account: Address.parse(dto.account)
    };
}
