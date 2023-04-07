import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import {
    apiClient,
    DTOProject,
    getWindow,
    createReaction,
    createAsyncAction,
    serializeState,
    deserializeState
} from 'src/shared';
import { Project, CreateProjectFormValues } from './interfaces';
import { tGUserStore } from 'src/entities';
import { createStandaloneToast } from '@chakra-ui/react';
import { UpdateProjectFormValues } from 'src/entities/project/model/interfaces/update-project-form-values';

class ProjectsStore {
    projects: Project[] = [];

    selectedProject: Project | null = null;

    isLoading = false;

    constructor() {
        makeAutoObservable(this);

        makePersistable(this, {
            name: 'ProjectsStore',
            properties: [
                {
                    key: 'projects',
                    serialize: serializeState,
                    deserialize: deserializeState
                },
                {
                    key: 'selectedProject',
                    serialize: serializeState,
                    deserialize: deserializeState
                }
            ],
            storage: getWindow()!.localStorage
        });

        createReaction(
            () => tGUserStore.user,
            user => {
                if (!user) {
                    this.clearState();
                }
            }
        );
    }

    fetchProjects = async (): Promise<void> => {
        this.isLoading = true;

        try {
            const projects = await apiClient.api.getProjects();

            this.projects = projects.data.items.map(mapProjectDtoToProject);

            if (this.projects.length) {
                this.selectProject(this.projects[0].id);
            }
        } catch (e) {
            console.error(e);
        }

        this.isLoading = false;
    };

    selectProject = (id: number): void => {
        this.selectedProject = this.projects.find(project => project.id === id) || null;
    };

    private clearState = (): void => {
        this.projects = [];
        this.selectedProject = null;
    };

    createProject = createAsyncAction(
        async (form: CreateProjectFormValues): Promise<void> => {
            const request: Parameters<typeof apiClient.api.createProject>[0] = {
                name: form.name
            };

            if (form.icon) {
                request.image = form.icon;
            }

            const response = await apiClient.api.createProject(request);

            const project = mapProjectDtoToProject(response.data.project);
            this.projects = this.projects.concat(project);
            this.selectedProject = project;

            const { toast } = createStandaloneToast();
            toast({ title: 'Project created successfully', status: 'success', isClosable: true });
        },
        () => {
            const { toast } = createStandaloneToast();
            toast({
                title: "Project wasn't created",
                description: 'Unknown api error happened. Try again later',
                status: 'error',
                isClosable: true
            });
        }
    );

    updateProject = createAsyncAction(
        async (form: UpdateProjectFormValues): Promise<void> => {
            const request: Parameters<typeof apiClient.api.updateProject>[1] = {};

            if ('icon' in form) {
                request.image = form.icon || null;
            }

            if ('name' in form) {
                request.name = form.name;
            }

            const response = await apiClient.api.updateProject(form.projectId, request);
            const project = mapProjectDtoToProject(response.data.project);

            const projectIndex = this.projects.findIndex(item => item.id === project.id);
            if (projectIndex !== -1) {
                this.projects.splice(projectIndex, 1, project);
            } else {
                this.projects.push(project);
            }

            if (this.selectedProject?.id === project.id) {
                this.selectedProject = project;
            }

            const { toast } = createStandaloneToast();
            toast({ title: 'Project updated successfully', status: 'success', isClosable: true });
        },
        () => {
            const { toast } = createStandaloneToast();
            toast({
                title: "Project wasn't updated",
                description: 'Unknown api error happened. Try again later',
                status: 'error',
                isClosable: true
            });
        }
    );

    deleteProject = createAsyncAction(
        async (projectId: number): Promise<void> => {
            await apiClient.api.deleteProject(projectId);

            this.projects = this.projects.filter(item => item.id !== projectId);
            if (this.selectedProject?.id === projectId) {
                this.selectedProject = this.projects[0] || null;
            }

            const { toast } = createStandaloneToast();
            toast({ title: 'Project deleted successfully', status: 'success', isClosable: true });
        },
        () => {
            const { toast } = createStandaloneToast();
            toast({
                title: "Project wasn't deleted",
                description: 'Unknown api error happened. Try again later',
                status: 'error',
                isClosable: true
            });
        }
    );
}

function mapProjectDtoToProject(projectDTO: DTOProject): Project {
    return {
        id: projectDTO.id,
        name: projectDTO.name,
        imgUrl: projectDTO.avatar,
        creationDate: new Date(projectDTO.date_create)
    };
}

export const projectsStore = new ProjectsStore();
