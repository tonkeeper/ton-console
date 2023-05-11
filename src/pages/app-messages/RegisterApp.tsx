import { FunctionComponent } from 'react';
import { H4, Overlay } from 'src/shared';
import { Box, Divider, Link, Text } from '@chakra-ui/react';
import { DappRegistrationForm } from 'src/entities';

export const RegisterApp: FunctionComponent = () => {
    return (
        <Overlay px="0">
            <Box maxW="800px" px="6">
                <H4 mb="1">Tonkeeper Messages</H4>
                <Text textStyle="body2" mb="5" color="text.secondary">
                    Interact with users of your dapp through push messages inside Tonkinper — an
                    effective way to increase customer engagement and retention.&nbsp;
                    <Link color="accent.blue" href="https://docs.tonconsole.com/" isExternal>
                        Learn more
                    </Link>
                </Text>
            </Box>
            <Divider mb="3" />
            <DappRegistrationForm />
        </Overlay>
    );
};
