import { FC } from 'react';
import { CreateIcon96, H4 } from 'src/shared';
import { Button, Flex, Text } from '@chakra-ui/react';

export const EmptyLiteproxy: FC<{
    onOpenCreate: () => void;
}> = ({ onOpenCreate }) => {
    return (
        <Flex align="center" justify="center">
            <Flex align="center" direction="column" maxW="512px">
                <CreateIcon96 mb="8" />
                <H4 mb="2">Your Liteproxy will be shown here</H4>
                <Text textStyle="body2" mb="6" color="text.secondary">
                    Create your first Liteproxy
                </Text>
                <Button onClick={onOpenCreate}>Create Liteproxy</Button>
            </Flex>
        </Flex>
    );
};
