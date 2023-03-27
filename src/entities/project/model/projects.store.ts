import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { apiClient, DTOProject, getWindow, createReaction, createAsyncAction } from 'src/shared';
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
            properties: ['projects', 'selectedProject'],
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
                request.image = form.icon || undefined; // TODO value to delete
            }

            if ('name' in form) {
                request.name = form.name;
            }

            await apiClient.api.updateProject(form.projectId, request);

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

    deleteProject = createAsyncAction(
        async (projectId: number): Promise<void> => {
            console.log(projectId);
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
