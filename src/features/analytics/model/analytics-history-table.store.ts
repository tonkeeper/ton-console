import { makeAutoObservable, reaction } from 'mobx';
import {
    createImmediateReaction,
    Loadable,
    TonCurrencyAmount
} from 'src/shared';
import {
    getSqlHistoryFromStats,
    DTOStatsQueryResult,
    DTOStatsQueryType
} from 'src/shared/api';
import {
    AnalyticsGraphQuery,
    AnalyticsQuery,
    AnalyticsQueryType,
    AnalyticsRepeatingQueryAggregated,
    AnalyticsTablePagination
} from './interfaces';
import { projectsStore } from 'src/shared/stores';
import { mapDTOStatsSqlResultToAnalyticsQuery } from './analytics-query.store';
import { mapDTOStatsGraphResultToAnalyticsGraphQuery } from './analytics-graph-query.store';

export class AnalyticsHistoryTableStore {
    queries$ = new Loadable<
        (AnalyticsQuery | AnalyticsRepeatingQueryAggregated | AnalyticsGraphQuery)[]
    >([]);

    pagination: AnalyticsTablePagination = {
        filter: {
            onlyRepeating: false
        }
    };

    private totalQueries = 0;

    pageSize = 30;

    private disposers: Array<() => void> = [];

    get hasNextPage(): boolean {
        return this.queries$.value.length < this.totalQueries;
    }

    get tableContentLength(): number {
        return this.hasNextPage ? this.queries$.value.length + 1 : this.queries$.value.length;
    }

    constructor() {
        makeAutoObservable(this);
        let paginationDispose: (() => void) | undefined;

        const projectDispose = createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                paginationDispose?.();
                this.clearState();
                this.pagination = {
                    filter: {
                        onlyRepeating: false
                    }
                };
                this.loadFirstPage.cancelAllPendingCalls();
                this.loadNextPage.cancelAllPendingCalls();

                if (project) {
                    this.loadFirstPage();

                    paginationDispose = reaction(
                        () => JSON.stringify(this.pagination),
                        () => {
                            this.loadFirstPage({ cancelPreviousCall: true });
                        }
                    );
                    this.disposers.push(paginationDispose);
                }
            }
        );
        this.disposers.push(projectDispose);
    }

    destroy(): void {
        this.disposers.forEach(dispose => dispose?.());
        this.disposers = [];
    }

    isItemLoaded = (index: number): boolean =>
        !this.hasNextPage || index < this.queries$.value.length;

    loadFirstPage = this.queries$.createAsyncAction(
        async () => {
            this.loadNextPage.cancelAllPendingCalls();
            this.totalQueries = 0;

            const { data, error } = await getSqlHistoryFromStats({
                query: {
                    project_id: projectsStore.selectedProject!.id,
                    limit: this.pageSize,
                    offset: this.queries$.value.length,
                    ...(this.pagination.filter.onlyRepeating && { is_repetitive: true }),
                    type: mapTypeToTypeDTO(this.pagination.filter.type)
                }
            });

            if (error) throw error;
            const queries = data.items.map(mapDTOStatsResultToAnalyticsHistoryResult);

            this.totalQueries = data.count;
            return queries;
        },
        { resetBeforeExecution: true }
    );

    loadNextPage = this.queries$.createAsyncAction(async () => {
        const { data, error } = await getSqlHistoryFromStats({
            query: {
                project_id: projectsStore.selectedProject!.id,
                limit: this.pageSize,
                offset: this.queries$.value.length,
                ...(this.pagination.filter.onlyRepeating && { is_repetitive: true }),
                type: mapTypeToTypeDTO(this.pagination.filter.type)
            }
        });

        if (error) throw error;
        const queries = data.items.map(mapDTOStatsResultToAnalyticsHistoryResult);

        this.totalQueries = data.count;
        return this.queries$.value.concat(queries);
    });

    toggleFilterByType = (type: AnalyticsQueryType): void => {
        const typeActive = this.pagination.filter.type?.includes(type);
        if (typeActive) {
            this.pagination.filter.type = this.pagination.filter.type?.filter(i => i !== type);
        } else {
            this.pagination.filter.type = (this.pagination.filter.type || []).concat(type);
        }
    };

    toggleFilterByRepeating = (): void => {
        this.pagination.filter.onlyRepeating = !this.pagination.filter.onlyRepeating;
    };

    clearFilterByType = (): void => {
        this.pagination.filter.type = undefined;
    };

    clearState(): void {
        this.queries$.clear();
    }
}

function mapDTOStatsResultToAnalyticsHistoryResult(
    value: DTOStatsQueryResult
): AnalyticsQuery | AnalyticsGraphQuery | AnalyticsRepeatingQueryAggregated {
    if (value.type === 'graph') {
        return mapDTOStatsGraphResultToAnalyticsGraphQuery(value);
    }

    if ((value.total_repetitions && value.total_repetitions > 1) || value.query?.repeat_interval) {
        return mapDTOStatsQueryResultToAnalyticsQueryAggregated(value);
    }

    return mapDTOStatsSqlResultToAnalyticsQuery(value);
}

function mapDTOStatsQueryResultToAnalyticsQueryAggregated(
    value: DTOStatsQueryResult
): AnalyticsRepeatingQueryAggregated {
    return {
        lastQuery: mapDTOStatsSqlResultToAnalyticsQuery(value),
        lastQueryDate: new Date(value.last_repeat_date!),
        repeatFrequencyMs: value.query!.repeat_interval! * 1000,
        // TODO: PRICES remove this after backend will be updated
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        totalCost: new TonCurrencyAmount(value.total_cost!),
        totalRepetitions: value.total_repetitions!
    };
}

function mapTypeToTypeDTO(type: AnalyticsQueryType[] | undefined): DTOStatsQueryType[] | undefined {
    const mappingTypeToTypeDTO: Record<AnalyticsQueryType, DTOStatsQueryType> = {
        sql: DTOStatsQueryType.BASE_QUERY,
        graph: DTOStatsQueryType.GRAPH,
        gpt: DTOStatsQueryType.CHAT_GPT_QUERY
    };

    return type?.length ? type.map(v => mappingTypeToTypeDTO[v]) : undefined;
}
