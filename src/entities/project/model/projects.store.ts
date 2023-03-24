import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { apiClient, DTOProject, getWindow, createReaction, createAsyncAction } from 'src/shared';
import { Project, CreateProjectFormValues } from './interfaces';
import { tGUserStore } from 'src/entities';
import { createStandaloneToast } from '@chakra-ui/react';

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

    createProject = createAsyncAction(async (form: CreateProjectFormValues): Promise<void> => {
        const request: Parameters<typeof apiClient.api.createProject>[0] = {
            name: form.name
        };

        if (form.icon) {
            request.image = form.icon;
        }

        await apiClient.api.createProject(request);

        await this.fetchProjects();

        const { toast } = createStandaloneToast();
        toast({ title: 'Project created successfully', status: 'success', isClosable: true });
    });
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
