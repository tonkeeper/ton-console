import { InvoicesWebhook } from './invoices-webhook';

export interface InvoicesApp {
    id: number;
    name: string;
    receiverAddress: string;
    creationDate: Date;
    webhooks: InvoicesWebhook[];
}
