import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { CreateWebhookModal, WebhooksTable, webhooksStore } from 'src/features/tonapi/webhooks';
import { EmptyWebhooks } from './EmptyWebhooks';
import { EXTERNAL_LINKS, H4, Overlay } from 'src/shared';
import { Badge, Button, Center, Flex, Spinner, useDisclosure, Text, Link } from '@chakra-ui/react';

const WebhooksPage: FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    if (!webhooksStore.webhooks$.isResolved) {
        return (
            <Center h="300px">
                <Spinner />
            </Center>
        );
    }

    const isEmptyWebhooks = webhooksStore.webhooks$.value.length === 0;

    return (
        <>
            <Overlay h="fit-content">
                <Flex mb="5">
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
                {isEmptyWebhooks ? <EmptyWebhooks onOpenCreate={onOpen} /> : <WebhooksTable />}
            </Overlay>
            <CreateWebhookModal isOpen={isOpen} onClose={onClose} />
        </>
    );
};

export default observer(WebhooksPage);
