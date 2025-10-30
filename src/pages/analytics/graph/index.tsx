import { FC, useCallback, useEffect, useState } from 'react';
import { useLocalObservable } from 'mobx-react-lite';
import { BoxProps, Center, Spinner } from '@chakra-ui/react';
import { Overlay, useIntervalUpdate, usePrevious } from 'src/shared';
import { AnalyticsGraphQueryStore } from 'src/features';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GraphSuccess } from './GraphSuccess';
import { GraphError } from './GraphError';
import { GraphHome } from './GraphHome';
import { useProject } from 'src/shared/contexts/ProjectIdContext';

const GraphPage: FC<BoxProps> = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const queryId = searchParams.get('id');
    const project = useProject();
    const [queryResolved, setQueryResolved] = useState(false);

    const analyticsGraphQueryStore = useLocalObservable(
        () => new AnalyticsGraphQueryStore(project)
    );

    useEffect(() => {
        if (queryId) {
            if (queryId !== analyticsGraphQueryStore.query$.value?.id) {
                setQueryResolved(false);
                analyticsGraphQueryStore
                    .loadQuery(queryId)
                    .then(() => setQueryResolved(true))
                    .catch(() => setSearchParams({}));
            } else {
                setQueryResolved(true);
            }
        } else {
            setQueryResolved(true);
            analyticsGraphQueryStore.clear();
        }
    }, [queryId]);

    const projectId = project?.id;
    const prevProjectId = usePrevious(projectId);

    useEffect(() => {
        if (prevProjectId !== undefined && projectId !== prevProjectId) {
            navigate('../history');
        }
    }, [prevProjectId, projectId]);

    const query = analyticsGraphQueryStore.query$.value;
    const callback = useCallback(() => {
        if (query?.status === 'executing') {
            analyticsGraphQueryStore.refetchQuery();
        }
    }, [query?.status, analyticsGraphQueryStore]);
    useIntervalUpdate(callback, 1000);

    useEffect(() => {
        return () => {
            analyticsGraphQueryStore.destroy();
        };
    }, [analyticsGraphQueryStore]);

    if (!queryResolved) {
        return (
            <Overlay>
                <Center h="300px">
                    <Spinner />
                </Center>
            </Overlay>
        );
    }

    if (query?.status === 'success') {
        return <GraphSuccess query={query} />;
    }

    if (query?.status === 'error') {
        return <GraphError query={query} />;
    }

    return <GraphHome analyticsGraphQueryStore={analyticsGraphQueryStore} />;
};

export default GraphPage;
