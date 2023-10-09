import { ComponentProps, FunctionComponent } from 'react';
import { Box, Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { CopyPad } from 'src/shared';
import { invoicesAppStore, InvoicesTokenRegenerateConfirmation } from 'src/features';

const InvoicesStats: FunctionComponent<ComponentProps<typeof Box>> = props => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    return (
        <Box {...props}>
            <Text textStyle="label1" mb="1">
                Authorization
            </Text>
            <Text textStyle="body2" mb="5" color="text.secondary">
                Description
            </Text>
            <Text textStyle="body2" mb="2">
                Token:
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
                    Regenerate
                </Button>
                <InvoicesTokenRegenerateConfirmation isOpen={isOpen} onClose={onClose} />
            </Flex>
            <Text textStyle="body2" mb="4" color="text.secondary">
                This is a service to service authorisation token. The service have token-based
                authentication, is a type of authentication that generates encrypted security
                tokens. To authorise your request, you have to call service URL&apos;s with token in
                the path. Keep token secret.
            </Text>
        </Box>
    );
};

export default observer(InvoicesStats);
