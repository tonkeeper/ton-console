
import {
    DTOProjectLiteproxyTierDetail
} from 'src/shared/api';
import {
    UsdCurrencyAmount
} from 'src/shared';
import { useLiteproxySelectedTierQuery } from 'src/features/tonapi/liteproxy/model/queries';
import { useRestApiSelectedTierQuery } from 'src/features/tonapi/pricing/model/queries';
import { RestApiSelectedTier } from 'src/features/tonapi/pricing/model/interfaces';
import { Subscription } from './interfaces/subscription';

/**
 * Hook for fetching current subscriptions (REST API + Liteproxy tiers)
 * Combines data from both REST API and Liteproxy services
 * If a tier request fails, that subscription will be null and won't be displayed
 */
export function useSubscriptionsQuery() {
    const {
        data: restApiTier,
        isLoading: isRestApiLoading,
        error: restApiError
    } = useRestApiSelectedTierQuery();
    const {
        data: liteproxyTier,
        isLoading: isLiteproxyLoading,
        error: liteproxyError
    } = useLiteproxySelectedTierQuery();

    const isLoading = isRestApiLoading || isLiteproxyLoading;

    // If request failed, pass null to mapping function, which returns null
    const subscriptions = {
        restApi: restApiError ? null : mapRestApiTierToSubscription(restApiTier ?? null),
        liteproxy: liteproxyError ? null : mapLiteproxyTierToSubscription(liteproxyTier ?? null)
    };

    return {
        data: subscriptions,
        isLoading
    };
}

function mapRestApiTierToSubscription(tier: RestApiSelectedTier | null): Subscription | null {
    if (!tier) {
        return null;
    }

    return {
        id: `tonapi-${tier.id}`,
        plan: `REST API «${tier.name}»`,
        interval: tier.type,
        renewsDate: tier.renewsDate,
        price: tier.price
    };
}

function mapLiteproxyTierToSubscription(
    tier: DTOProjectLiteproxyTierDetail | null
): Subscription | null {
    if (!tier) {
        return null;
    }

    const liteproxyNextPayment =
        tier.name !== 'Free' && tier.next_payment ? new Date(tier.next_payment) : undefined;

    return {
        id: `liteproxy-${tier.id}`,
        plan: `Liteservers «${tier.name}»`,
        interval: 'Monthly',
        renewsDate: liteproxyNextPayment,
        price: new UsdCurrencyAmount(tier.usd_price)
    };
}
