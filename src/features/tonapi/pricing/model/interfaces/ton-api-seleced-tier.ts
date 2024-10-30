import { TonApiTier } from 'src/features';

export interface TonApiSelectedTier extends TonApiTier {
    active: true;
    subscriptionDate: Date;

    renewsDate?: Date;
}

export function isTonApiSelectedTier(value: TonApiTier): value is TonApiSelectedTier {
    return 'active' in value && !!value.active;
}
