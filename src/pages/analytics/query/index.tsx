import { FC, useEffect, useState, useCallback } from 'react';
import {
    Box,
    BoxProps,
    Center,
    Flex,
    Menu,
    MenuItem,
    MenuList,
    Spinner,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs
} from '@chakra-ui/react';
import {
    ArrowIcon,
    ButtonLink,
    ConsoleDocsIcon32,
    DTOChain,
    H4,
    MenuButtonDefault,
    Overlay,
    Span,
    TickIcon,
    usePrevious,
    useSearchParams
} from 'src/shared';
import {
    ANALYTICS_LINKS,
    analyticsGPTGenerationStore,
    AnalyticsQueryCode,
    analyticsQueryGPTRequestStore,
    AnalyticsQueryGTPGeneration,
    AnalyticsQueryResults,
    analyticsQuerySQLRequestStore,
    analyticsQueryStore
} from 'src/features';
import { useNavigate } from 'react-router-dom';
import { projectsStore } from 'src/entities';
import { observer } from 'mobx-react-lite';

const QueryPage: FC<BoxProps> = () => {
    const navigate = useNavigate();
    const { searchParams, updateSearchParams } = useSearchParams();
    const queryId = searchParams.get('id');
    const queryType = searchParams.get('type');
    const queryNetwork = searchParams.get('network');
    const [queryResolved, setQueryResolved] = useState(false);

    useEffect(() => {
        analyticsQueryStore.fetchAllTablesSchema();
        analyticsGPTGenerationStore.clear();

        if (queryId) {
            setQueryResolved(false);
            analyticsQueryStore
                .loadQuery(queryId)
                .then(value => {
                    analyticsQuerySQLRequestStore.setRequest(value);
                    setQueryResolved(true);
                })
                .catch(() => updateSearchParams({ id: null }));
        } else {
            analyticsQueryStore.clear();
            analyticsQuerySQLRequestStore.clear();
            setQueryResolved(true);
        }
    }, []);

    const projectId = projectsStore.selectedProject?.id;
    const prevProjectId = usePrevious(projectId);
    const tabIndex = queryType === 'gpt' ? 1 : 0;

    const setTabIndex = useCallback((index: number) => {
        updateSearchParams({ type: index === 1 ? 'gpt' : 'sql' });
    }, []);

    const requestTemplateStore =
        tabIndex === 0 ? analyticsQuerySQLRequestStore : analyticsQueryGPTRequestStore;

    useEffect(() => {
        const networkString = queryNetwork ?? '';
        const typedNetwork = networkString as DTOChain;
        const validNetwork = Object.values(DTOChain).includes(typedNetwork)
            ? typedNetwork
            : DTOChain.DTOMainnet;

        requestTemplateStore.setNetwork(validNetwork);
    }, [queryNetwork, requestTemplateStore]);

    useEffect(() => {
        if (prevProjectId !== undefined && projectId !== prevProjectId) {
            navigate('../history');
        }
    }, [prevProjectId, projectId]);

    return (
        <Overlay display="flex" flexDirection="column">
            <Flex align="center" gap="3" mb="4">
                <H4>New Request</H4>
                <Menu placement="bottom">
                    <MenuButtonDefault
                        variant="flat"
                        aria-label="network"
                        rightIcon={<ArrowIcon />}
                        textStyle="label2"
                        color="text.secondary"
                    >
                        <Span textTransform="capitalize">{requestTemplateStore.network}</Span>
                    </MenuButtonDefault>
                    <MenuList w="122px">
                        <MenuItem
                            gap="2"
                            onClick={() => updateSearchParams({ network: DTOChain.DTOMainnet })}
                        >
                            <Span textStyle="label2">Mainnet</Span>
                            {requestTemplateStore.network === DTOChain.DTOMainnet && <TickIcon />}
                        </MenuItem>
                        <MenuItem
                            gap="2"
                            onClick={() => updateSearchParams({ network: DTOChain.DTOTestnet })}
                        >
                            <Span textStyle="label2">Testnet</Span>
                            {requestTemplateStore.network === DTOChain.DTOTestnet && <TickIcon />}
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
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
                    <Tabs
                        flexDir="column"
                        flex="1"
                        display="flex"
                        mb="6"
                        index={tabIndex}
                        onChange={setTabIndex}
                    >
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
