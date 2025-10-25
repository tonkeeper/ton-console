import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getProjectTonApiTokens,
    generateProjectTonApiToken,
    updateProjectTonApiToken,
    deleteProjectTonApiToken
} from 'src/shared/api';
import { projectsStore } from 'src/shared/stores';
import { ApiKey, CreateApiKeyForm, EditApiKeyForm } from './interfaces';
import { DTOProjectTonApiToken } from 'src/shared/api';

const API_KEYS_QUERY_KEY = ['api-keys'] as const;

const getApiKeysQueryKey = (projectId: number | undefined) => [...API_KEYS_QUERY_KEY, projectId] as const;

function mapApiTokenDTOToApiKey(apiTokenDTO: DTOProjectTonApiToken): ApiKey {
    return {
        name: apiTokenDTO.name,
        value: apiTokenDTO.token,
        creationDate: new Date(apiTokenDTO.date_create),
        limitRps: apiTokenDTO.limit_rps,
        origins: apiTokenDTO.origins || undefined,
        id: apiTokenDTO.id,
        capabilities: apiTokenDTO.capabilities ?? []
    };
}

export function useApiKeysQuery() {
    const projectId = projectsStore.selectedProject?.id;

    return useQuery({
        queryKey: getApiKeysQueryKey(projectId),
        queryFn: async () => {
            if (!projectId) throw new Error('No project selected');

            const { data, error } = await getProjectTonApiTokens({
                query: { project_id: projectId }
            });

            if (error) throw error;

            return data.items.map(mapApiTokenDTOToApiKey);
        },
        enabled: !!projectId
    });
}

export function useCreateApiKeyMutation() {
    const queryClient = useQueryClient();
    const projectId = projectsStore.selectedProject?.id;

    return useMutation({
        mutationFn: async (form: CreateApiKeyForm) => {
            if (!projectId) throw new Error('No project selected');

            const { data, error } = await generateProjectTonApiToken({
                query: { project_id: projectId },
                body: {
                    name: form.name,
                    limit_rps: form.limitRps ?? undefined,
                    origins: form.origins,
                    capabilities: form.capabilities
                }
            });

            if (error) throw error;

            return data.token ? mapApiTokenDTOToApiKey(data.token) : null;
        },
        onSuccess: (newKey) => {
            if (newKey) {
                queryClient.setQueryData(
                    getApiKeysQueryKey(projectId),
                    (oldData: ApiKey[] | undefined) => [...(oldData || []), newKey]
                );
            }
        }
    });
}

export function useEditApiKeyMutation() {
    const queryClient = useQueryClient();
    const projectId = projectsStore.selectedProject?.id;

    return useMutation({
        mutationFn: async (form: EditApiKeyForm) => {
            if (!projectId) throw new Error('No project selected');

            const { error } = await updateProjectTonApiToken({
                path: { id: form.id },
                query: { project_id: projectId },
                body: {
                    name: form.name,
                    limit_rps: form.limitRps ?? undefined,
                    origins: form.origins,
                    capabilities: form.capabilities
                }
            });

            if (error) throw error;

            return form;
        },
        onSuccess: (form) => {
            queryClient.setQueryData(
                getApiKeysQueryKey(projectId),
                (oldData: ApiKey[] | undefined) =>
                    oldData?.map(key =>
                        key.id === form.id
                            ? {
                                  ...key,
                                  name: form.name,
                                  limitRps: form.limitRps,
                                  origins: form.origins,
                                  capabilities: form.capabilities
                              }
                            : key
                    ) || []
            );
        }
    });
}

export function useDeleteApiKeyMutation() {
    const queryClient = useQueryClient();
    const projectId = projectsStore.selectedProject?.id;

    return useMutation({
        mutationFn: async (id: number) => {
            if (!projectId) throw new Error('No project selected');

            const { error } = await deleteProjectTonApiToken({
                path: { id },
                query: { project_id: projectId }
            });

            if (error) throw error;

            return id;
        },
        onSuccess: (deletedId) => {
            queryClient.setQueryData(
                getApiKeysQueryKey(projectId),
                (oldData: ApiKey[] | undefined) => oldData?.filter(key => key.id !== deletedId) || []
            );
        }
    });
}
