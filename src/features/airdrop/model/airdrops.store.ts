import { createImmediateReaction, Loadable } from 'src/shared';
import { getJettonAirdrops, DTOJettonAirdrop } from 'src/shared/api';
import { ADConfig, airdropApiClient } from 'src/shared/api/airdrop-api';
import { makeAutoObservable } from 'mobx';
import { Project } from 'src/entities';

export class AirdropsStore {
    airdrops$ = new Loadable<DTOJettonAirdrop[]>([]);

    config$ = new Loadable<ADConfig | null>(null);

    private projectId: number;

    constructor(private readonly project: Project) {
        makeAutoObservable(this);

        if (!project) throw new Error('Project is not selected');
        this.projectId = project.id;

        createImmediateReaction(
            () => this.project,
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

    fetchAirdrops = this.airdrops$.createAsyncAction(async () => {
        const { data, error } = await getJettonAirdrops({
            query: { project_id: this.projectId }
        });
        if (error) throw error;
        return data.airdrops;
    });

    fetchConfig = this.config$.createAsyncAction(() =>
        airdropApiClient.v2.getConfig({ project_id: `${this.projectId}` }).then(({ data }) => data)
    );

    clearStore() {
        this.airdrops$.clear();
    }
}
