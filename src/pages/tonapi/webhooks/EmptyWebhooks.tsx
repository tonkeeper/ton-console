import { FunctionComponent } from 'react';
import { CreateIcon96, H4, Overlay } from 'src/shared';
import { Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { CreateWebhookModal } from 'src/features';

export const EmptyWebhooks: FunctionComponent = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    return (
        <Overlay display="flex" alignItems="center" justifyContent="center">
            <Flex align="center" direction="column" maxW="512px">
                <CreateIcon96 mb="8" />
                <H4 mb="2">Your Webhooks will be shown here</H4>
                <Text textStyle="body2" mb="6" color="text.secondary">
                    Create your first Webhook
                </Text>
                <Button onClick={onOpen}>Create Webhook</Button>
            </Flex>
            <CreateWebhookModal isOpen={isOpen} onClose={onClose} />
        </Overlay>
    );
};
