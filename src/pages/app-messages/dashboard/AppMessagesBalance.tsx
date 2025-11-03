import { FC } from 'react';
import { formatWithSuffix, H4 } from 'src/shared';
import { Box, BoxProps, Button, Flex, Skeleton, Text, useDisclosure } from '@chakra-ui/react';
import { MessagesRefillModal } from 'src/features';
import { useMessagesBalanceQuery } from 'src/features/app-messages/model/queries';

const AppMessagesBalance: FC<BoxProps> = props => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { data: amount, isLoading } = useMessagesBalanceQuery();

    return (
        <Box h="fit-content" {...props}>
            <Text textStyle="label1" mb="5">
                Available messages
            </Text>
            <Box gap="2" display="flex" flexDirection="column">
                <Text mb="0" flex="1">
                    {isLoading ? <Skeleton w="80px" h="6" /> : formatWithSuffix(amount || 0)}{' '}
                    messages
                </Text>
                <Button onClick={onOpen} size="lg" variant="primary" w="100%">
                    Refill
                </Button>
            </Box>
            <MessagesRefillModal isOpen={isOpen} onClose={onClose} />
        </Box>
    );
};

export default AppMessagesBalance;
