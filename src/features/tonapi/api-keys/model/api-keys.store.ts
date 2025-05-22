import { apiClient, createImmediateReaction, DTOProjectTonApiToken, Loadable } from 'src/shared';
import { EditApiKeyForm, ApiKey, CreateApiKeyForm } from './interfaces';
import { projectsStore } from 'src/shared/stores';
import { makeAutoObservable } from 'mobx';

export class ApiKeysStore {
    apiKeys$ = new Loadable<ApiKey[]>([]);

    constructor() {
        makeAutoObservable(this);

        createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                this.clearStore();

                if (project) {
                    this.fetchApiKeys();
                }
            }
        );
    }

    fetchApiKeys = this.apiKeys$.createAsyncAction(async () => {
        const response = await apiClient.api.getProjectTonApiTokens({
            project_id: projectsStore.selectedProject!.id
        });

        return response.data.items.map(mapApiTokenDTOToApiKey);
    });

    createApiKey = this.apiKeys$.createAsyncAction(
        async ({ name, limitRps, origins, capabilities }: CreateApiKeyForm) => {
            const response = await apiClient.api.generateProjectTonApiToken(
                { project_id: projectsStore.selectedProject!.id },
                { name, limit_rps: limitRps, origins, capabilities }
            );

            if (response.data.token) {
                this.apiKeys$.value.push(mapApiTokenDTOToApiKey(response.data.token));
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
            await apiClient.api.updateProjectTonApiToken(
                id,
                { project_id: projectsStore.selectedProject!.id },
                { name, limit_rps: limitRps, origins, capabilities }
            );

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
            await apiClient.api.deleteProjectTonApiToken(id, {
                project_id: projectsStore.selectedProject!.id
            });

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
