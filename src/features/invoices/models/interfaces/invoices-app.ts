import { InvoicesWebhook } from './invoices-webhook';
import { TonAddress } from 'src/shared';

export interface InvoicesApp {
    id: number;
    name: string;
    receiverAddress: TonAddress;
    creationDate: Date;
    webhooks: InvoicesWebhook[];
}
