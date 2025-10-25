import { makeAutoObservable } from 'mobx';
import { createImmediateReaction, Loadable, TonCurrencyAmount } from 'src/shared';
import {
    getStatsChatGptPrice,
    statsChatGptRequest,
    type GetStatsChatGptPriceResponse
} from 'src/shared/api';
import { projectsStore } from 'src/shared/stores';
import { GptGenerationPricing } from 'src/features';

export class AnalyticsGPTGenerationStore {
    generatedSQL$ = new Loadable<string | null>(null);

    gptPricing$ = new Loadable<GptGenerationPricing | null>(null);

    gptPrompt = '';

    private disposers: Array<() => void> = [];

    constructor() {
        makeAutoObservable(this);

        const dispose = createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                this.gptPricing$.clear();
                this.fetchPrice.cancelAllPendingCalls();
                this.clear();

                if (project?.capabilities.stats.query) {
                    this.fetchPrice();
                }
            }
        );
        this.disposers.push(dispose);
    }

    destroy(): void {
        this.disposers.forEach(dispose => dispose?.());
        this.disposers = [];
    }

    public fetchPrice = this.gptPricing$.createAsyncAction(async () => {
        const { data, error } = await getStatsChatGptPrice({
            query: { project_id: projectsStore.selectedProject!.id }
        });
        if (error) throw error;
        return mapStatsChatGptPriceToGptGenerationPricing(data);
    });

    public generateSQL = this.generatedSQL$.createAsyncAction(
        async (message: string, context?: string) => {
            const { data, error } = await statsChatGptRequest({
                query: { project_id: projectsStore.selectedProject!.id },
                body: { message, context }
            });

            if (error) throw error;
            await this.fetchPrice();

            return data.message;
        }
    );

    public clear() {
        this.generateSQL.cancelAllPendingCalls();
        this.generatedSQL$.clear();
        this.gptPrompt = '';
    }
}

function mapStatsChatGptPriceToGptGenerationPricing(
    value: GetStatsChatGptPriceResponse
): GptGenerationPricing {
    return {
        freeRequestsNumber: value.free_requests,
        usedFreeRequest: value.used,
        // TODO: PRICES remove this after backend will be updated
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        requestPrice: value.price ? new TonCurrencyAmount(value.price) : value.usd_price
    };
}
