import { AxiosError } from 'axios';
import { makeAutoObservable } from 'mobx';
import { projectsStore } from 'src/shared/stores';
import {
    DTOCnftCollection,
    Loadable,
    TonCurrencyAmount,
    apiClient,
    createImmediateReaction,
    isAddressValid
} from 'src/shared';
import { CnftCollection } from './interfaces/CnftCollection';
import { Address } from '@ton/core';

export type IndexingCnftCollectionDataT = Parameters<
    typeof apiClient.api.indexingCNftCollection
>[1];

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
        const response = await apiClient.api.getCNftConfig();
        return new TonCurrencyAmount(response.data.usd_price_per_nft);
    });

    loadHistory = this.history$.createAsyncAction(getPaidCNftCollections);

    addCNFT = this.history$.createAsyncAction(
        async (data: IndexingCnftCollectionDataT) =>
            apiClient.api
                .indexingCNftCollection({ project_id: projectsStore.selectedProject!.id }, data)
                .then(getPaidCNftCollections),
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

        return isValid
            ? apiClient.api
                  .getInfoCNftCollectionAccount(addressString)
                  .then(({ data }) => (data ? mapDTOCnftCollectionToCnftCollection(data) : null))
                  .catch(() => null)
            : null;
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
