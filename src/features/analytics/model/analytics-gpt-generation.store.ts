import { makeAutoObservable } from 'mobx';
import { apiClient, Loadable } from 'src/shared';
import { projectsStore } from 'src/entities';

class AnalyticsGPTGenerationStore {
    generatedSQL$ = new Loadable<string | null>(null);

    constructor() {
        makeAutoObservable(this);
    }

    public generateSQL = this.generatedSQL$.createAsyncAction(async (message: string) => {
        const result = await apiClient.api.statsChatGptRequest(
            {
                project_id: projectsStore.selectedProject!.id
            },
            { message }
        );

        return result.data.message;
    });
}

export const analyticsGPTGenerationStore = new AnalyticsGPTGenerationStore();
