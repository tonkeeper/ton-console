import { FC } from 'react';
import { CreateIcon96, H4 } from 'src/shared';
import { Button, Flex, Text } from '@chakra-ui/react';

export const EmptyWebhooks: FC<{
    onOpenCreate: () => void;
}> = ({ onOpenCreate }) => {
    return (
        <Flex align="center" justify="center">
            <Flex align="center" direction="column" maxW="512px">
                <CreateIcon96 mb="8" />
                <H4 mb="2">Your Webhooks will be shown here</H4>
                <Text textStyle="body2" mb="6" color="text.secondary">
                    Create your first Webhook
                </Text>
                <Button onClick={onOpenCreate}>Create Webhook</Button>
            </Flex>
        </Flex>
    );
};
