import { ComponentProps, FunctionComponent, useCallback, useEffect, useState } from 'react';
import { Box, Center, Spinner } from '@chakra-ui/react';
import { Overlay, useIntervalUpdate } from 'src/shared';
import { analyticsGraphQueryStore } from 'src/features';
import { useSearchParams } from 'react-router-dom';
import { GraphSuccess } from './GraphSuccess';
import { GraphError } from './GraphError';
import { GraphHome } from './GraphHome';
import { observer } from 'mobx-react-lite';

const GraphPage: FunctionComponent<ComponentProps<typeof Box>> = () => {
    const [searchParams] = useSearchParams();
    const queryId = searchParams.get('id');
    const [queryResolved, setQueryResolved] = useState(false);

    useEffect(() => {
        if (queryId) {
            setQueryResolved(false);
            analyticsGraphQueryStore.loadQuery(queryId).then(() => setQueryResolved(true));
        } else {
            setQueryResolved(true);
            analyticsGraphQueryStore.clear();
        }
    }, [queryId]);

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
