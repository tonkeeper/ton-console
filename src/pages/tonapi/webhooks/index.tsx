import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { CreateWebhookModal, WebhooksTable, webhooksStore } from 'src/features/tonapi/webhooks';
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
    Badge,
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

    if (!webhooksStore.webhooks$.isResolved) {
        return (
            <Center h="300px">
                <Spinner />
            </Center>
        );
    }

    const isEmptyWebhooks = webhooksStore.webhooks$.value.length === 0;
    const WebhooksStats = webhooksStore.stats$.value;

    return (
        <>
            <Overlay h="fit-content">
                <Flex mb="3">
                    <Flex direction="column" gap={2}>
                        <Flex align="center" gap={4}>
                            <H4>Webhooks</H4>
                            <Badge
                                textStyle="label3"
                                color="accent.orange"
                                fontFamily="body"
                                bgColor={'color-mix(in srgb, currentColor 12%, transparent)'}
                            >
                                BETA
                            </Badge>

                            <Menu placement="bottom">
                                <MenuButtonDefault
                                    variant="flat"
                                    aria-label="network"
                                    rightIcon={<ArrowIcon />}
                                    textStyle="label2"
                                    color="text.secondary"
                                >
                                    <Span textTransform="capitalize">{webhooksStore.network}</Span>
                                </MenuButtonDefault>
                                <MenuList w="122px">
                                    <MenuItem
                                        gap="2"
                                        onClick={() => webhooksStore.setNetwork(Network.MAINNET)}
                                    >
                                        <Span textStyle="label2">Mainnet</Span>
                                        {webhooksStore.network === Network.MAINNET && <TickIcon />}
                                    </MenuItem>
                                    <MenuItem
                                        gap="2"
                                        onClick={() => webhooksStore.setNetwork(Network.TESTNET)}
                                    >
                                        <Span textStyle="label2">Testnet</Span>
                                        {webhooksStore.network === Network.TESTNET && <TickIcon />}
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
            <WebhookChartModal data={WebhooksStats} isOpen={isChartOpen} onClose={onChartClose} />
        </>
    );
};

export default observer(WebhooksPage);
