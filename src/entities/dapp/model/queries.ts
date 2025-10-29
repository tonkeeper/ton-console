import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getProjectMessagesApps,
    createProjectMessagesApp,
    deleteProjectMessagesApp,
    verifyProjectMessagesApp,
    DTOMessagesApp
} from 'src/shared/api';
import { useProjectId } from 'src/shared/contexts/ProjectIdContext';
import { CreateDappForm, Dapp, PendingDapp } from './interfaces';
import { fetchDappFormByManifestUrl } from './dapp-url-validator';
import { addPath } from 'src/shared';
import { createStandaloneToast } from '@chakra-ui/react';

/**
 * Query key factory for dapp queries
 */
const dappKeys = {
  all: () => ['dapps'] as const,
  byProject: (projectId: number | null | undefined) => [...dappKeys.all(), 'project', projectId] as const
};

/**
 * Filter verified dapps from API response
 */
function filterVerifiedDapps(dtoDapp: DTOMessagesApp): boolean {
  return dtoDapp.verify;
}

/**
 * Map API DTO to domain model
 */
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

/**
 * Fetch dapps list for project
 */
async function fetchDappsForProject(projectId: number): Promise<Dapp[]> {
  const { data, error } = await getProjectMessagesApps({
    query: { project_id: projectId }
  });

  if (error) throw error;

  return data.items.filter(filterVerifiedDapps).map(mapDTODappToDapp);
}

/**
 * Hook to fetch dapps for current project
 */
export function useDappsQuery() {
  const projectId = useProjectId();

  return useQuery({
    queryKey: dappKeys.byProject(projectId),
    queryFn: async () => {
      if (!projectId) return [];
      return fetchDappsForProject(projectId);
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

/**
 * Mutation hook for creating a new dapp
 */
export function useCreateDappMutation() {
  const queryClient = useQueryClient();
  const projectId = useProjectId();

  return useMutation({
    mutationFn: async (form: CreateDappForm): Promise<PendingDapp & { _projectId: number }> => {
      const currentProjectId = projectId; // Capture at mutation time
      if (!currentProjectId) throw new Error('Project not selected');

      let finalForm = form;

      // Fetch dapp metadata from manifest if not provided
      if (!form.name || !form.image) {
        try {
          const dappForm = await fetchDappFormByManifestUrl(
            addPath(form.url, 'tonconnect-manifest.json')
          );
          finalForm = { ...form, name: dappForm.name, image: dappForm.image };
        } catch {
          // Continue with provided data if manifest fetch fails
        }
      }

      const { data, error } = await createProjectMessagesApp({
        query: { project_id: currentProjectId },
        body: finalForm as Required<CreateDappForm>
      });

      if (error) throw error;

      return {
        ...finalForm,
        token: data.payload,
        validUntil: new Date(data.valid_until * 1000),
        _projectId: currentProjectId
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: dappKeys.byProject(data._projectId)
      });

      createStandaloneToast().toast({
        title: 'App created successfully',
        description: 'Please verify it to complete registration',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    },
    onError: (error) => {
      createStandaloneToast().toast({
        title: 'Failed to create app',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  });
}

/**
 * Mutation hook for validating a pending dapp
 */
export function useValidateDappMutation() {
  const queryClient = useQueryClient();
  const projectId = useProjectId();

  return useMutation({
    mutationFn: async (token: string): Promise<{ _projectId: number }> => {
      const currentProjectId = projectId; // Capture at mutation time
      if (!currentProjectId) throw new Error('Project not selected');

      const { error } = await verifyProjectMessagesApp({
        query: { project_id: currentProjectId },
        body: { payload: token }
      });

      if (error) throw error;

      return { _projectId: currentProjectId };
    },
    onSuccess: (data) => {
      // Invalidate dapps list to refetch
      queryClient.invalidateQueries({
        queryKey: dappKeys.byProject(data._projectId)
      });

      createStandaloneToast().toast({
        title: 'Dapp validated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    },
    onError: () => {
      createStandaloneToast().toast({
        title: 'Dapp validation error',
        description: 'Make sure you put the file to your webserver',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  });
}

/**
 * Mutation hook for deleting a dapp
 */
export function useDeleteDappMutation() {
  const queryClient = useQueryClient();
  const projectId = useProjectId();

  return useMutation({
    mutationFn: async (dappId: number): Promise<{ _projectId: number }> => {
      const currentProjectId = projectId; // Capture at mutation time
      if (!currentProjectId) throw new Error('Project not selected');

      const { error } = await deleteProjectMessagesApp({
        query: { app_id: dappId }
      });

      if (error) throw error;

      return { _projectId: currentProjectId };
    },
    onSuccess: (data) => {
      // Invalidate dapps list to refetch
      queryClient.invalidateQueries({
        queryKey: dappKeys.byProject(data._projectId)
      });

      createStandaloneToast().toast({
        title: 'Dapp deleted successfully',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    },
    onError: () => {
      createStandaloneToast().toast({
        title: "Dapp wasn't deleted",
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  });
}
