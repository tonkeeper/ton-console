import { IPaymentDescription, SERVICE } from 'src/entities';

export interface ITonApiPaymentDescription extends IPaymentDescription {
    service: SERVICE.TONAPI;
    tierId: number;
}
