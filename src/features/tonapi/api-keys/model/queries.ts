import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getProjectTonApiTokens,
    generateProjectTonApiToken,
    updateProjectTonApiToken,
    deleteProjectTonApiToken
} from 'src/shared/api';
import { useProjectId } from 'src/shared/contexts/ProjectContext';
import { ApiKey, CreateApiKeyForm, EditApiKeyForm } from './interfaces';
import { DTOProjectTonApiToken } from 'src/shared/api';

const API_KEYS_QUERY_KEY = ['api-keys'] as const;

const getApiKeysQueryKey = (projectId: number | null | undefined) => [...API_KEYS_QUERY_KEY, projectId] as const;

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
    const projectId = useProjectId();

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
    const projectId = useProjectId();

    return useMutation({
        mutationFn: async (form: CreateApiKeyForm) => {
            const currentProjectId = projectId;
            if (!currentProjectId) throw new Error('No project selected');

            const { data, error } = await generateProjectTonApiToken({
                query: { project_id: currentProjectId },
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
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getApiKeysQueryKey(projectId)
            });
        }
    });
}

export function useEditApiKeyMutation() {
    const queryClient = useQueryClient();
    const projectId = useProjectId();

    return useMutation({
        mutationFn: async (form: EditApiKeyForm) => {
            const currentProjectId = projectId;
            if (!currentProjectId) throw new Error('No project selected');

            const { error } = await updateProjectTonApiToken({
                path: { id: form.id },
                query: { project_id: currentProjectId },
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
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getApiKeysQueryKey(projectId)
            });
        }
    });
}

export function useDeleteApiKeyMutation() {
    const queryClient = useQueryClient();
    const projectId = useProjectId();

    return useMutation({
        mutationFn: async (id: number) => {
            const currentProjectId = projectId;
            if (!currentProjectId) throw new Error('No project selected');

            const { error } = await deleteProjectTonApiToken({
                path: { id },
                query: { project_id: currentProjectId }
            });

            if (error) throw error;

            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getApiKeysQueryKey(projectId)
            });
        }
    });
}
