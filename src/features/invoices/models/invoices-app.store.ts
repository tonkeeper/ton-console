import { makeAutoObservable } from 'mobx';
import {
    apiClient,
    Loadable,
    createImmediateReaction,
    toUserFriendlyAddress,
    DTOInvoicesApp
} from 'src/shared';
import { projectsStore } from 'src/entities';
import { InvoicesApp, InvoicesProjectForm } from './interfaces';

class InvoicesAppStore {
    invoicesApp$ = new Loadable<InvoicesApp | null>(null);

    appToken$ = new Loadable<string | null>(null);

    feePercent$ = new Loadable<number | null>(null);

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
                    this.fetchFeePercent();
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
        const response = await apiClient.api.getMessagesAppToken({
            app_id: this.invoicesApp$.value!.id
        });

        return response.data.token;
    });

    fetchFeePercent = this.feePercent$.createAsyncAction(async () => {
        const response = await apiClient.api.getServiceInvoicesFee();

        return response.data.fee;
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

    clearState(): void {
        this.invoicesApp$.clear();
    }

    clearAppRelatedState(): void {
        this.appToken$.clear();
        this.feePercent$.clear();
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

export const invoicesAppStore = new InvoicesAppStore();
