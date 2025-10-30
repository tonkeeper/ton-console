import { FC, useEffect } from 'react';
import { useLocalObservable } from 'mobx-react-lite';
import { BoxProps, Button, Flex } from '@chakra-ui/react';
import { H4, Overlay } from 'src/shared';
import {
    AnalyticsHistoryTable,
    AnalyticsHistoryTableStore,
    FilterQueryByRepetition,
    FilterQueryByType
} from 'src/features';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useProject } from 'src/shared/contexts/ProjectIdContext';

const HistoryPage: FC<BoxProps> = () => {
    const project = useProject();
    const analyticsHistoryTableStore = useLocalObservable(
        () => new AnalyticsHistoryTableStore(project)
    );

    useEffect(() => {
        analyticsHistoryTableStore.loadFirstPage();
    }, [analyticsHistoryTableStore]);

    useEffect(() => {
        return () => {
            analyticsHistoryTableStore.destroy();
        };
    }, [analyticsHistoryTableStore]);

    return (
        <Overlay display="flex" flexDirection="column">
            <Flex align="flex-start" justify="space-between" gap="3" mb="5">
                <H4>History</H4>
                <Button as={Link} ml="auto" to={'../query'} variant="secondary">
                    New Query
                </Button>
                <Button as={Link} to={'../graph'} variant="secondary">
                    New Graph
                </Button>
            </Flex>
            <Flex align="center" gap="4" mb="6">
                <FilterQueryByType analyticsHistoryTableStore={analyticsHistoryTableStore} />
                <FilterQueryByRepetition analyticsHistoryTableStore={analyticsHistoryTableStore} />
            </Flex>
            <AnalyticsHistoryTable
                flex="1"
                analyticsHistoryTableStore={analyticsHistoryTableStore}
            />
        </Overlay>
    );
};

export default observer(HistoryPage);
