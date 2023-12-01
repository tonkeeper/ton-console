import { makeAutoObservable } from 'mobx';
import { apiClient, Loadable } from 'src/shared';
import { projectsStore } from 'src/entities';

class AnalyticsGPTGenerationStore {
    generatedSQL$ = new Loadable<string | null>(null);

    constructor() {
        makeAutoObservable(this);
    }

    public generateSQL = this.generatedSQL$.createAsyncAction(
        async (message: string, context?: string) => {
            const result = await apiClient.api.statsChatGptRequest(
                {
                    project_id: projectsStore.selectedProject!.id
                },
                { message, context }
            );

            return result.data.message;
        }
    );

    public clear() {
        this.generateSQL.cancelAllPendingCalls();
        this.generatedSQL$.clear();
    }
}

export const analyticsGPTGenerationStore = new AnalyticsGPTGenerationStore();
