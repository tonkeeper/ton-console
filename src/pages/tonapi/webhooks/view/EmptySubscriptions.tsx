import { FC } from 'react';
import { CreateIcon96, H4, Overlay } from 'src/shared';
import { Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import AddSubscriptionsModal from 'src/features/tonapi/webhooks/ui/AddSubscriptionsModal';

export const EmptySubscriptions: FC = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    return (
        <Overlay display="flex" alignItems="center" justifyContent="center">
            <Flex align="center" direction="column" maxW="512px">
                <CreateIcon96 mb="8" />
                <H4 mb="2">Your Subscriptions will be shown here</H4>
                <Text textStyle="body2" mb="6" color="text.secondary">
                    Add your first Subscription
                </Text>
                <Button onClick={onOpen}>Add Subscriptions</Button>
            </Flex>
            <AddSubscriptionsModal isOpen={isOpen} onClose={onClose} />
        </Overlay>
    );
};
