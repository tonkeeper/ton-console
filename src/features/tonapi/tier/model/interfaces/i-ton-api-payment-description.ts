import { IPaymentDescription } from 'src/entities';

export interface ITonApiPaymentDescription extends IPaymentDescription {
    service: 'tonapi';
    tierId: number;
}
