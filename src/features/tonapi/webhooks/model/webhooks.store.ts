import { createImmediateReaction, Loadable } from 'src/shared';
import { Webhook, CreateWebhookForm } from './interfaces';
import { projectsStore } from 'src/entities';
import { makeAutoObservable } from 'mobx';
import { rtTonApiClient, RTWebhookAccountTxSubscriptions } from 'src/shared/api/streaming-api';
import { Address } from '@ton/core';

export type Subscription = RTWebhookAccountTxSubscriptions['account_tx_subscriptions'][0];

class WebhooksStore {
    webhooks$ = new Loadable<Webhook[]>([]);

    selectedWebhook: Webhook | null = null;

    subscriptions$ = new Loadable<Subscription[]>([]);

    constructor() {
        makeAutoObservable(this);

        createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                this.clearStore();

                if (project) {
                    this.fetchWebhooks();
                }
            }
        );

        createImmediateReaction(
            () => this.selectedWebhook,
            selectedWebhook => {
                if (selectedWebhook) {
                    this.fetchSubscriptions(selectedWebhook.id);
                } else {
                    this.subscriptions$.clear();
                }
            }
        );
    }

    setSelectedWebhookId = async (id: string | null): Promise<void> => {
        if (!this.webhooks$.isResolved) {
            await this.fetchWebhooks();
        }
        const webhook = this.webhooks$.value.find(item => String(item.id) === id);

        if (webhook) {
            this.selectedWebhook = webhook;
        }

        if (!this.selectedWebhook) {
            this.selectedWebhook = null;
        }
    };

    fetchWebhooks = this.webhooks$.createAsyncAction(async () => {
        const response = await rtTonApiClient.webhooks
            .getWebhooks({
                project_id: String(projectsStore.selectedProject!.id)
            })
            .then(res => res.data.webhooks);

        return response;
    });

    createWebhook = this.webhooks$.createAsyncAction(
        async ({ endpoint }: CreateWebhookForm) => {
            const resCreateWebhook = await rtTonApiClient.webhooks
                .createWebhook(
                    { project_id: String(projectsStore.selectedProject!.id) },
                    { endpoint }
                )
                .then(res => res.data);

            this.webhooks$.value.push({ id: resCreateWebhook.webhook_id, endpoint });
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
                project_id: String(projectsStore.selectedProject!.id)
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
                    project_id: String(projectsStore.selectedProject!.id)
                },
                {
                    accounts: accounts.map(account => Object({ account_id: account.toRawString() }))
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

    addSubscriptions = this.subscriptions$.createAsyncAction(
        async (accounts: Address[]) => {
            if (!this.selectedWebhook) {
                throw new Error('Webhook is not selected');
            }

            const webhookId = this.selectedWebhook.id;

            await rtTonApiClient.webhooks.webhookAccountTxSubscribe(
                webhookId,
                {
                    project_id: String(projectsStore.selectedProject!.id)
                },
                {
                    accounts: accounts.map(account => Object({ account_id: account.toRawString() }))
                }
            );

            return this.fetchSubscriptions(webhookId);
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

    fetchSubscriptions = this.subscriptions$.createAsyncAction(async (webhookId: number) => {
        const response = await rtTonApiClient.webhooks
            .webhookAccountTxSubscriptions(webhookId, {
                project_id: String(projectsStore.selectedProject!.id)
            })
            .then(res => res.data.account_tx_subscriptions);

        return response;
    });

    clearStore(): void {
        this.webhooks$.clear();
    }
}

export const webhooksStore = new WebhooksStore();
