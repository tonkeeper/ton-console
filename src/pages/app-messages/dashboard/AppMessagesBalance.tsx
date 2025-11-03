import { FC } from 'react';
import { formatWithSuffix } from 'src/shared';
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
            <Flex direction="column" gap="2">
                <Text flex="1" mb="0" color={amount === 0 ? 'accent.red' : 'text.primary'} fontWeight={amount === 0 ? 'bold' : 'normal'}>
                    {isLoading ? <Skeleton w="80px" h="6" /> : formatWithSuffix(amount || 0)}{' '}
                    messages
                </Text>
                <Button w="100%" onClick={onOpen} size="lg" variant="primary">
                    Refill
                </Button>
            </Flex>
            <MessagesRefillModal isOpen={isOpen} onClose={onClose} />
        </Box>
    );
};

export default AppMessagesBalance;
