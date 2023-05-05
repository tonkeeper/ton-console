import { ComponentProps, FunctionComponent } from 'react';
import { Box, Button, Card, CardBody, Text, useDisclosure } from '@chakra-ui/react';
import { PendingDapp } from '../model';
import { Image } from 'src/shared';
import { ConfirmAppResetModal } from './ConfirmAppResetModal';

export const PendingDappInfo: FunctionComponent<
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
                Given app
            </Text>
            <Card w="fit-content" maxW="600px" mb="4">
                <CardBody alignItems="center" gap="3" display="flex" px="4" py="4">
                    <Image borderRadius="sm" w="12" h="12" minW="12" src={pendingDapp.image} />
                    <Box>
                        <Text textStyle="label2" mb="2" color="text.primary" fontFamily="mono">
                            {pendingDapp.url}
                        </Text>
                        <Text textStyle="label2" color="text.secondary" noOfLines={1}>
                            {pendingDapp.name}
                        </Text>
                    </Box>
                </CardBody>
            </Card>
            <Button onClick={onOpen} variant="secondary">
                Reset
            </Button>
            <ConfirmAppResetModal
                appUrl={pendingDapp.url}
                isOpen={isOpen}
                onClose={onCloseHandler}
            />
        </Box>
    );
};
