import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { CreateIcon96, H4, Overlay } from 'src/shared';
import { Button, Flex, Text } from '@chakra-ui/react';

export const EmptyAirdrops: FunctionComponent = () => {
    return (
        <Overlay display="flex" alignItems="center" justifyContent="center">
            <Flex align="center" direction="column" maxW="512px">
                <CreateIcon96 mb="8" />
                <H4 mb="2">Your Airdrops will be shown here</H4>
                <Text textStyle="body2" mb="6" color="text.secondary">
                    A service for mass distribution of jettons
                </Text>
                <Button as={Link} to={'/jetton/new-airdrop'}>
                    New Sending
                </Button>
            </Flex>
        </Overlay>
    );
};
