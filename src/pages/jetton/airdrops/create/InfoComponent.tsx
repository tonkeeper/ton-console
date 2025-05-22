import { Card, Flex, Text } from '@chakra-ui/react';
import { InfoIcon16 } from 'src/shared';

export const InfoComponent = () => {
    return (
        <Card bg="background.contentTint">
            <Flex direction="column" gap="6px" p="16px">
                <Flex align="flex-start" justify="space-between" direction="row">
                    <Text textStyle="body2" color="text.secondary">
                        Wallet connection is done through TON Connect. Only wallet version W5 is
                        supported. The address of the connected wallet will be considered the
                        administrator&apos;s address, and all subsequent actions will be available
                        only from it.
                    </Text>
                    <InfoIcon16 />
                </Flex>
            </Flex>
        </Card>
    );
};
