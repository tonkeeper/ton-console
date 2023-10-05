import { makeAutoObservable } from 'mobx';
import {
    apiClient,
    Loadable,
    createImmediateReaction,
    toUserFriendlyAddress,
    DTOInvoicesApp,
    TonCurrencyAmount
} from 'src/shared';
import { projectsStore } from 'src/entities';
import { InvoicesApp, InvoicesProjectForm, InvoicesStatistics } from './interfaces';

class InvoicesAppStore {
    invoicesApp$ = new Loadable<InvoicesApp | null>(null);

    appToken$ = new Loadable<string | null>(null);

    feePercent$ = new Loadable<number | null>(null);

    statistics$ = new Loadable<InvoicesStatistics | null>(null);

    constructor() {
        makeAutoObservable(this);

        this.feePercent$.value = 0;

        createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                this.clearState();

                if (project) {
                    this.fetchInvoicesApp();
                }
            }
        );

        createImmediateReaction(
            () => this.invoicesApp$.value,
            app => {
                this.clearAppRelatedState();

                if (app) {
                    this.fetchAppToken();
                    this.fetchInvoicesStatistics();
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

            return mapInvoicesAppDTOToInvoicesApp(response.data.app);
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

    fetchAppToken = this.appToken$.createAsyncAction(async () => {
        const response = await apiClient.api.getInvoicesAppToken({
            app_id: this.invoicesApp$.value!.id
        });

        return response.data.token;
    });

    regenerateAppToken = this.appToken$.createAsyncAction(
        async () => {
            const response = await apiClient.api.regenerateInvoicesAppToken({
                app_id: this.invoicesApp$.value!.id
            });

            return response.data.token;
        },
        {
            successToast: {
                title: 'Token regenerated successfully'
            },
            errorToast: {
                title: 'Token regeneration error'
            }
        }
    );

    fetchInvoicesStatistics = this.statistics$.createAsyncAction(async () => {
        const response = await apiClient.api.getInvoicesStats({
            // TODO
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            app_id: this.invoicesApp$.value!.id
        });

        return mapInvoicesStatsDTOToInvoicesStats(response.data.stats);
    });

    clearState(): void {
        this.invoicesApp$.clear();
    }

    clearAppRelatedState(): void {
        this.appToken$.clear();
        this.feePercent$.clear();
        this.statistics$.clear();
    }
}

function mapInvoicesAppDTOToInvoicesApp(invoicesAppDTO: DTOInvoicesApp): InvoicesApp {
    return {
        id: invoicesAppDTO.id,
        name: invoicesAppDTO.name,
        companyDetails: invoicesAppDTO.description,
        creationDate: new Date(invoicesAppDTO.date_create),
        receiverAddress: toUserFriendlyAddress(invoicesAppDTO.recipient_address)
    };
}

function mapInvoicesStatsDTOToInvoicesStats(
    invoicesStatsDTO: Awaited<ReturnType<typeof apiClient.api.getInvoicesStats>>['data']['stats']
): InvoicesStatistics {
    return {
        totalInvoices: invoicesStatsDTO.total,
        earnedTotal: new TonCurrencyAmount(invoicesStatsDTO.success_total),
        earnedLastWeek: new TonCurrencyAmount(invoicesStatsDTO.success_in_week),
        invoicesInProgress: 0, // TODO
        awaitingForPaymentAmount: new TonCurrencyAmount(invoicesStatsDTO.awaiting_payment)
    };
}

export const invoicesAppStore = new InvoicesAppStore();
