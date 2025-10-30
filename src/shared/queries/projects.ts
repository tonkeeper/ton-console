import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createStandaloneToast } from '@chakra-ui/react';
import {
    DTOProject,
    DTOParticipant,
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    getProjectParticipants,
    addProjectParticipant,
    deleteProjectParticipant
} from 'src/shared/api';
import {
    ProjectFormValues,
    Project,
    UpdateProjectFormValues,
    AddProjectParticipantFormValues
} from 'src/entities/project/model/interfaces';
import { toColor } from 'src/shared';

/**
 * Map DTO to domain Project model
 */
function mapProjectDtoToProject(projectDTO: DTOProject): Project {
    return {
        id: projectDTO.id,
        name: projectDTO.name,
        imgUrl: projectDTO.avatar,
        creationDate: new Date(projectDTO.date_create),
        fallbackBackground: gradient(
            toColor(Math.abs(projectDTO.id ^ 255), { min: 30, max: 215 })
        ),
        capabilities: {
            invoices: projectDTO.capabilities.includes('invoices'),
            stats: { query: projectDTO.capabilities.includes('stats') }
        }
    };
}

function gradient(color: string): string {
    return `linear-gradient(27.61deg, ${color} -4.58%, ${color}60 107.4%)`;
}

/**
 * Query hook to fetch all user projects
 * 
 * Note: This query should only run when user is authenticated.
 * Pass enabled: false when user is not logged in.
 */
export function useProjectsQuery(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: ['projects'],
        queryFn: async (): Promise<Project[]> => {
            const { data, error } = await getProjects();

            if (error) throw error;

            return data.items.map(mapProjectDtoToProject);
        },
        // Only fetch when explicitly enabled (controlled by caller based on auth state)
        enabled: options?.enabled ?? true,
        staleTime: 5 * 60 * 1000, // 5 minutes
        // Keep previous data while refetching
        placeholderData: (previousData: Project[] | undefined) => previousData
    });
}

/**
 * Mutation hook to create a new project
 */
export function useCreateProjectMutation() {
    const queryClient = useQueryClient();
    const { toast } = createStandaloneToast();

    return useMutation({
        mutationFn: async (form: ProjectFormValues): Promise<Project> => {
            const { data, error } = await createProject({
                body: {
                    name: form.name,
                    ...(form.icon && { image: form.icon })
                }
            });

            if (error) throw error;

            return mapProjectDtoToProject(data.project);
        },
        onSuccess: (newProject) => {
            // Add new project to cache
            queryClient.setQueryData<Project[]>(['projects'], (old = []) => {
                return [...old, newProject];
            });

            toast({
                title: 'Project created successfully',
                status: 'success',
                duration: 3000
            });
        },
        onError: () => {
            toast({
                title: "Project wasn't created",
                status: 'error',
                duration: 3000
            });
        }
    });
}

/**
 * Mutation hook to update an existing project
 */
export function useUpdateProjectMutation() {
    const queryClient = useQueryClient();
    const { toast } = createStandaloneToast();

    return useMutation({
        mutationFn: async (form: UpdateProjectFormValues): Promise<Project> => {
            const bodyData: {
                name?: string;
                image?: File;
                remove_image?: boolean;
            } = {};

            if ('icon' in form) {
                if (form.icon) {
                    bodyData.image = form.icon;
                } else {
                    bodyData.remove_image = true;
                }
            }

            if ('name' in form) {
                bodyData.name = form.name;
            }

            const { data, error } = await updateProject({
                path: { id: form.projectId },
                body: bodyData
            });

            if (error) throw error;

            return mapProjectDtoToProject(data.project);
        },
        onSuccess: (updatedProject) => {
            // Update project in cache
            queryClient.setQueryData<Project[]>(['projects'], (old = []) => {
                return old.map(project =>
                    project.id === updatedProject.id ? updatedProject : project
                );
            });

            toast({
                title: 'Project updated successfully',
                status: 'success',
                duration: 3000
            });
        },
        onError: () => {
            toast({
                title: "Project wasn't updated",
                status: 'error',
                duration: 3000
            });
        }
    });
}

/**
 * Mutation hook to delete a project
 */
export function useDeleteProjectMutation() {
    const queryClient = useQueryClient();
    const { toast } = createStandaloneToast();

    return useMutation({
        mutationFn: async (projectId: number): Promise<{ deletedId: number }> => {
            const { error } = await deleteProject({
                path: { id: projectId }
            });

            if (error) throw error;

            return { deletedId: projectId };
        },
        onSuccess: ({ deletedId }) => {
            // Remove project from cache
            queryClient.setQueryData<Project[]>(['projects'], (old = []) => {
                return old.filter(project => project.id !== deletedId);
            });

            toast({
                title: 'Project deleted successfully',
                status: 'success',
                duration: 3000
            });
        },
        onError: () => {
            toast({
                title: "Project wasn't deleted",
                status: 'error',
                duration: 3000
            });
        }
    });
}

/**
 * Query hook to fetch project participants
 * Requires selectedProjectId from context
 */
export function useProjectParticipantsQuery(projectId: number | null, currentUserId?: number) {
    return useQuery({
        queryKey: ['project-participants', projectId],
        queryFn: async (): Promise<DTOParticipant[]> => {
            if (!projectId) return [];

            const { data, error } = await getProjectParticipants({
                path: { id: projectId }
            });

            if (error) throw error;

            // Filter out current user
            return data.items.filter(item => item.id !== currentUserId);
        },
        enabled: !!projectId,
        staleTime: 2 * 60 * 1000 // 2 minutes
    });
}

/**
 * Mutation hook to add a participant to project
 */
export function useAddProjectParticipantMutation(projectId: number | null) {
    const queryClient = useQueryClient();
    const { toast } = createStandaloneToast();

    return useMutation({
        mutationFn: async (form: AddProjectParticipantFormValues): Promise<DTOParticipant> => {
            if (!projectId) {
                throw new Error('No project selected');
            }

            const { data, error } = await addProjectParticipant({
                path: { id: projectId },
                body: { user_id: form.userId }
            });

            if (error) throw error;

            return data.participant;
        },
        onSuccess: (newParticipant) => {
            // Add participant to cache
            queryClient.setQueryData<DTOParticipant[]>(
                ['project-participants', projectId],
                (old = []) => {
                    return [...old, newParticipant];
                }
            );

            toast({
                title: 'User added successfully',
                status: 'success',
                duration: 3000
            });
        },
        onError: () => {
            toast({
                title: "User wasn't added",
                status: 'error',
                duration: 3000
            });
        }
    });
}

/**
 * Mutation hook to delete a participant from project
 */
export function useDeleteProjectParticipantMutation(projectId: number | null) {
    const queryClient = useQueryClient();
    const { toast } = createStandaloneToast();

    return useMutation({
        mutationFn: async (participantId: number): Promise<{ deletedId: number }> => {
            if (!projectId) {
                throw new Error('No project selected');
            }

            const { error } = await deleteProjectParticipant({
                path: {
                    id: projectId,
                    user_id: participantId
                }
            });

            if (error) throw error;

            return { deletedId: participantId };
        },
        onSuccess: ({ deletedId }) => {
            // Remove participant from cache
            queryClient.setQueryData<DTOParticipant[]>(
                ['project-participants', projectId],
                (old = []) => {
                    return old.filter(item => item.id !== deletedId);
                }
            );

            toast({
                title: 'User deleted successfully',
                status: 'success',
                duration: 3000
            });
        },
        onError: () => {
            toast({
                title: "User wasn't deleted",
                status: 'error',
                duration: 3000
            });
        }
    });
}
