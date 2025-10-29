import { FC } from 'react';
import { formatWithSuffix, H4, Overlay } from 'src/shared';
import { BoxProps, Button, Skeleton, Text, useDisclosure } from '@chakra-ui/react';
import { MessagesRefillModal } from 'src/features';
import { useBalanceQuery } from 'src/features/app-messages/model/queries';

const AppMessagesBalance: FC<BoxProps> = props => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { data: balance, isLoading } = useBalanceQuery();

    const balanceIsZero = !isLoading && balance === 0;

    return (
        <Overlay h="fit-content" w="320px" {...props}>
            <H4 mb="1">
                {isLoading ? (
                    <Skeleton w="100px" h="6" />
                ) : (
                    formatWithSuffix(balance || 0)
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

export default AppMessagesBalance;
