import { apiClient, createImmediateReaction, DTOStats, Loadable } from 'src/shared';
import { TonApiStats } from './interfaces';
import { projectsStore } from 'src/entities';
import { makeAutoObservable } from 'mobx';

class TonApiStatsStore {
    stats$ = new Loadable<TonApiStats | null>(null);

    constructor() {
        makeAutoObservable(this);

        createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                if (project) {
                    this.fetchStats();
                } else {
                    this.clearStore();
                }
            }
        );
    }

    fetchStats = this.stats$.createAsyncAction(async () => {
        const weekAgo = Math.round(Date.now() / 1000 - 3600 * 24 * 7);
        const end = Math.floor(Date.now() / 1000);
        const halfAnHourPeriod = 60 * 30;

        const response = await apiClient.api.getTonApiTokensStats({
            project_id: projectsStore.selectedProject!.id,
            start: weekAgo,
            step: halfAnHourPeriod,
            end,
            detailed: false
        });

        return mapStatsDTOToTonApiStats(response.data.stats);
    });

    clearStore(): void {
        this.stats$.clear();
    }
}

function mapStatsDTOToTonApiStats(stats: DTOStats): TonApiStats | null {
    if (!stats.result.length) {
        return null;
    }

    return {
        chart: stats.result[0].values.map(item => ({
            time: Number(item[0]) * 1000,
            requests: Math.round(Number(item[1]) * 100) / 100
        }))
    };
}

export const tonApiStatsStore = new TonApiStatsStore();
