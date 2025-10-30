import { FC } from 'react';
import { Box, BoxProps, Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { CopyPad } from 'src/shared';
import { InvoicesAppStore, InvoicesTokenRegenerateConfirmation } from 'src/features';

interface InvoicesAuthorizationProps extends BoxProps {
    invoicesAppStore: InvoicesAppStore;
}

const InvoicesStats: FC<InvoicesAuthorizationProps> = ({ invoicesAppStore, ...props }) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    return (
        <Box {...props}>
            <Text textStyle="label1" mb="1">
                Authorization
            </Text>
            <Text textStyle="body2" mb="2">
                Token
            </Text>
            <Flex gap="3" mb="2">
                <CopyPad
                    isLoading={!invoicesAppStore.appToken$.isResolved}
                    flex="1"
                    wordBreak="break-all"
                    text={invoicesAppStore.appToken$.value || ''}
                />
                <Button
                    h="auto"
                    isDisabled={!invoicesAppStore.appToken$.isResolved}
                    isLoading={invoicesAppStore.regenerateAppToken.isLoading}
                    onClick={onOpen}
                    variant="secondary"
                >
                    Generate
                </Button>
                <InvoicesTokenRegenerateConfirmation invoicesAppStore={invoicesAppStore} isOpen={isOpen} onClose={onClose} />
            </Flex>
            <Text textStyle="body2" mb="4" color="text.secondary">
                Token-based authentication is a protocol which allows for identity verification and
                offers the second layer of security. The token is secret, don’t reveal it to any
                third party. If your token was compromised, generate a new one.
            </Text>
        </Box>
    );
};

export default observer(InvoicesStats);
