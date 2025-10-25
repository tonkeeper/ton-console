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
    private disposers: Array<() => void> = [];

    get subscriptions(): { liteproxy: Subscription | null; restApi: Subscription | null } {
        const reastApiTier = restApiTiersStore.selectedTier$.value;
        const liteproxyTier = liteproxysStore.selectedTier$.value;

        return mapTierToSubscription(reastApiTier, liteproxyTier);
    }

    get subscriptionsLoading(): boolean {
        return restApiTiersStore.selectedTier$.isLoading || liteproxysStore.selectedTier$.isLoading;
    }

    constructor() {
        makeAutoObservable(this);

        const dispose = createImmediateReaction(
            () => restApiTiersStore.selectedTier$,
            () => {
                this.fetchSubscriptions();
            }
        );
        this.disposers.push(dispose);
    }

    fetchSubscriptions = createAsyncAction(async () => {
        restApiTiersStore.fetchSelectedTier();
        liteproxysStore.fetchSelectedTier();
    });

    destroy(): void {
        this.disposers.forEach(dispose => dispose?.());
        this.disposers = [];
    }
}

function mapTierToSubscription(
    reastApiTier: RestApiSelectedTier | null,
    liteproxyTier: DTOProjectLiteproxyTierDetail | null
): { liteproxy: Subscription | null; restApi: Subscription | null } {
    const liteproxyNextPayment =
        liteproxyTier?.name === 'Free'
            ? undefined
            : liteproxyTier?.next_payment
            ? new Date(liteproxyTier.next_payment)
            : undefined;

    const liteproxySubscription: Subscription | null = liteproxyTier && {
        id: `liteproxy-${liteproxyTier.id}`,
        plan: `Liteservers «${liteproxyTier.name}»`,
        interval: 'Monthly',
        renewsDate: liteproxyNextPayment ? new Date(liteproxyNextPayment) : undefined,
        price: new UsdCurrencyAmount(liteproxyTier.usd_price)
    };

    const restApiSubscription: Subscription | null = reastApiTier && {
        id: `tonapi-${reastApiTier.id}`,
        plan: `REST API «${reastApiTier.name}»`,
        interval: reastApiTier.type === 'monthly' ? 'Monthly' : 'Pay as you go',
        renewsDate: reastApiTier.renewsDate,
        price: reastApiTier?.price
    };

    return { liteproxy: liteproxySubscription, restApi: restApiSubscription };
}
