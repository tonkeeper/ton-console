import { ComponentProps, FunctionComponent } from 'react';
import { formatWithSuffix, H4, Overlay } from 'src/shared';
import { Box, Button, Skeleton, Text, useDisclosure } from '@chakra-ui/react';
import { appMessagesStore, MessagesRefillModal } from 'src/features';
import { observer } from 'mobx-react-lite';

const AppMessagesBalance: FunctionComponent<ComponentProps<typeof Box>> = props => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const balanceIsZero = appMessagesStore.balance$.isResolved && !appMessagesStore.balance$.value;

    return (
        <Overlay h="fit-content" w="320px" {...props}>
            <H4 mb="1">
                {appMessagesStore.balance$.isLoading ? (
                    <Skeleton w="100px" h="6" />
                ) : (
                    formatWithSuffix(appMessagesStore.balance$.value || 0)
                )}
            </H4>
            <Text textStyle="body2" mb="5" color="text.secondary">
                Available messages
            </Text>
            <Button w="100%" onClick={onOpen} variant={balanceIsZero ? 'primary' : 'secondary'}>
                Refill
            </Button>
            <MessagesRefillModal isOpen={isOpen} onClose={onClose} />
        </Overlay>
    );
};

export default observer(AppMessagesBalance);
