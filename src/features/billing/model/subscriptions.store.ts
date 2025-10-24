import { makeAutoObservable } from 'mobx';
import {
    createAsyncAction,
    createImmediateReaction,
    DTOProjectLiteproxyTierDetail,
    UsdCurrencyAmount
} from 'src/shared';
import { RestApiSelectedTier } from 'src/features/tonapi/pricing';
import { Subscription } from './interfaces/subscription';
import { liteproxysStore, restApiTiersStore } from 'src/shared/stores';

export class SubscriptionsStore {
    get subscriptions(): Subscription[] {
        const reastApiTier = restApiTiersStore.selectedTier$.value;
        const liteproxyTier = liteproxysStore.selectedTier$.value;

        return mapTierToSubscription(reastApiTier, liteproxyTier);
    }

    get subscriptionsLoading(): boolean {
        return restApiTiersStore.selectedTier$.isLoading;
    }

    constructor() {
        makeAutoObservable(this);

        createImmediateReaction(
            () => restApiTiersStore.selectedTier$,
            () => {
                this.fetchSubscriptions();
            }
        );
    }

    fetchSubscriptions = createAsyncAction(async () => {
        await restApiTiersStore.fetchSelectedTier();
    });
}

function mapTierToSubscription(
    reastApiTier: RestApiSelectedTier | null,
    liteproxyTier: DTOProjectLiteproxyTierDetail | null
): Subscription[] {
    const liteproxySubscription: Subscription | null = liteproxyTier && {
        id: `liteproxy-${liteproxyTier.id}`,
        plan: `Liteproxy «${liteproxyTier.name}»`,
        interval: 'Monthly',
        renewsDate: liteproxyTier.next_payment ? new Date(liteproxyTier.next_payment) : undefined,
        price: new UsdCurrencyAmount(liteproxyTier.usd_price)
    };

    const tonapiSubscription: Subscription | null = reastApiTier && {
        id: `tonapi-${reastApiTier.id}`,
        plan: `TonAPI «${reastApiTier.name}»`,
        interval: reastApiTier.type === 'monthly' ? 'Monthly' : 'Pay as you go',
        renewsDate: reastApiTier.renewsDate,
        price: reastApiTier?.price
    };

    return [liteproxySubscription, tonapiSubscription].filter(s => s !== null);
}
