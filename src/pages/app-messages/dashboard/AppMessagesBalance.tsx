import { ComponentProps, FunctionComponent } from 'react';
import { H4, Overlay } from 'src/shared';
import { Box, Button, Text, useDisclosure } from '@chakra-ui/react';
import { MessagesRefillModal } from 'src/features';

export const AppMessagesBalance: FunctionComponent<ComponentProps<typeof Box>> = props => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Overlay h="fit-content" w="320px" {...props}>
            <H4 mb="1">12345</H4>
            <Text textStyle="body2" mb="5" color="text.secondary">
                Messages available
            </Text>
            <Button w="100%" onClick={onOpen} variant="secondary">
                Refill
            </Button>
            <MessagesRefillModal isOpen={isOpen} onClose={onClose} />
        </Overlay>
    );
};
