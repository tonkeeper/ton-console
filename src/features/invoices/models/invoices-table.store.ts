import { makeAutoObservable } from 'mobx';
import {
    apiClient,
    Loadable,
    createImmediateReaction,
    DTOInvoicesInvoice,
    TonCurrencyAmount,
    DTOInvoicesInvoiceStatus
} from 'src/shared';
import { projectsStore } from 'src/entities';
import {
    Invoice,
    InvoiceCommon,
    InvoiceForm,
    InvoiceStatus,
    InvoiceSuccessful
} from './interfaces';
import { invoicesAppStore } from './invoices-app.store';

class InvoicesTableStore {
    invoices$ = new Loadable<Invoice[]>([]);

    constructor() {
        makeAutoObservable(this);

        createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                this.clearState();

                if (project) {
                    // this.fetchInvoicesApp();
                }
            }
        );
    }

    fetchInvoices = this.invoices$.createAsyncAction(async () => {
        const response = await apiClient.api.getInvoices({
            project_id: projectsStore.selectedProject!.id,
            app_id: invoicesAppStore.invoicesApp$.value!.id
        });

        return response.data.items.map(mapInvoiceDTOToInvoice);
    });

    createInvoice = this.invoices$.createAsyncAction(
        async (form: InvoiceForm) => {
            const result = await apiClient.api.createInvoicesInvoice(
                {
                    app_id: invoicesAppStore.invoicesApp$.value!.id,
                    project_id: projectsStore.selectedProject!.id
                },
                {
                    amount: Number(form.amount.stringWeiAmount),
                    subtract_fee_from_amount: form.subtractFeeFromAmount,
                    recipient_address: form.receiverAddress,
                    description: form.description,
                    life_time: form.lifeTimeSeconds
                }
            );

            this.fetchInvoices();

            return mapInvoiceDTOToInvoice(result.data.invoice);
        },
        {
            notMutateState: true,
            successToast: {
                title: 'Invoice created successfully'
            },
            errorToast: {
                title: 'Invoice creation error'
            }
        }
    );

    clearState(): void {
        this.invoices$.clear();
    }
}

const mapInvoiceDTOStatusToInvoiceStatus: Record<DTOInvoicesInvoice['status'], InvoiceStatus> = {
    [DTOInvoicesInvoiceStatus.DTOSuccessStatus]: 'success',
    [DTOInvoicesInvoiceStatus.DTOPendingStatus]: 'pending',
    [DTOInvoicesInvoiceStatus.DTOExpiredStatus]: 'expired',
    [DTOInvoicesInvoiceStatus.DTOCancelStatus]: 'cancelled'
};

function mapInvoiceDTOToInvoice(invoiceDTO: DTOInvoicesInvoice): Invoice {
    const creationDate = new Date(invoiceDTO.date_create);
    const commonInvoice: InvoiceCommon = {
        amount: new TonCurrencyAmount(invoiceDTO.amount),
        creationDate,
        status: mapInvoiceDTOStatusToInvoiceStatus[invoiceDTO.status],
        subtractFeeFromAmount: invoiceDTO.subtract_fee_from_amount,
        id: invoiceDTO.id,
        validUntil: new Date(creationDate.getTime() + invoiceDTO.life_time * 1000),
        description: invoiceDTO.description
    };

    if (commonInvoice.status === 'success') {
        return { ...commonInvoice, paidBy: 'TODO' } as InvoiceSuccessful;
    }

    return commonInvoice;
}

export const invoicesTableStore = new InvoicesTableStore();
