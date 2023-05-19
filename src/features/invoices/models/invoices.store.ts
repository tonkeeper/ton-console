import { makeAutoObservable } from 'mobx';
import {
    apiClient,
    Loadable,
    createImmediateReaction,
    toUserFriendlyAddress,
    DTOInvoicesInvoice,
    TonCurrencyAmount,
    DTOInvoicesInvoiceStatus,
    DTOInvoicesApp
} from 'src/shared';
import { projectsStore } from 'src/entities';
import {
    Invoice,
    InvoiceCommon,
    InvoiceForm,
    InvoicesApp,
    InvoicesProjectForm,
    InvoiceStatus,
    InvoiceSuccessful
} from './interfaces';

class InvoicesStore {
    invoicesApp$ = new Loadable<InvoicesApp | null>(null);

    invoices$ = new Loadable<Invoice[]>([]);

    constructor() {
        makeAutoObservable(this);

        createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                this.clearState();

                if (project) {
                    this.fetchInvoicesApp();
                }
            }
        );
    }

    fetchInvoicesApp = this.invoicesApp$.createAsyncAction(async () => {
        const response = await apiClient.api.getInvoicesApp({
            project_id: projectsStore.selectedProject!.id
        });

        if (!response.data.app) {
            return null;
        }

        return mapInvoicesAppDTOToInvoicesApp(response.data.app);
    });

    createInvoicesApp = this.invoicesApp$.createAsyncAction(
        async (form: InvoicesProjectForm) => {
            const response = await apiClient.api.createInvoicesApp(
                {
                    project_id: projectsStore.selectedProject!.id
                },
                {
                    name: form.name,
                    recipient_address: form.receiverAddress,
                    description: form.companyDetails
                }
            );

            return mapInvoicesAppDTOToInvoicesApp(
                response.data.app as unknown as NonNullable<DTOInvoicesApp['app']>
            ); // TODO новый сваггер
        },
        {
            successToast: {
                title: 'Invoices app created successfully'
            },
            errorToast: {
                title: 'Invoices app creation error'
            }
        }
    );

    editInvoicesApp = this.invoicesApp$.createAsyncAction(
        async (form: Partial<InvoicesProjectForm> & { id: number }) => {
            const response = await apiClient.api.updateInvoicesApp(form.id, {
                name: form.name,
                recipient_address: form.receiverAddress,
                description: form.companyDetails
            });

            return mapInvoicesAppDTOToInvoicesApp(response.data.app!);
        },
        {
            successToast: {
                title: 'Invoices app updated successfully'
            },
            errorToast: {
                title: 'Invoices app updating error'
            }
        }
    );

    fetchInvoices = this.invoices$.createAsyncAction(async () => {
        const response = await apiClient.api.getInvoices({
            project_id: projectsStore.selectedProject!.id,
            app_id: this.invoicesApp$.value!.id
        });

        return response.data.items.map(mapInvoiceDTOToInvoice);
    });

    createInvoice = this.invoices$.createAsyncAction(
        async (form: InvoiceForm) => {
            const result = await apiClient.api.createInvoicesInvoice(
                {
                    app_id: this.invoicesApp$.value!.id,
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
        this.invoicesApp$.clear();
    }
}

function mapInvoicesAppDTOToInvoicesApp(
    invoicesAppDTO: NonNullable<DTOInvoicesApp['app']>
): InvoicesApp {
    return {
        id: invoicesAppDTO.id,
        name: invoicesAppDTO.name,
        companyDetails: invoicesAppDTO.description,
        creationDate: new Date(invoicesAppDTO.date_create),
        receiverAddress: toUserFriendlyAddress(invoicesAppDTO.recipient_address)
    };
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

export const invoicesStore = new InvoicesStore();
