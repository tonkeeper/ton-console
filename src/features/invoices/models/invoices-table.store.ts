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
import { Invoice, InvoiceCommon, InvoiceForm, InvoiceStatus } from './interfaces';
import { invoicesAppStore } from './invoices-app.store';

class InvoicesTableStore {
    invoices$ = new Loadable<Invoice[]>([]);

    totalInvoices = 10000;

    pageSize = 30;

    get hasNextPage(): boolean {
        return this.invoices$.value.length < this.totalInvoices;
    }

    get tableContentLength(): number {
        return this.hasNextPage ? this.invoices$.value.length + 1 : this.invoices$.value.length;
    }

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

    isItemLoaded = (index: number): boolean =>
        !this.hasNextPage || index < this.invoices$.value.length;

    loadNextPage = this.invoices$.createAsyncAction(async () => {
        await new Promise(r => setTimeout(r, 1000));
        return this.invoices$.value.concat([...new Array(this.pageSize)].map(createMockInvoice));
    });

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

            //this.fetchInvoices();

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
        subtractFeeFromAmount: invoiceDTO.subtract_fee_from_amount,
        id: invoiceDTO.id,
        validUntil: new Date(creationDate.getTime() + invoiceDTO.life_time * 1000),
        description: invoiceDTO.description,
        receiverAddress: 'EQCmtv9UrlDC27A0KsJNSaloAtHp5G3fli5jJjJug0waNf1u' // TODO
    };

    const status = mapInvoiceDTOStatusToInvoiceStatus[invoiceDTO.status];

    if (status === 'success') {
        return { ...commonInvoice, paidBy: 'TODO', status }; // TODO
    }

    return { ...commonInvoice, status };
}

function createMockInvoice(): Invoice {
    const id = Math.round(Math.random() * 1000000);
    const status = (['pending', 'success', 'cancelled', 'expired'] as const)[id % 4];

    return {
        amount: new TonCurrencyAmount(1000000000),
        creationDate: new Date(),
        status,
        subtractFeeFromAmount: true,
        id: id.toString(),
        validUntil: new Date(Date.now() + 1000 * 3600 * 24),
        description:
            'TestdescripotionTestdescripotionTestdescripotionTestdescripotionTestdescripotionTest descripotionTest descripotionTestdescripotion',
        receiverAddress: 'EQCmtv9UrlDC27A0KsJNSaloAtHp5G3fli5jJjJug0waNf1u',
        ...(status === 'success' && { paidBy: 'EQCmtv9UrlDC27A0KsJNSaloAtHp5G3fli5jJjJug0waNf1u' })
    } as Invoice;
}

export const invoicesTableStore = new InvoicesTableStore();
