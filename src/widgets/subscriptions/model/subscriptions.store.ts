import { makeAutoObservable } from 'mobx';
import { createAsyncAction } from 'src/shared';
import { TonApiSelectedTier } from 'src/features';
import { Subscription } from 'src/widgets/subscriptions/model/interfaces/subscription';
import { tonApiTiersStore } from 'src/shared/stores';
class SubscriptionsStore {
    get subscriptions(): Subscription[] {
        const tier = tonApiTiersStore.selectedTier$.value;
        if (tier && tier.renewsDate) {
            return [mapTonapiTierToSubscription(tier as Required<TonApiSelectedTier>)];
        }

        return [];
    }

    get subscriptionsLoading(): boolean {
        return tonApiTiersStore.selectedTier$.isLoading;
    }

    constructor() {
        makeAutoObservable(this);
    }

    fetchSubscriptions = createAsyncAction(async () => {
        await tonApiTiersStore.fetchSelectedTier();
    });
}

function mapTonapiTierToSubscription(tier: Required<TonApiSelectedTier>): Subscription {
    return {
        id: `tonapi-${tier.id}`,
        plan: `TonAPI ${tier.name}`,
        interval: 'Monthly',
        renewsDate: tier.renewsDate,
        price: tier.price
        // onCancel() {
        //     openLinkBlank(EXTERNAL_LINKS.SUPPORT);
        // }
    };
}

export const subscriptionsStore = new SubscriptionsStore();
