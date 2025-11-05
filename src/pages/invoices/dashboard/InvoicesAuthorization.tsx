import { FC } from 'react';
import { Box, BoxProps, Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { CopyPad } from 'src/shared';
import { InvoicesTokenRegenerateConfirmation } from 'src/features';
import { InvoicesApp } from 'src/features/invoices/models';

interface InvoicesAuthorizationProps extends BoxProps {
    app?: InvoicesApp | null;
    token?: string | null;
    onRegenerateToken: () => Promise<void>;
    isRegeneratingToken?: boolean;
    isTokenLoading?: boolean;
}

const InvoicesAuthorization: FC<InvoicesAuthorizationProps> = ({
    app,
    token,
    onRegenerateToken,
    isRegeneratingToken,
    isTokenLoading,
    ...props
}) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    if (!app) {
        return null;
    }

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
                    isLoading={isTokenLoading}
                    flex="1"
                    breakAll
                    text={token || ''}
                />
                <Button
                    h="auto"
                    isDisabled={!token}
                    isLoading={isRegeneratingToken}
                    onClick={onOpen}
                    variant="secondary"
                >
                    Generate
                </Button>
                <InvoicesTokenRegenerateConfirmation
                    isOpen={isOpen}
                    onClose={onClose}
                    onRegenerateToken={onRegenerateToken}
                    isLoading={isRegeneratingToken}
                />
            </Flex>
            <Text textStyle="body2" mb="4" color="text.secondary">
                Token-based authentication is a protocol which allows for identity verification and
                offers the second layer of security. The token is secret, don't reveal it to any
                third party. If your token was compromised, generate a new one.
            </Text>
        </Box>
    );
};

export default InvoicesAuthorization;
