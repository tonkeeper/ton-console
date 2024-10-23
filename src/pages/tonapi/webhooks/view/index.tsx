import { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { SubscriptionsTable, webhooksStore } from 'src/features/tonapi/webhooks';
import { EmptySubscriptions } from './EmptySubscriptions';
import { EXTERNAL_LINKS, H4, Overlay, useSearchParams } from 'src/shared';
import {
    Badge,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Button,
    Center,
    Spinner,
    useDisclosure,
    Flex,
    Link,
    Text
} from '@chakra-ui/react';
import AddSubscriptionsModal from 'src/features/tonapi/webhooks/ui/AddSubscriptionsModal';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronRightIcon16 } from 'src/shared/ui/icons/ChevronRightIcon16';

const SubscriptionsViewPage: FC = () => {
    const { searchParams } = useSearchParams();
    const webhookId = searchParams.get('webhookId');

    useEffect(() => {
        if (webhookId) {
            webhooksStore.setSelectedWebhookId(webhookId);
        }

        return () => {
            webhooksStore.setSelectedWebhookId(null);
        };
    }, [webhookId]);

    const { isOpen, onOpen, onClose } = useDisclosure();

    if (!webhooksStore.selectedWebhook || !webhooksStore.subscriptions$.isResolved) {
        return (
            <Center h="300px">
                <Spinner />
            </Center>
        );
    }

    if (!webhooksStore.subscriptions$.value.length) {
        return <EmptySubscriptions />;
    }

    return (
        <>
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
                    <BreadcrumbLink href={'#'}>
                        {webhooksStore.selectedWebhook.endpoint}
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Overlay h="fit-content">
                <Flex mb="5">
                    <Flex direction="column" gap={2}>
                        <Flex align="center" gap={4}>
                            <H4>Webhook Subscriptions</H4>
                            <Badge
                                textStyle="label3"
                                color="accent.orange"
                                fontFamily="body"
                                bgColor={'color-mix(in srgb, currentColor 12%, transparent)'}
                            >
                                BETA
                            </Badge>
                        </Flex>
                        <Flex>
                            <Text textStyle="text.body2" color="text.secondary" fontSize={14}>
                                Webhooks are available via the API. For details, see{' '}
                                <Link
                                    color="accent.blue"
                                    href={EXTERNAL_LINKS.DOCUMENTATION_WEBHOOKS}
                                    isExternal
                                >
                                    Webhooks API documentation
                                </Link>
                            </Text>
                        </Flex>
                    </Flex>

                    <Button mb="6" ml="auto" onClick={onOpen}>
                        Add Subscription
                    </Button>
                </Flex>
                <SubscriptionsTable />
            </Overlay>
            <AddSubscriptionsModal isOpen={isOpen} onClose={onClose} />
        </>
    );
};

export default observer(SubscriptionsViewPage);
