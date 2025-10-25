import { makeAutoObservable } from 'mobx';
import { addPath, createAsyncAction, createImmediateReaction, Loadable } from 'src/shared';
import {
    DTOMessagesApp,
    getProjectMessagesApps,
    createProjectMessagesApp,
    verifyProjectMessagesApp,
    deleteProjectMessagesApp
} from 'src/shared/api';
import { ProjectsStore } from '../../project/model/projects.store';
import { CreateDappForm, Dapp, PendingDapp } from './interfaces';
import { fetchDappFormByManifestUrl } from './dapp-url-validator';

export class DappStore {
    dapps$ = new Loadable<Dapp[]>([]);

    pendingDapp: PendingDapp | null = null;

    private readonly projectsStore: ProjectsStore;

    constructor(projectsStore: ProjectsStore) {
        makeAutoObservable(this);
        this.projectsStore = projectsStore;

        createImmediateReaction(
            () => this.projectsStore.selectedProject,
            project => {
                this.clearState();

                if (project) {
                    this.fetchDapps();
                }
            }
        );
    }

    fetchDapps = this.dapps$.createAsyncAction(() => {
        return dappsApiRequest(this.projectsStore.selectedProject!.id);
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

        const { data, error } = await createProjectMessagesApp({
            query: {
                project_id: this.projectsStore.selectedProject!.id
            },
            body: form as Required<CreateDappForm>
        });

        if (error) throw error;

        this.pendingDapp = {
            ...form,
            token: data.payload,
            validUntil: new Date(data.valid_until * 1000)
        };
    });

    deleteValidatedDapp = this.dapps$.createAsyncAction(
        async (id: Dapp['id']) => {
            const { error } = await deleteProjectMessagesApp({
                query: {
                    app_id: id
                }
            });

            if (error) throw error;

            return dappsApiRequest(this.projectsStore.selectedProject!.id);
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

            const projectId = this.projectsStore.selectedProject!.id;

            const { error } = await verifyProjectMessagesApp({
                query: { project_id: projectId },
                body: { payload: token }
            });

            if (error) throw error;

            const dappsList = await dappsApiRequest(projectId);
            this.pendingDapp = null;
            return dappsList;
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
    const { data, error } = await getProjectMessagesApps({
        query: { project_id: projectId }
    });

    if (error) throw error;

    return data.items.filter(filterVerifiedDapps).map(mapDTODappToDapp);
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
