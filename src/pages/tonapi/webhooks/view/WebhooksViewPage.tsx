import { FC, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { SubscriptionsTable, useWebhooksUI, useWebhooksQuery, useWebhookSubscriptionsQuery, useBackWebhookToOnlineMutation } from 'src/features/tonapi/webhooks';
import { EmptySubscriptions } from './EmptySubscriptions';
import { EXTERNAL_LINKS, H4, Overlay, useSearchParams } from 'src/shared';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Button,
    Center,
    Spinner,
    useDisclosure,
    Flex,
    Link,
    Text,
    Box,
    Divider
} from '@chakra-ui/react';
import AddSubscriptionsModal from 'src/features/tonapi/webhooks/ui/AddSubscriptionsModal';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronRightIcon16 } from 'src/shared/ui/icons/ChevronRightIcon16';
import { StatsCard } from 'src/entities/stats/Card';
import StatusIndicator from 'src/shared/ui/StatusIndicator';
import { RTWebhookListStatusEnum } from 'src/shared/api/streaming-api';

/**
 * Safe parse webhookId from URL params
 * Returns null if invalid, prevents NaN issues
 */
function parseWebhookId(webhookIdStr: string | null): number | null {
    if (!webhookIdStr) return null;
    const parsed = parseInt(webhookIdStr);
    return isNaN(parsed) ? null : parsed;
}

const WebhooksViewPage: FC = () => {
    const { searchParams } = useSearchParams();
    const webhookId = searchParams.get('webhookId');
    const webhookIdNum = parseWebhookId(webhookId);

    const { setSelectedWebhookId, network } = useWebhooksUI();
    const { data: webhooks = [] } = useWebhooksQuery(network);
    const { data: subscriptions = [], isLoading: subscriptionsLoading } = useWebhookSubscriptionsQuery(webhookIdNum, 1);
    const { mutate: backToOnline, isPending: isBackToOnlinePending } = useBackWebhookToOnlineMutation(network);

    const selectedWebhook = webhookIdNum ? webhooks.find(w => w.id === webhookIdNum) : null;

    useEffect(() => {
        if (webhookIdNum) {
            setSelectedWebhookId(webhookIdNum);
        }

        return () => {
            setSelectedWebhookId(null);
        };
    }, [webhookIdNum, setSelectedWebhookId]);

    const { isOpen, onOpen, onClose } = useDisclosure();

    // If URL has invalid webhookId, redirect to main webhooks page
    if (webhookId && !webhookIdNum) {
        return <Navigate to="/tonapi/webhooks" replace />;
    }

    if (!selectedWebhook || subscriptionsLoading) {
        return (
            <Center h="300px">
                <Spinner />
            </Center>
        );
    }

    const breadcrumb = (
        <Breadcrumb
            mb="3"
            color="text.secondary"
            fontSize={14}
            fontWeight={700}
            separator={<ChevronRightIcon16 color="text.secondary" />}
            spacing="8px"
        >
            <BreadcrumbItem>
                <BreadcrumbLink as={RouterLink} to={'/tonapi/webhooks'}>
                    Webhooks
                </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem color="text.primary" isCurrentPage>
                <BreadcrumbLink href={'#'}>{selectedWebhook.endpoint}</BreadcrumbLink>
            </BreadcrumbItem>
        </Breadcrumb>
    );

    const isEmpty = subscriptions.length === 0;

    const isOnline = selectedWebhook.status === RTWebhookListStatusEnum.RTOnline;

    return (
        <>
            <Overlay breadcrumbs={breadcrumb} h="fit-content">
                <Flex mb="4">
                    <Flex direction="column" gap={2}>
                        <Flex align="center" gap={4}>
                            <H4>Webhook Subscriptions</H4>
                        </Flex>
                        <Flex>
                            <Text textStyle="text.body2" color="text.secondary" fontSize={14}>
                                More webhook options can be explored through the API. For details,
                                see{' '}
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

                    {!isEmpty && (
                        <Button mb="4" ml="auto" onClick={onOpen}>
                            Add Subscription
                        </Button>
                    )}
                </Flex>

                {isEmpty ? (
                    <EmptySubscriptions onOpenCreate={onOpen} />
                ) : (
                    <>
                        <Divider mb="4" />

                        <Box mb={4}>
                            <Flex align="center" justify="space-between" gap={4}>
                                <H4>Status</H4>
                                <Flex gap="3">
                                    <StatusIndicator isOnline={isOnline} label />
                                    {!isOnline && (
                                        <Button
                                            isLoading={isBackToOnlinePending}
                                            onClick={() =>
                                                selectedWebhook &&
                                                backToOnline(selectedWebhook.id)
                                            }
                                            size={'sm'}
                                        >
                                            Try Online
                                        </Button>
                                    )}
                                </Flex>
                            </Flex>
                            <Flex
                                wrap={{
                                    base: 'wrap',
                                    lg: 'nowrap'
                                }}
                                gap="6"
                                mt={2}
                                mb={4}
                            >
                                <StatsCard
                                    header="Total of Accounts"
                                    value={selectedWebhook.subscribed_accounts}
                                />
                                <StatsCard
                                    header="Total of Opcodes"
                                    value={selectedWebhook.subscribed_msg_opcodes}
                                />
                                <StatsCard
                                    header="Failed Attempts"
                                    value={selectedWebhook.status_failed_attempts}
                                />

                                <Flex direction="column" ml="auto" fontSize="14px">
                                    <Text
                                        textStyle="text.body2"
                                        align="end"
                                        textColor="text.secondary"
                                    >
                                        Last online at:{' '}
                                        {selectedWebhook.last_online_at}
                                    </Text>
                                    <Text
                                        textStyle="text.body2"
                                        align="end"
                                        textColor="text.secondary"
                                    >
                                        Status updated at:{' '}
                                        {selectedWebhook.status_updated_at}
                                    </Text>
                                    <Text textStyle="text.body2" align="end" mt="1">
                                        Subscribed to Mempool:{' '}
                                        {selectedWebhook.subscribed_to_mempool
                                            ? 'Yes'
                                            : 'No'}
                                    </Text>
                                    <Text textStyle="text.body2" align="end">
                                        Subscribed to New Contracts:{' '}
                                        {selectedWebhook.subscribed_to_new_contracts
                                            ? 'Yes'
                                            : 'No'}
                                    </Text>
                                </Flex>
                                {/* <StatsCard
                                    ml={{
                                        base: '0',
                                        lg: 'auto'
                                    }}
                                    header="Subscribed to Mempool"
                                    value={
                                        webhooksStore.selectedWebhook.subscribed_to_mempool
                                            ? 'Yes'
                                            : 'No'
                                    }
                                />
                                <StatsCard
                                    header="Subscribed to New Contracts"
                                    value={
                                        webhooksStore.selectedWebhook.subscribed_to_new_contracts
                                            ? 'Yes'
                                            : 'No'
                                    }
                                /> */}
                            </Flex>
                        </Box>

                        <Divider mb="4" />

                        <H4>Subscribed opcodes</H4>
                        <Text textStyle="text.body2" mt="3" color="text.secondary" fontSize={14}>
                            To get the list of opcodes or subscribing to specific opcodes, refer to
                            the API methods described{' '}
                            <Link
                                color="accent.blue"
                                href="https://docs.tonconsole.com/tonapi/webhooks-api"
                                isExternal
                            >
                                here
                            </Link>
                        </Text>

                        <Divider my="4" />

                        <H4>Subscribed accounts</H4>
                        <SubscriptionsTable mt="3" />
                    </>
                )}
            </Overlay>
            <AddSubscriptionsModal isOpen={isOpen} onClose={onClose} />
        </>
    );
};

export default WebhooksViewPage;
