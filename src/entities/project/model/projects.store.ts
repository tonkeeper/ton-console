import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { apiClient, DTOProject, getWindow, createReaction } from 'src/shared';
import { tGUserStore, Project } from 'src/entities';

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
