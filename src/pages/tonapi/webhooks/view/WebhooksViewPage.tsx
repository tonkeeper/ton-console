import { FC, useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { SubscriptionsTable, useWebhooksUI, useWebhooksQuery, useWebhookSubscriptionsQuery, useBackWebhookToOnlineMutation, WebhookSuspendedModal, getWebhookStatusLabel, getWebhookStatusVariant } from 'src/features/tonapi/webhooks';
import { RefillModal } from 'src/entities';
import { EmptySubscriptions } from './EmptySubscriptions';
import { EXTERNAL_LINKS, H4, Network, Overlay, useSearchParams } from 'src/shared';
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
import { useProjectId } from 'src/shared/contexts/ProjectContext';

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
    const navigate = useNavigate();
    const currentProjectId = useProjectId();
    const initialProjectIdRef = useRef(currentProjectId);

    const webhooksListPath = network === Network.TESTNET
        ? '/tonapi/webhooks?network=testnet'
        : '/tonapi/webhooks';

    useEffect(() => {
        if (currentProjectId !== initialProjectIdRef.current) {
            navigate(webhooksListPath, { replace: true });
        }
    }, [currentProjectId, navigate, webhooksListPath]);

    const { data: webhooks = [], isLoading: webhooksLoading } = useWebhooksQuery(network);
    const { data: subscriptions = [], isLoading: subscriptionsLoading } = useWebhookSubscriptionsQuery(webhookIdNum, network, 1);
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
    const { isOpen: isSuspendedOpen, onOpen: onSuspendedOpen, onClose: onSuspendedClose } = useDisclosure();
    const { isOpen: isRefillOpen, onOpen: onRefillOpen, onClose: onRefillClose } = useDisclosure();

    // If URL has invalid webhookId, redirect to main webhooks page
    if (webhookId && !webhookIdNum) {
        return <Navigate to={webhooksListPath} replace />;
    }

    if (webhooksLoading || subscriptionsLoading) {
        return (
            <Center h="300px">
                <Spinner />
            </Center>
        );
    }

    if (!selectedWebhook) {
        return (
            <Overlay h="fit-content">
                <Center py="16">
                    <Box
                        w="100%"
                        maxW="460px"
                        p="6"
                        bg="background.contentTint"
                        border="1px solid"
                        borderColor="background.contentTint"
                        borderRadius="sm"
                    >
                        <H4 mb="4">Webhook #{webhookIdNum} Not Found</H4>
                        <Text mb="2" color="text.secondary" fontSize="14px">
                            Possible reasons:
                        </Text>
                        <Flex as="ul" direction="column" gap="1" pl="5" color="text.secondary" fontSize="14px">
                            <li>The webhook belongs to a different project</li>
                            <li>
                                It&apos;s on a different network (
                                {network === 'mainnet' ? 'try testnet' : 'try mainnet'})
                            </li>
                            <li>The webhook has been deleted</li>
                            <li>The link is outdated or incorrect</li>
                        </Flex>
                        <Center mt="6">
                            <Button as={RouterLink} to={webhooksListPath}>
                                Back to Webhooks
                            </Button>
                        </Center>
                    </Box>
                </Center>
            </Overlay>
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
                <BreadcrumbLink as={RouterLink} to={webhooksListPath}>
                    Webhooks
                </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem color="text.primary" isCurrentPage>
                <BreadcrumbLink href={'#'}>{selectedWebhook.endpoint}</BreadcrumbLink>
            </BreadcrumbItem>
        </Breadcrumb>
    );

    const isEmpty = subscriptions.length === 0;

    const isOffline = selectedWebhook.status === RTWebhookListStatusEnum.RTOffline;
    const isSuspended = selectedWebhook.status === RTWebhookListStatusEnum.RTSuspended;

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
                                    <StatusIndicator
                                        variant={getWebhookStatusVariant(selectedWebhook.status)}
                                        label={getWebhookStatusLabel(selectedWebhook.status)}
                                    />
                                    {(isOffline || isSuspended) && (
                                        <Button
                                            isLoading={isBackToOnlinePending}
                                            onClick={() => backToOnline(selectedWebhook.id)}
                                            size="sm"
                                        >
                                            Try Online
                                        </Button>
                                    )}
                                    {isSuspended && (
                                        <Button onClick={onSuspendedOpen} size="sm">
                                            Top Up Balance
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
            <WebhookSuspendedModal
                isOpen={isSuspendedOpen}
                onClose={onSuspendedClose}
                onOpenRefill={onRefillOpen}
            />
            <RefillModal isOpen={isRefillOpen} onClose={onRefillClose} />
        </>
    );
};

export default WebhooksViewPage;
