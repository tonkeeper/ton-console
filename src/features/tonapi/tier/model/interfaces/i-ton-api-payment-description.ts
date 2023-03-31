import { IPaymentDescription, SERVICE } from 'src/entities';

export type ITonApiPaymentDescription = IPaymentDescription<SERVICE.TONAPI, { tierId: number }>;
