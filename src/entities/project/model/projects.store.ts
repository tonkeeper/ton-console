import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import {
    createImmediateReaction,
    deserializeState,
    getWindow,
    Loadable,
    replaceIfNotEqual,
    serializeState,
    toColor
} from 'src/shared';
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
} from './interfaces';
import { userStore } from 'src/shared/stores';

export class ProjectsStore {
    projects$ = new Loadable<Project[]>([]);

    projectParticipants$ = new Loadable<DTOParticipant[]>([]);

    private selectedProjectId: number | null = null;

    get selectedProject(): Project | null {
        if (this.selectedProjectId == null) {
            return null;
        }

        return (
            this.projects$.value.find(project => project.id === this.selectedProjectId) ||
            this.projects$.value[0] ||
            null
        );
    }

    constructor() {
        makeAutoObservable(this);

        makePersistable(this, {
            name: 'SelectedProject',
            properties: [
                {
                    key: 'selectedProjectId',
                    serialize: serializeState,
                    deserialize: deserializeState
                } as unknown as keyof this
            ],
            storage: getWindow()!.localStorage
        }).then(() => {
            createImmediateReaction(
                () => userStore.user$.value,
                async user => {
                    if (user) {
                        await this.fetchProjects();

                        if (this.selectedProjectId == null && this.projects$.value.length) {
                            this.selectProject(this.projects$.value[0].id);
                        }
                    } else {
                        this.clearState();
                    }
                }
            );
        });
    }

    fetchProjects = this.projects$.createAsyncAction(async () => {
        const { data, error } = await getProjects();

        if (error) throw error;

        data.items.map(mapProjectDtoToProject).forEach(project => {
            const existingProject = this.projects$.value.find(item => item.id === project.id);
            if (existingProject) {
                replaceIfNotEqual(existingProject, 'name', project.name);
                replaceIfNotEqual(existingProject, 'imgUrl', project.imgUrl);
                replaceIfNotEqual(
                    existingProject,
                    'fallbackBackground',
                    project.fallbackBackground
                );
                replaceIfNotEqual(
                    existingProject,
                    'creationDate',
                    project.creationDate,
                    (a, b) => a.getTime() === b.getTime()
                );
            } else {
                this.projects$.value.push(project);
            }
        });
    });

    selectProject = (id: number | null): void => {
        this.selectedProjectId = id;
    };

    private clearState = (): void => {
        this.projects$.clear();
        this.selectedProjectId = null;
    };

    createProject = this.projects$.createAsyncAction(
        async (form: ProjectFormValues) => {
            const { data, error } = await createProject({
                body: {
                    name: form.name,
                    ...(form.icon && { image: form.icon })
                }
            });

            if (error) throw error;

            const project = mapProjectDtoToProject(data.project);
            this.projects$.value = this.projects$.value.concat(project);
            this.selectedProjectId = project.id;
        },
        {
            successToast: {
                title: 'Project created successfully'
            },
            errorToast: {
                title: "Project wasn't created"
            }
        }
    );

    updateProject = this.projects$.createAsyncAction(
        async (form: UpdateProjectFormValues): Promise<void> => {
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

            const project = mapProjectDtoToProject(data.project);

            const projectIndex = this.projects$.value.findIndex(item => item.id === project.id);
            if (projectIndex !== -1) {
                this.projects$.value[projectIndex] = project;
            } else {
                this.projects$.value.push(project);
            }
        },
        {
            successToast: {
                title: 'Project updated successfully'
            },
            errorToast: {
                title: "Project wasn't updated"
            }
        }
    );

    deleteProject = this.projects$.createAsyncAction(
        async (projectId: number) => {
            const { error } = await deleteProject({
                path: { id: projectId }
            });

            if (error) throw error;

            const newSelectedProjectId = this.projects$.value[0]?.id ?? null;
            this.selectProject(newSelectedProjectId);

            return this.projects$.value.filter(item => item.id !== projectId);
        },
        {
            successToast: {
                title: 'Project deleted successfully'
            },
            errorToast: {
                title: "Project wasn't deleted"
            }
        }
    );

    fetchProjectParticipants = this.projectParticipants$.createAsyncAction(async () => {
        if (!this.selectedProjectId) {
            return [];
        }

        const currentUserId = userStore.user$.value?.id;
        const { data, error } = await getProjectParticipants({
            path: { id: this.selectedProjectId }
        });

        if (error) throw error;

        return data.items.filter(item => item.id !== currentUserId);
    });

    addProjectParticipant = this.projectParticipants$.createAsyncAction(
        async (form: AddProjectParticipantFormValues) => {
            if (!this.selectedProjectId) {
                return;
            }

            const { data, error } = await addProjectParticipant({
                path: { id: this.selectedProjectId },
                body: { user_id: form.userId }
            });

            if (error) throw error;

            return this.projectParticipants$.value.concat(data.participant);
        },
        {
            successToast: {
                title: 'User added successfully'
            },
            errorToast: {
                title: "User wasn't added"
            }
        }
    );

    deleteProjectParticipant = this.projectParticipants$.createAsyncAction(
        async (participantId: number) => {
            if (!this.selectedProjectId) {
                return;
            }

            const { error } = await deleteProjectParticipant({
                path: {
                    id: this.selectedProjectId,
                    user_id: participantId
                }
            });

            if (error) throw error;

            return this.projectParticipants$.value.filter(item => item.id !== participantId);
        },
        {
            successToast: {
                title: 'User deleted successfully'
            },
            errorToast: {
                title: "User wasn't deleted"
            }
        }
    );
}

function mapProjectDtoToProject(projectDTO: DTOProject): Project {
    return {
        id: projectDTO.id,
        name: projectDTO.name,
        imgUrl: projectDTO.avatar,
        creationDate: new Date(projectDTO.date_create),
        fallbackBackground: gradient(toColor(Math.abs(projectDTO.id ^ 255), { min: 30, max: 215 })),
        capabilities: {
            invoices: projectDTO.capabilities.includes('invoices'),
            stats: { query: projectDTO.capabilities.includes('stats') }
        }
    };
}

function gradient(color: string): string {
    return `linear-gradient(27.61deg, ${color} -4.58%, ${color}60 107.4%)`;
}
