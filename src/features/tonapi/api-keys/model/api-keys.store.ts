import { createImmediateReaction, Loadable } from 'src/shared';
import {
    DTOProjectTonApiToken,
    getProjectTonApiTokens,
    generateProjectTonApiToken,
    updateProjectTonApiToken,
    deleteProjectTonApiToken
} from 'src/shared/api';
import { EditApiKeyForm, ApiKey, CreateApiKeyForm } from './interfaces';
import { makeAutoObservable } from 'mobx';
import { ProjectsStore } from 'src/entities/project/model/projects.store';

export class ApiKeysStore {
    apiKeys$ = new Loadable<ApiKey[]>([]);

    private projectsStore: ProjectsStore;
    private disposers: Array<() => void> = [];

    constructor(projectsStore: ProjectsStore) {
        this.projectsStore = projectsStore;
        makeAutoObservable(this);

        const dispose = createImmediateReaction(
            () => this.projectsStore.selectedProject?.id,
            project => {
                this.clearStore();

                if (project) {
                    this.fetchApiKeys();
                }
            }
        );
        this.disposers.push(dispose);
    }

    fetchApiKeys = this.apiKeys$.createAsyncAction(async () => {
        const { data, error } = await getProjectTonApiTokens({
            query: { project_id: this.projectsStore.selectedProject!.id }
        });

        if (error) throw error

        return data.items.map(mapApiTokenDTOToApiKey);
    });

    createApiKey = this.apiKeys$.createAsyncAction(
        async ({ name, limitRps, origins, capabilities }: CreateApiKeyForm) => {
            const projectId = this.projectsStore.selectedProject!.id;
            const { data, error } = await generateProjectTonApiToken({
                query: { project_id: projectId },
                body: {
                    name,
                    limit_rps: limitRps ?? undefined,
                    origins,
                    capabilities
                }
            });

            if (error) throw error

            if (data.token) {
                this.apiKeys$.value.push(mapApiTokenDTOToApiKey(data.token));
            }
        },
        {
            successToast: {
                title: 'Api key has been created successfully'
            },
            errorToast: {
                title: "Api key wasn't created"
            }
        }
    );

    editApiKey = this.apiKeys$.createAsyncAction(
        async ({ id, name, limitRps, origins, capabilities }: EditApiKeyForm) => {
            const { error } = await updateProjectTonApiToken({
                path: { id },
                query: { project_id: this.projectsStore.selectedProject!.id },
                body: {
                    name,
                    limit_rps: limitRps ?? undefined,
                    origins,
                    capabilities
                }
            });

            if (error) throw error

            const key = this.apiKeys$.value.find(item => item.id === id);

            if (key) {
                key.name = name;
                key.limitRps = limitRps;
                key.origins = origins;
                key.capabilities = capabilities;
            }
        },
        {
            successToast: {
                title: 'Api key has been modified successfully'
            },
            errorToast: {
                title: "Api key wasn't modified"
            }
        }
    );

    deleteApiKey = this.apiKeys$.createAsyncAction(
        async (id: number) => {
            const { error } = await deleteProjectTonApiToken({
                path: { id },
                query: { project_id: this.projectsStore.selectedProject!.id }
            });

            if (error) throw error

            return this.apiKeys$.value.filter(item => item.id !== id);
        },
        {
            successToast: {
                title: 'Api key has been deleted successfully'
            },
            errorToast: {
                title: "Api key wasn't deleted"
            }
        }
    );

    clearStore(): void {
        this.apiKeys$.clear();
    }

    destroy(): void {
        this.disposers.forEach(dispose => dispose?.());
        this.disposers = [];
    }
}

function mapApiTokenDTOToApiKey(apiTokenDTO: DTOProjectTonApiToken): ApiKey {
    return {
        name: apiTokenDTO.name,
        value: apiTokenDTO.token,
        creationDate: new Date(apiTokenDTO.date_create),
        limitRps: apiTokenDTO.limit_rps || null,
        origins: apiTokenDTO.origins || undefined,
        id: apiTokenDTO.id,
        capabilities: apiTokenDTO.capabilities ?? []
    };
}
