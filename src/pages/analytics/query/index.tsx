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
import { ButtonLink, ConsoleDocsIcon32, H4, Overlay, usePrevious } from 'src/shared';
import {
    ANALYTICS_LINKS,
    analyticsGPTGenerationStore,
    AnalyticsQueryCode,
    AnalyticsQueryGTPGeneration,
    AnalyticsQueryResults,
    analyticsQuerySQLRequestStore,
    analyticsQueryStore
} from 'src/features';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { projectsStore } from 'src/entities';
import { observer } from 'mobx-react-lite';

const QueryPage: FunctionComponent<ComponentProps<typeof Box>> = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const queryId = searchParams.get('id');
    const [queryResolved, setQueryResolved] = useState(false);

    useEffect(() => {
        analyticsQueryStore.fetchAllTablesSchema();
        analyticsGPTGenerationStore.clear();
    }, []);

    useEffect(() => {
        if (queryId) {
            setQueryResolved(false);
            analyticsQueryStore
                .loadQuery(queryId)
                .then(value => {
                    analyticsQuerySQLRequestStore.setRequest(value);
                    setQueryResolved(true);
                })
                .catch(() => setSearchParams({}));
        } else {
            analyticsQueryStore.clear();
            analyticsQuerySQLRequestStore.clear();
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
            {queryResolved ? (
                <Flex pos="relative" direction="column">
                    <ButtonLink
                        pos="absolute"
                        top="-13px"
                        right="0"
                        leftIcon={<ConsoleDocsIcon32 w="20px" h="20px" />}
                        size="sm"
                        variant="secondary"
                        zIndex="3"
                        href={ANALYTICS_LINKS.INTRO}
                        isExternal
                    >
                        Console Docs
                    </ButtonLink>
                    <Tabs flexDir="column" flex="1" display="flex" mb="6">
                        <TabList w="auto" mx="-24px" px="6">
                            <Tab>SQL</Tab>
                            <Tab>ChatGPT</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel flex="1">
                                <AnalyticsQueryCode flex="1" type="sql" />
                            </TabPanel>
                            <TabPanel flex="1">
                                <Box w="100%">
                                    <AnalyticsQueryGTPGeneration mb="5" />
                                    {!!analyticsGPTGenerationStore.generatedSQL$.value && (
                                        <AnalyticsQueryCode flex="1" type="gpt" />
                                    )}
                                </Box>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                    <AnalyticsQueryResults flex="1" />
                </Flex>
            ) : (
                <Center h="300px">
                    <Spinner />
                </Center>
            )}
        </Overlay>
    );
};

export default observer(QueryPage);
