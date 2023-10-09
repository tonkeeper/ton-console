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
import {
    InvoicesApp,
    InvoicesProjectForm,
    InvoicesStatistics,
    InvoicesWebhook
} from './interfaces';

class InvoicesAppStore {
    invoicesApp$ = new Loadable<InvoicesApp | null>(null);

    appToken$ = new Loadable<string | null>(null);

    statistics$ = new Loadable<InvoicesStatistics | null>(null);

    webhooks$ = new Loadable<InvoicesWebhook[]>([]);

    get invoicesServiceAvailable(): boolean {
        return !!projectsStore.selectedProject?.capabilities.invoices;
    }

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

        createImmediateReaction(
            () => this.invoicesApp$.value,
            app => {
                this.clearAppRelatedState();

                if (app) {
                    this.fetchAppToken();
                    this.fetchWebhooks();
                    this.fetchInvoicesStatistics();
                }
            }
        );
    }

    fetchInvoicesApp = this.invoicesApp$.createAsyncAction(async () => {
        try {
            const response = await apiClient.api.getInvoicesApp({
                project_id: projectsStore.selectedProject!.id
            });

            if (!response.data.app) {
                return null;
            }

            return mapInvoicesAppDTOToInvoicesApp(response.data.app);
        } catch (e) {
            console.debug(e);
            return null;
        }
    });

    createInvoicesApp = this.invoicesApp$.createAsyncAction(
        async (form: InvoicesProjectForm) => {
            const response = await apiClient.api.createInvoicesApp(
                {
                    project_id: projectsStore.selectedProject!.id
                },
                {
                    name: form.name,
                    recipient_address: form.receiverAddress
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
                recipient_address: form.receiverAddress
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

    fetchWebhooks = this.webhooks$.createAsyncAction(async () => {
        await new Promise(r => setTimeout(r, 1000)); // TODO
        return [
            {
                id: 'fwdfds',
                value: 'https://google.com'
            }
        ];
    });

    addWebhook = this.webhooks$.createAsyncAction(
        async (value: string) => {
            // TODO
            await new Promise(r => setTimeout(r, 1000));
            return this.webhooks$.value.concat({
                id: Math.random().toString(),
                value
            });
        },
        {
            successToast: {
                title: 'Webhook added successfully'
            },
            errorToast: {
                title: "Webhook wasn't added"
            }
        }
    );

    deleteWebhook = this.webhooks$.createAsyncAction(
        async (id: string) => {
            // TODO
            await new Promise(r => setTimeout(r, 1000));
            return (this.webhooks$.value = this.webhooks$.value.filter(w => w.id !== id));
        },
        {
            successToast: {
                title: 'Webhook deleted successfully'
            },
            errorToast: {
                title: "Webhook wasn't deleted"
            }
        }
    );

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
            app_id: this.invoicesApp$.value!.id
        });

        return mapInvoicesStatsDTOToInvoicesStats(response.data.stats);
    });

    clearState(): void {
        this.invoicesApp$.clear();
    }

    clearAppRelatedState(): void {
        this.appToken$.clear();
        this.statistics$.clear();
    }
}

function mapInvoicesAppDTOToInvoicesApp(invoicesAppDTO: DTOInvoicesApp): InvoicesApp {
    return {
        id: invoicesAppDTO.id,
        name: invoicesAppDTO.name,
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
