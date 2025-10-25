import { makeAutoObservable } from 'mobx';
import {
    Loadable,
    createImmediateReaction,
    TonAddress,
    CRYPTO_CURRENCY,
    TokenCurrencyAmount
} from 'src/shared';
import {
    getInvoicesApp,
    createInvoicesApp,
    updateInvoicesApp,
    getInvoicesAppToken,
    createInvoicesAppWebhook,
    deleteInvoicesAppWebhook,
    regenerateInvoicesAppToken,
    getInvoicesStats,
    DTOInvoicesApp,
    DTOCryptoCurrency,
    GetInvoicesStatsResponse
} from 'src/shared/api';
import { projectsStore } from 'src/shared/stores';
import {
    InvoicesAllStatistics,
    InvoicesApp,
    InvoicesProjectForm,
    InvoicesStatistics
} from './interfaces';
import { CRYPTO_CURRENCY_DECIMALS } from 'src/shared/lib/currency/CRYPTO_CURRENCY';

export class InvoicesAppStore {
    invoicesApp$ = new Loadable<InvoicesApp | null>(null);

    appToken$ = new Loadable<string | null>(null);

    statistics$ = new Loadable<InvoicesAllStatistics | null>(null);

    get invoicesServiceAvailable(): boolean {
        return !!projectsStore.selectedProject?.capabilities.invoices;
    }

    constructor() {
        makeAutoObservable(this);

        createImmediateReaction(
            () => projectsStore.selectedProject?.id,
            project => {
                this.clearState();

                if (project) {
                    this.fetchInvoicesApp();
                }
            }
        );

        createImmediateReaction(
            () => this.invoicesApp$.value?.id,
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
        try {
            const { data, error } = await getInvoicesApp({
                query: { project_id: projectsStore.selectedProject!.id }
            });

            if (error || !data?.app) {
                return null;
            }

            return mapInvoicesAppDTOToInvoicesApp(data.app);
        } catch (_e) {
            return null;
        }
    });

    createInvoicesApp = this.invoicesApp$.createAsyncAction(
        async (form: InvoicesProjectForm) => {
            const { data, error } = await createInvoicesApp({
                query: { project_id: projectsStore.selectedProject!.id },
                body: {
                    name: form.name,
                    recipient_address: form.receiverAddress
                }
            });

            if (error || !data) {
                throw error;
            }

            return mapInvoicesAppDTOToInvoicesApp(data.app);
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
            const { data, error } = await updateInvoicesApp({
                path: { id: form.id },
                body: {
                    name: form.name,
                    recipient_address: form.receiverAddress
                }
            });

            if (error || !data?.app) {
                throw error;
            }

            return mapInvoicesAppDTOToInvoicesApp(data.app);
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
        const { data, error } = await getInvoicesAppToken({
            query: { app_id: this.invoicesApp$.value!.id }
        });

        if (error || !data) {
            throw error;
        }

        return data.token;
    });

    addWebhook = this.invoicesApp$.createAsyncAction(
        async (value: string) => {
            const { data, error } = await createInvoicesAppWebhook({
                path: { id: this.invoicesApp$.value!.id },
                body: { webhook: value }
            });

            if (error || !data?.app) {
                throw error;
            }

            return mapInvoicesAppDTOToInvoicesApp(data.app);
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

    deleteWebhook = this.invoicesApp$.createAsyncAction(
        async (id: string) => {
            const { data, error } = await deleteInvoicesAppWebhook({
                path: { id: this.invoicesApp$.value!.id, webhook_id: id }
            });

            if (error || !data?.app) {
                throw error;
            }

            return mapInvoicesAppDTOToInvoicesApp(data.app);
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
            const { data, error } = await regenerateInvoicesAppToken({
                query: { app_id: this.invoicesApp$.value!.id }
            });

            if (error || !data) {
                throw error;
            }

            return data.token;
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
        const tonResult = await getInvoicesStats({
            query: {
                app_id: this.invoicesApp$.value!.id,
                currency: DTOCryptoCurrency.TON
            }
        });

        const usdtResult = await getInvoicesStats({
            query: {
                app_id: this.invoicesApp$.value!.id,
                currency: DTOCryptoCurrency.USDT
            }
        });

        if (tonResult.error || usdtResult.error || !tonResult.data || !usdtResult.data) {
            throw tonResult.error || usdtResult.error;
        }

        return {
            [CRYPTO_CURRENCY.TON]: mapInvoicesStatsDTOToInvoicesStats(
                tonResult.data.stats,
                CRYPTO_CURRENCY.TON
            ),
            [CRYPTO_CURRENCY.USDT]: mapInvoicesStatsDTOToInvoicesStats(
                usdtResult.data.stats,
                CRYPTO_CURRENCY.USDT
            )
        };
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
        creationDate: new Date(invoicesAppDTO.date_create * 1000),
        receiverAddress: TonAddress.parse(invoicesAppDTO.recipient_address),
        webhooks: (invoicesAppDTO.webhooks || []).map(w => ({ id: w.id, value: w.webhook }))
    };
}

function mapInvoicesStatsDTOToInvoicesStats(
    invoicesStatsDTO: GetInvoicesStatsResponse['stats'],
    currency: CRYPTO_CURRENCY
): InvoicesStatistics {
    return {
        totalInvoices: invoicesStatsDTO.total,
        earnedTotal: new TokenCurrencyAmount({
            weiAmount: invoicesStatsDTO.success_total.toString(),
            currency: currency,
            decimals: CRYPTO_CURRENCY_DECIMALS[currency]
        }),
        earnedLastWeek: new TokenCurrencyAmount({
            weiAmount: invoicesStatsDTO.success_in_week.toString(),
            currency: currency,
            decimals: CRYPTO_CURRENCY_DECIMALS[currency]
        }),
        invoicesInProgress: invoicesStatsDTO.invoices_in_progress,
        awaitingForPaymentAmount: new TokenCurrencyAmount({
            weiAmount: invoicesStatsDTO.total_amount_pending.toString(),
            currency: currency,
            decimals: CRYPTO_CURRENCY_DECIMALS[currency]
        })
    };
}
