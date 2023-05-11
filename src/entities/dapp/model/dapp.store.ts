import { makeAutoObservable } from 'mobx';
import {
    addPath,
    apiClient,
    createAsyncAction,
    createImmediateReaction,
    DTOMessagesApp,
    Loadable
} from 'src/shared';
import { projectsStore } from '../../project';
import { CreateDappForm, Dapp, PendingDapp } from './interfaces';
import { fetchDappFormByManifestUrl } from './dapp-url-validator';

class DappStore {
    dapps$ = new Loadable<Dapp[]>([]);

    pendingDapp: PendingDapp | null = null;

    constructor() {
        makeAutoObservable(this);

        createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                this.clearState();

                if (project) {
                    this.fetchDapps();
                }
            }
        );
    }

    fetchDapps = this.dapps$.createAsyncAction(() => {
        return dappsApiRequest(projectsStore.selectedProject!.id);
    });

    createDapp = createAsyncAction(async (form: CreateDappForm) => {
        if (!form.name || !form.image) {
            try {
                const dappForm = await fetchDappFormByManifestUrl(
                    addPath(form.url, 'tonconnect-manifest.json')
                );
                form = { ...form, name: dappForm.name, image: dappForm.image };
            } catch {
                /* empty */
            }
        }

        const response = await apiClient.api.createMessagesApp(
            {
                project_id: projectsStore.selectedProject!.id
            },
            form
        );

        this.pendingDapp = {
            ...form,
            token: response.data.payload,
            validUntil: new Date(response.data.valid_until * 1000)
        };
    });

    deleteValidatedDapp = this.dapps$.createAsyncAction(
        async (id: Dapp['id']) => {
            await apiClient.api.deleteMessagesApp({
                app_id: id
            });

            return dappsApiRequest(projectsStore.selectedProject!.id);
        },
        {
            successToast: {
                title: 'Dapp deleted successfully'
            },
            errorToast: {
                title: "Dapp wasn't deleted"
            }
        }
    );

    validatePendingDapp = this.dapps$.createAsyncAction(
        async () => {
            const token = this.pendingDapp?.token;
            if (!token) {
                throw new Error('Dapp to validate is not set');
            }

            await apiClient.api.verifyMessagesApp(
                {
                    project_id: projectsStore.selectedProject!.id
                },
                {
                    payload: token
                }
            );

            this.pendingDapp = null;

            return dappsApiRequest(projectsStore.selectedProject!.id);
        },
        {
            successToast: {
                title: 'Dapp validated successfully'
            },
            errorToast: {
                title: 'Dapp validation error',
                description: 'Make sure you put the file to your webserver'
            }
        }
    );

    clearPendingDapp = (): void => {
        this.pendingDapp = null;
    };

    clearState = (): void => {
        this.dapps$.clear();
        this.clearPendingDapp();
    };
}

async function dappsApiRequest(projectId: number): Promise<Dapp[]> {
    const response = await apiClient.api.getMessagesApps({
        project_id: projectId
    });

    return response.data.items.filter(filterVerifiedDapps).map(mapDTODappToDapp);
}

function filterVerifiedDapps(dtoDapp: DTOMessagesApp): boolean {
    return dtoDapp.verify;
}

function mapDTODappToDapp(dtoDapp: DTOMessagesApp): Dapp {
    const dapp: Dapp = {
        id: dtoDapp.id,
        url: dtoDapp.url,
        creationDate: new Date(dtoDapp.date_create)
    };

    if (dtoDapp.name) {
        dapp.name = dtoDapp.name;
    }

    if (dtoDapp.image) {
        dapp.image = dtoDapp.image;
    }

    return dapp;
}

export const dappStore = new DappStore();
