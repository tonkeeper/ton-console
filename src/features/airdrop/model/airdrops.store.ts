import { apiClient, createImmediateReaction, DTOJettonAirdrop, Loadable } from 'src/shared';
import { ADConfig, airdropApiClient } from 'src/shared/api/airdrop-api';
import { makeAutoObservable } from 'mobx';
import { projectsStore } from 'src/shared/stores';

export class AirdropsStore {
    airdrops$ = new Loadable<DTOJettonAirdrop[]>([]);

    config$ = new Loadable<ADConfig | null>(null);

    private projectId: number;

    constructor() {
        makeAutoObservable(this);

        if (!projectsStore.selectedProject) throw new Error('Project is not selected');
        this.projectId = projectsStore.selectedProject.id;

        createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                this.clearStore();

                if (!project) throw new Error('Project is not selected');
                this.projectId = project.id;

                this.fetchConfig();
                this.fetchAirdrops();
            }
        );

        this.fetchConfig();
        this.fetchAirdrops();
    }

    fetchAirdrops = this.airdrops$.createAsyncAction(() =>
        apiClient.api
            .getJettonAirdrops({ project_id: this.projectId })
            .then(({ data }) => data.airdrops)
    );

    fetchConfig = this.config$.createAsyncAction(() =>
        airdropApiClient.v2.getConfig({ project_id: `${this.projectId}` }).then(({ data }) => data)
    );

    clearStore() {
        this.airdrops$.clear();
    }
}
