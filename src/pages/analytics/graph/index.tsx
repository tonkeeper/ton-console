import { FC, useCallback, useEffect, useState } from 'react';
import { Box, BoxProps, Center, Spinner } from '@chakra-ui/react';
import { Overlay, useIntervalUpdate, usePrevious } from 'src/shared';
import { analyticsGraphQueryStore } from 'src/features';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GraphSuccess } from './GraphSuccess';
import { GraphError } from './GraphError';
import { GraphHome } from './GraphHome';
import { observer } from 'mobx-react-lite';
import { projectsStore } from 'src/shared/stores';

const GraphPage: FC<BoxProps> = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const queryId = searchParams.get('id');
    const [queryResolved, setQueryResolved] = useState(false);

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

    const projectId = projectsStore.selectedProject?.id;
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
    }, [query?.status]);
    useIntervalUpdate(callback, 1000);

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

    return <GraphHome />;
};

export default observer(GraphPage);
