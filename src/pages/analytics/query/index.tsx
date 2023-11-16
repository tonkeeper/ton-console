import { ComponentProps, FunctionComponent, useEffect, useState } from 'react';
import {
    Box,
    Center,
    Flex,
    Spinner,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs
} from '@chakra-ui/react';
import { H4, Overlay, usePrevious } from 'src/shared';
import { AnalyticsQueryCode, AnalyticsQueryResults, analyticsQueryStore } from 'src/features';
import { QueryLinks } from './QueryLinks';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { projectsStore } from 'src/entities';

const QueryPage: FunctionComponent<ComponentProps<typeof Box>> = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const queryId = searchParams.get('id');
    const [queryResolved, setQueryResolved] = useState(false);

    useEffect(() => {
        if (queryId) {
            setQueryResolved(false);
            analyticsQueryStore
                .loadQueryAndRequest(queryId)
                .then(() => setQueryResolved(true))
                .catch(() => setSearchParams({}));
        } else {
            analyticsQueryStore.clear();
            setQueryResolved(true);
        }
    }, []);

    const projectId = projectsStore.selectedProject?.id;
    const prevProjectId = usePrevious(projectId);

    useEffect(() => {
        if (prevProjectId !== undefined && projectId !== prevProjectId) {
            navigate('../history');
        }
    }, [prevProjectId, projectId]);

    return (
        <Overlay display="flex" flexDirection="column">
            <H4 mb="4">New Request</H4>
            <Tabs flexDir="column" flex="1" display="flex">
                <TabList w="auto" mx="-24px" px="6">
                    <Tab>SQL</Tab>
                    <Tab isDisabled={true}>Chat GPT (coming soon)</Tab>
                </TabList>
                <TabPanels flexDir="column" flex="1" display="flex">
                    <TabPanel flexDir="column" flex="1" display="flex">
                        {queryResolved ? (
                            <>
                                <Flex gap="6" mb="6">
                                    <AnalyticsQueryCode flex="1" />
                                    <QueryLinks />
                                </Flex>
                                <AnalyticsQueryResults flex="1" />
                            </>
                        ) : (
                            <Center h="300px">
                                <Spinner />
                            </Center>
                        )}
                    </TabPanel>
                    <TabPanel />
                </TabPanels>
            </Tabs>
        </Overlay>
    );
};

export default QueryPage;
