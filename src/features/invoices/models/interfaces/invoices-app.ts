import { InvoicesWebhook } from './invoices-webhook';
import { Address } from '@ton/core';

export interface InvoicesApp {
    id: number;
    name: string;
    receiverAddress: Address;
    creationDate: Date;
    webhooks: InvoicesWebhook[];
}
