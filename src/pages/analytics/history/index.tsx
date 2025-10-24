import { FC, useEffect } from 'react';
import { Box, BoxProps, Button, Flex } from '@chakra-ui/react';
import { H4, Overlay } from 'src/shared';
import {
    AnalyticsHistoryTable,
    analyticsHistoryTableStore,
    FilterQueryByRepetition,
    FilterQueryByType
} from 'src/features';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
// import { projectsStore } from 'src/shared/stores';

const HistoryPage: FC<BoxProps> = () => {
    useEffect(() => {
        analyticsHistoryTableStore.loadFirstPage();
    }, []);

    // const queryAllowed = projectsStore.selectedProject?.capabilities.stats.query;

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
                <FilterQueryByType />
                <FilterQueryByRepetition />
            </Flex>
            <AnalyticsHistoryTable flex="1" />
        </Overlay>
    );
};

export default observer(HistoryPage);
