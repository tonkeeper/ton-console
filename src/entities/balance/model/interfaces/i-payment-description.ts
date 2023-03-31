import { SERVICE } from '../../../service';

export type IPaymentDescription<S extends SERVICE = SERVICE, D = Record<string, unknown>> = {
    service: S;
} & D;
