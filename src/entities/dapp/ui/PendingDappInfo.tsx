import { ComponentProps, FC } from 'react';
import { Box, Button, Text, useDisclosure } from '@chakra-ui/react';
import { PendingDapp } from '../model';
import { ConfirmAppResetModal } from './ConfirmAppResetModal';
import DappCard from './DappCard';

export const PendingDappInfo: FC<
    {
        pendingDapp: PendingDapp;
        onReset: () => void;
    } & ComponentProps<typeof Box>
> = ({ pendingDapp, onReset, ...rest }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const onCloseHandler = (confirmed?: boolean): void => {
        onClose();
        if (confirmed) {
            onReset();
        }
    };

    return (
        <Box {...rest}>
            <Text textStyle="label1" mb="3" color="text.primary">
                Your app
            </Text>
            <DappCard maxW="600px" mb="4" dapp={pendingDapp} />
            <Button onClick={onOpen} variant="secondary">
                Remove
            </Button>
            <ConfirmAppResetModal
                appUrl={pendingDapp.url}
                isOpen={isOpen}
                onClose={onCloseHandler}
            />
        </Box>
    );
};
