import { apiClient, createImmediateReaction, DTOLiteproxyKey, Loadable } from 'src/shared';
import { projectsStore } from 'src/entities';
import { makeAutoObservable } from 'mobx';

class LiteproxysStore {
    liteproxyList$ = new Loadable<DTOLiteproxyKey[]>([]);

    constructor() {
        makeAutoObservable(this);

        createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                this.clearStore();

                if (project) {
                    this.fetchLiteproxyList();
                    this.fetchLiteproxyTiers();
                }
            }
        );
    }

    fetchLiteproxyList = this.liteproxyList$.createAsyncAction(() =>
        apiClient.api
            .getLiteproxyKeys({ project_id: projectsStore.selectedProject!.id })
            .then(({ data }) => data.keys)
            .catch(({ response }) => {
                console.log(response);

                if (response.data.error === 'keys not found') {
                    return [];
                }

                throw Error(response);
            })
    );

    createLiteproxy = this.liteproxyList$.createAsyncAction(
        () =>
            apiClient.api
                .createLiteproxyKeys({ project_id: projectsStore.selectedProject!.id })
                .then(({ data }) => data.keys),
        {
            successToast: {
                title: 'Api key has been created successfully'
            },
            errorToast: {
                title: "Api key wasn't created"
            }
        }
    );

    // editLiteproxy = this.liteproxyList$.createAsyncAction(
    //     async ({ id, name, limitRps, origins, capabilities }: EditLiteproxyForm) => {
    //         await apiClient.api.updateProjectTonApiToken(
    //             id,
    //             { project_id: projectsStore.selectedProject!.id },
    //             { name, limit_rps: limitRps, origins, capabilities }
    //         );

    //         const key = this.liteproxyList$.value.find(item => item.id === id);

    //         if (key) {
    //             key.name = name;
    //             key.limitRps = limitRps;
    //             key.origins = origins;
    //             key.capabilities = capabilities;
    //         }
    //     },
    //     {
    //         successToast: {
    //             title: 'Api key has been modified successfully'
    //         },
    //         errorToast: {
    //             title: "Api key wasn't modified"
    //         }
    //     }
    // );

    // deleteLiteproxy = this.liteproxyList$.createAsyncAction(
    //     async (id: number) => {
    //         await apiClient.api.deleteProjectTonApiToken(id, {
    //             project_id: projectsStore.selectedProject!.id
    //         });

    //         return this.liteproxyList$.value.filter(item => item.id !== id);
    //     },
    //     {
    //         successToast: {
    //             title: 'Api key has been deleted successfully'
    //         },
    //         errorToast: {
    //             title: "Api key wasn't deleted"
    //         }
    //     }
    // );

    clearStore(): void {
        this.liteproxyList$.clear();
        this.liteproxyTier$.clear();
    }
}

export const liteproxysStore = new LiteproxysStore();
