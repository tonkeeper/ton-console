import { SERVICE, SubscriptionDetails } from 'src/entities';

export type ITonApiSubscriptionDetails = SubscriptionDetails<SERVICE.TONAPI, { tierId: number }>;
