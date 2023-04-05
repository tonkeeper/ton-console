import { apiClient, createAsyncAction, createEffect, DTOToken } from 'src/shared';
import { EditApiKeyForm, ApiKey, CreateApiKeyForm } from './interfaces';
import { projectsStore } from 'src/entities';
import { createStandaloneToast } from '@chakra-ui/react';
import { makeAutoObservable } from 'mobx';

class ApiKeysStore {
    apiKeys: ApiKey[] = [];

    isLoading = false;

    constructor() {
        makeAutoObservable(this);

        createEffect(() => {
            if (projectsStore.selectedProject) {
                this.fetchApiKeys();
            } else {
                this.clearStore();
            }
        });
    }

    fetchApiKeys = async (): Promise<void> => {
        this.isLoading = true;
        try {
            const response = await apiClient.api.getTonApiTokens({
                project_id: projectsStore.selectedProject!.id
            });

            this.apiKeys = response.data.items.map(mapApiTokenDTOToApiKey);
        } catch (e) {
            console.error(e);
        }

        this.isLoading = false;
    };

    createApiKey = createAsyncAction(
        async (form: CreateApiKeyForm) => {
            const response = await apiClient.api.generateTonApiProjectToken(
                { project_id: projectsStore.selectedProject!.id },
                form
            );

            if (response.data.token) {
                this.apiKeys.push(mapApiTokenDTOToApiKey(response.data.token));
            }

            const { toast } = createStandaloneToast();
            toast({
                title: 'Api key has been created successfully',
                status: 'success',
                isClosable: true
            });
        },
        () => {
            const { toast } = createStandaloneToast();
            toast({
                title: "Api key wasn't created",
                description: 'Unknown api error happened. Try again later',
                status: 'error',
                isClosable: true
            });
        }
    );

    editApiKey = createAsyncAction(
        async ({ id, name }: EditApiKeyForm) => {
            await apiClient.api.updateTonApiProjectToken(
                id,
                { project_id: projectsStore.selectedProject!.id },
                { name }
            );

            const key = this.apiKeys.find(item => item.id === id);

            if (key) {
                key.name = name;
            }

            const { toast } = createStandaloneToast();
            toast({
                title: 'Api key has been modified successfully',
                status: 'success',
                isClosable: true
            });
        },
        () => {
            const { toast } = createStandaloneToast();
            toast({
                title: "Api key wasn't modified",
                description: 'Unknown api error happened. Try again later',
                status: 'error',
                isClosable: true
            });
        }
    );

    deleteApiKey = createAsyncAction(
        async (id: number) => {
            await new Promise(r => setTimeout(r, 1500));

            await apiClient.api.deleteTonApiProjectToken(id, {
                project_id: projectsStore.selectedProject!.id
            });

            this.apiKeys = this.apiKeys.filter(item => item.id !== id);

            const { toast } = createStandaloneToast();
            toast({
                title: 'Api key has been deleted successfully',
                status: 'success',
                isClosable: true
            });
        },
        () => {
            const { toast } = createStandaloneToast();
            toast({
                title: "Api key wasn't deleted",
                description: 'Unknown api error happened. Try again later',
                status: 'error',
                isClosable: true
            });
        }
    );

    clearStore(): void {
        this.isLoading = false;
        this.apiKeys = [];
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
