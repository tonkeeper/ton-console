import { FC } from 'react';
import { CreateWebhookModal, WebhooksTable, useWebhooksUI, useWebhooksQuery, useWebhooksStatsQuery } from 'src/features/tonapi/webhooks';
import { EmptyWebhooks } from './EmptyWebhooks';
import {
    ArrowIcon,
    EXTERNAL_LINKS,
    H4,
    MenuButtonDefault,
    Network,
    Overlay,
    Span,
    TickIcon
} from 'src/shared';
import {
    Button,
    Center,
    Flex,
    Spinner,
    useDisclosure,
    Text,
    Link,
    Menu,
    MenuItem,
    MenuList,
    Box
} from '@chakra-ui/react';
import WebhookChartModal from './ChatrWebhooks';

const WebhooksPage: FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isChartOpen, onOpen: onChartOpen, onClose: onChartClose } = useDisclosure();
    const { network, setNetwork } = useWebhooksUI();
    const { data: webhooks = [], isLoading } = useWebhooksQuery(network);
    const { data: WebhooksStats = null } = useWebhooksStatsQuery();

    if (isLoading) {
        return (
            <Center h="300px">
                <Spinner />
            </Center>
        );
    }

    const isEmptyWebhooks = webhooks.length === 0;

    return (
        <>
            <Overlay h="fit-content">
                <Flex mb="3">
                    <Flex direction="column" gap={2}>
                        <Flex align="center" gap={4}>
                            <H4>Webhooks</H4>

                            <Menu placement="bottom">
                                <MenuButtonDefault
                                    variant="flat"
                                    aria-label="network"
                                    rightIcon={<ArrowIcon />}
                                    textStyle="label2"
                                    color="text.secondary"
                                >
                                    <Span textTransform="capitalize">{network}</Span>
                                </MenuButtonDefault>
                                <MenuList w="122px">
                                    <MenuItem
                                        gap="2"
                                        onClick={() => setNetwork(Network.MAINNET)}
                                    >
                                        <Span textStyle="label2">Mainnet</Span>
                                        {network === Network.MAINNET && <TickIcon />}
                                    </MenuItem>
                                    <MenuItem
                                        gap="2"
                                        onClick={() => setNetwork(Network.TESTNET)}
                                    >
                                        <Span textStyle="label2">Testnet</Span>
                                        {network === Network.TESTNET && <TickIcon />}
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </Flex>
                        <Flex>
                            <Text textStyle="text.body2" color="text.secondary" fontSize={14}>
                                Webhooks are available via the API. For details, see{' '}
                                <Link
                                    color="accent.blue"
                                    href={EXTERNAL_LINKS.DOCUMENTATION_WEBHOOKS}
                                    isExternal
                                >
                                    Webhooks documentation
                                </Link>
                            </Text>
                        </Flex>
                    </Flex>

                    {!isEmptyWebhooks && (
                        <Button mb="6" ml="auto" onClick={onOpen}>
                            Add Webhook
                        </Button>
                    )}
                </Flex>
                {isEmptyWebhooks ? (
                    <EmptyWebhooks onOpenCreate={onOpen} />
                ) : (
                    <>
                        <Box mb={4}>
                            <Button onClick={onChartOpen} variant="secondary">
                                Statistics
                            </Button>

                            {/* <H4>Statistics</H4>
                            <Flex gap="6" mt={2} mb={4}>
                                <Button onClick={onChartOpen}>Statistics</Button>
                                <StatsCard
                                    onClick={onChartOpen}
                                    header="Delivered events"
                                    value={'101'}
                                />
                                <StatsCard onClick={onChartOpen} header="Failed sent" value={'0'} />
                            </Flex> */}
                        </Box>
                        <WebhooksTable />
                    </>
                )}
            </Overlay>
            <CreateWebhookModal isOpen={isOpen} onClose={onClose} />
            <WebhookChartModal data={WebhooksStats as any} isOpen={isChartOpen} onClose={onChartClose} />  {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
        </>
    );
};

export default WebhooksPage;
