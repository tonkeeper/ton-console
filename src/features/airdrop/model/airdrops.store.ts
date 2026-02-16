import { Loadable } from 'src/shared';
import { getJettonAirdrops, DTOJettonAirdrop } from 'src/shared/api';
import { ADConfig, airdropApiClient } from 'src/shared/api/airdrop-api';
import { makeAutoObservable } from 'mobx';
import { Project } from 'src/entities';

export class AirdropsStore {
    airdrops$ = new Loadable<DTOJettonAirdrop[]>([]);

    config$ = new Loadable<ADConfig | null>(null);

    constructor(private readonly project: Project) {
        makeAutoObservable(this);

        if (!project) throw new Error('Project is not selected');

        this.fetchConfig();
        this.fetchAirdrops();
    }

    fetchAirdrops = this.airdrops$.createAsyncAction(async () => {
        const { data, error } = await getJettonAirdrops({
            query: { project_id: this.project.id }
        });
        if (error) throw error;
        return data.airdrops;
    });

    fetchConfig = this.config$.createAsyncAction(() =>
        airdropApiClient.v2.getConfig({ project_id: `${this.project.id}` }).then(({ data }) => data)
    );

    clearStore() {
        this.airdrops$.clear();
    }
}
