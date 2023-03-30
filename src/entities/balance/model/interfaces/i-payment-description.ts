import { SERVICE } from '../../../service';

export type IPaymentDescription = { service: SERVICE } & Record<
    Exclude<string, 'service'>,
    unknown
>;
