import { createAsyncAction, createEffect } from 'src/shared';
import { EditApiKeyForm, ApiKey, CreateApiKeyForm } from './interfaces';
import { projectsStore } from 'src/entities';
import { createStandaloneToast } from '@chakra-ui/react';

class ApiKeysStore {
    apiKeys: ApiKey[] = [];

    isLoading = false;

    constructor() {
        createEffect(() => {
            if (projectsStore.selectedProject) {
                this.fetchApiKeys();
            }
        });
    }

    fetchApiKeys = async (): Promise<void> => {
        this.isLoading = true;

        try {
            this.apiKeys = [
                {
                    id: 0,
                    name: 'First',
                    value: '1234567890123456789012345678901234567890',
                    creationDate: new Date()
                },
                {
                    id: 1,
                    name: 'Second',
                    value: '1234567890123456789012345678901234567891',
                    creationDate: new Date()
                }
            ];
        } catch (e) {
            console.error(e);
        }

        this.isLoading = false;
    };

    createApiKey = createAsyncAction(
        async (form: CreateApiKeyForm) => {
            await new Promise(r => setTimeout(r, 1500));

            /* const response = await apiClient.api.generateProjectToken(
                projectsStore.selectedProject!.id,
                form
            );*/

            this.apiKeys.push({
                id: Math.random(),
                name: form.name,
                value: Math.random().toString(),
                creationDate: new Date()
            });

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
            await new Promise(r => setTimeout(r, 1500));

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
}

export const apiKeysStore = new ApiKeysStore();
