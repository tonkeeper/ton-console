import {
    apiClient,
    createImmediateReaction,
    DTOGetProjectTonApiStatsParamsDashboardEnum,
    Loadable,
    Network
} from 'src/shared';
import { Webhook, CreateWebhookForm } from './interfaces';
import { projectsStore } from 'src/entities';
import { makeAutoObservable } from 'mobx';
import {
    rtTonApiClient,
    RTWebhookAccountTxSubscriptions,
    RTWebhookListStatusEnum
} from 'src/shared/api/streaming-api';
import { Address } from '@ton/core';
import { WebhooksStat } from './interfaces/webhooks';

export type Subscription = RTWebhookAccountTxSubscriptions['account_tx_subscriptions'][0];

class WebhooksStore {
    webhooks$ = new Loadable<Webhook[]>([]);

    stats$ = new Loadable<WebhooksStat | null>(null);

    selectedWebhook: Webhook | null = null;

    subscriptions$ = new Loadable<Subscription[]>([]);

    subscriptionsPage = 1;

    subscriptionsLimit = 20;

    subscriptionsTotalPages = 0;

    network: Network = Network.MAINNET;

    constructor() {
        makeAutoObservable(this);

        createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                this.clearStore();

                if (project) {
                    this.fetchWebhooks();
                    this.fetchWebhooksStats();
                }
            }
        );

        createImmediateReaction(
            () => this.network,
            () => {
                if (projectsStore.selectedProject) {
                    this.fetchWebhooks();
                }
            }
        );

        createImmediateReaction(
            () => this.selectedWebhook,
            selectedWebhook => {
                if (selectedWebhook) {
                    this.fetchSubscriptions(selectedWebhook.id, 1);
                    this.subscriptionsTotalPages = Math.ceil(
                        selectedWebhook.subscribed_accounts / this.subscriptionsLimit
                    );
                } else {
                    this.subscriptions$.clear();
                    this.subscriptionsPage = 1;
                }
            }
        );

        createImmediateReaction(
            () => this.subscriptionsPage,
            page => {
                if (this.selectedWebhook) {
                    this.fetchSubscriptions(this.selectedWebhook.id, page);
                }
            }
        );
    }

    setSubscriptionsPage = (page: number): void => {
        this.subscriptionsPage = page;
    };

    setSelectedWebhookId = async (id: string | null): Promise<void> => {
        if (!this.webhooks$.isResolved) {
            await this.fetchWebhooks();
        }
        const webhook = this.webhooks$.value.find(item => String(item.id) === id);

        this.selectedWebhook = webhook ?? null;
    };

    getProjectId(): string {
        const project = projectsStore.selectedProject;
        if (!project) {
            throw new Error('Project is not selected');
        }

        return String(project.id);
    }

    setNetwork(network: Network): void {
        this.network = network;
    }

    fetchWebhooks = this.webhooks$.createAsyncAction(async () => {
        const response = await rtTonApiClient.webhooks
            .getWebhooks({
                project_id: this.getProjectId(),
                network: this.network
            })
            .then(res => res.data.webhooks.toSorted((a, b) => b.id - a.id));

        return response;
    });

    fetchWebhooksStats = this.stats$.createAsyncAction(async () => {
        const now = new Date();
        const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

        const startTimestamp = Math.floor(startOfMonth.getTime() / 1000);
        const endTimestamp = Math.floor(now.getTime() / 1000);

        const response = await apiClient.api
            .getProjectTonApiStats({
                project_id: projectsStore.selectedProject!.id,
                start: startTimestamp,
                end: endTimestamp,
                step: 3600,
                dashboard: DTOGetProjectTonApiStatsParamsDashboardEnum.DTOTonapiWebhook
            })
            .then(res => res.data.stats);

        return response;
    });

    createWebhook = this.webhooks$.createAsyncAction(
        async ({ endpoint }: CreateWebhookForm) => {
            const resCreateWebhook = await rtTonApiClient.webhooks
                .createWebhook(
                    { project_id: this.getProjectId(), network: this.network },
                    { endpoint }
                )
                .then(res => res.data);

            const newWebhook = {
                id: resCreateWebhook.webhook_id,
                endpoint,
                token: resCreateWebhook.token,
                status: RTWebhookListStatusEnum.RTOnline,
                subscribed_accounts: 0
            };

            this.webhooks$.value.unshift(newWebhook);
            this.selectedWebhook = newWebhook;
        },
        {
            successToast: {
                title: 'Webhook has been created successfully'
            },
            errorToast: {
                title: "Webhook wasn't created"
            }
        }
    );

    deleteWebhook = this.webhooks$.createAsyncAction(
        async (id: number) => {
            await rtTonApiClient.webhooks.deleteWebhook(id, {
                project_id: this.getProjectId(),
                network: this.network
            });

            return this.webhooks$.value.filter(item => item.id !== id);
        },
        {
            successToast: {
                title: 'Webhook has been deleted successfully'
            },
            errorToast: {
                title: "Webhook wasn't deleted"
            }
        }
    );

    unsubscribeWebhook = this.webhooks$.createAsyncAction(
        async (accounts: Address[]) => {
            if (!this.selectedWebhook) {
                throw new Error('Webhook is not selected');
            }

            await rtTonApiClient.webhooks.webhookAccountTxUnsubscribe(
                this.selectedWebhook.id,
                {
                    project_id: this.getProjectId(),
                    network: this.network
                },
                {
                    accounts: accounts.map(account => Object(account.toRawString()))
                }
            );
        },
        {
            successToast: {
                title: 'Webhook has been unsubscribed successfully'
            },
            errorToast: {
                title: "Webhook wasn't unsubscribed"
            }
        }
    );

    backWebhookToOnline = this.webhooks$.createAsyncAction(
        async (webhook: Webhook) => {
            await rtTonApiClient.webhooks.webhookBackOnline(webhook.id, {
                project_id: this.getProjectId(),
                network: this.network
            });

            return this.webhooks$.value.map(item => {
                if (item.id === webhook.id) {
                    return { ...item, status: RTWebhookListStatusEnum.RTOnline };
                }

                return item;
            });
        },
        {
            successToast: {
                title: 'Webhook successfully back to online'
            },
            errorToast: {
                title: "Webhook status wasn't updated"
            }
        }
    );

    addSubscriptions = this.subscriptions$.createAsyncAction(
        async (accounts: Address[]) => {
            if (!this.selectedWebhook) {
                throw new Error('Webhook is not selected');
            }

            const webhookId = this.selectedWebhook.id;

            await rtTonApiClient.webhooks.webhookAccountTxSubscribe(
                webhookId,
                {
                    project_id: this.getProjectId(),
                    network: this.network
                },
                {
                    accounts: accounts.map(account => Object({ account_id: account.toRawString() }))
                }
            );
            this.subscriptionsPage = 1;
            return this.fetchSubscriptions(webhookId, 1);
        },
        {
            successToast: {
                title: 'Subscription has been added successfully'
            },
            errorToast: {
                title: "Subscription wasn't added"
            }
        }
    );

    fetchSubscriptions = this.subscriptions$.createAsyncAction(
        async (webhookId: number, page: number) => {
            if (!this.selectedWebhook) {
                throw new Error('Webhook is not selected');
            }

            const offset = (page - 1) * this.subscriptionsLimit;

            const response = await rtTonApiClient.webhooks
                .webhookAccountTxSubscriptions(webhookId, {
                    project_id: this.getProjectId(),
                    network: this.network,
                    limit: this.subscriptionsLimit,
                    offset
                })
                .then(res => res.data.account_tx_subscriptions);

            return response;
        }
    );

    clearStore(): void {
        this.webhooks$.clear();
        this.stats$.clear();
        this.selectedWebhook = null;
        this.subscriptions$.clear();
        this.subscriptionsPage = 1;
        this.subscriptionsTotalPages = 0;
        this.network = Network.MAINNET;
    }
}

export const webhooksStore = new WebhooksStore();
