import { apiClient, createImmediateReaction, DTOToken, Loadable } from 'src/shared';
import { EditApiKeyForm, ApiKey, CreateApiKeyForm } from './interfaces';
import { projectsStore } from 'src/entities';
import { makeAutoObservable } from 'mobx';

class ApiKeysStore {
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
        const response = await apiClient.api.getTonApiTokens({
            project_id: projectsStore.selectedProject!.id
        });

        return response.data.items.map(mapApiTokenDTOToApiKey);
    });

    createApiKey = this.apiKeys$.createAsyncAction(
        async (form: CreateApiKeyForm) => {
            const response = await apiClient.api.generateTonApiProjectToken(
                { project_id: projectsStore.selectedProject!.id },
                form
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
        async ({ id, name }: EditApiKeyForm) => {
            await apiClient.api.updateTonApiProjectToken(
                id,
                { project_id: projectsStore.selectedProject!.id },
                { name }
            );

            const key = this.apiKeys$.value.find(item => item.id === id);

            if (key) {
                key.name = name;
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
            await apiClient.api.deleteTonApiProjectToken(id, {
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

function mapApiTokenDTOToApiKey(apiTokenDTO: DTOToken): ApiKey {
    return {
        name: apiTokenDTO.name,
        value: apiTokenDTO.token,
        creationDate: new Date(apiTokenDTO.date_create),
        id: apiTokenDTO.id
    };
}

export const apiKeysStore = new ApiKeysStore();
