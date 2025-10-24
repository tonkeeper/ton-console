import { FC } from 'react';
import { H4, Overlay } from 'src/shared';
import { Button, Flex, List, ListItem, Text } from '@chakra-ui/react';
import { SubscriptionIcon } from './SubscriptionIcon';
import { CreateSubscriptionsPlan } from 'src/widgets';

export const EmptyPage: FC = () => {
    return (
        <Overlay display="flex" alignItems="center" h="100%">
            <Flex align="center" direction="column" w="100%" pt="8" pb="14">
                <SubscriptionIcon mb="6" />
                <H4 mb="2">Subscriptions</H4>
                <Text
                    textStyle="body2"
                    maxW="400px"
                    mb="7"
                    color="text.secondary"
                    textAlign="center"
                >
                    This feature allows you to offer paid subscriptions to your audience,
                    giving them access to premium content, products, or services.
                </Text>
                <List mb="24px">
                    <ListItem h="48px">Never gonna give you up Never gonna let you down</ListItem>
                    <ListItem h="48px">Never gonna give you up Never gonna let you down</ListItem>
                    <ListItem h="48px">Never gonna give you up Never gonna let you down</ListItem>
                </List>
                <Flex gap="3">
                    <Button textStyle="body3" variant="primary">
                        Create Plan
                    </Button>
                    <Button variant="secondary">About</Button>
                </Flex>
                <CreateSubscriptionsPlan />
            </Flex>
        </Overlay>
    );
};
