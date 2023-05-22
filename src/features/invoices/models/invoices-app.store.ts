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

    clearState(): void {
        this.invoicesApp$.clear();
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
