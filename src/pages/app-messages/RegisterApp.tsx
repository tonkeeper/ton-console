import { FunctionComponent } from 'react';
import { H4, Overlay } from 'src/shared';
import { Box, Divider, Link, Text } from '@chakra-ui/react';
import { DappRegistrationForm } from 'src/entities';

export const RegisterApp: FunctionComponent = () => {
    return (
        <Overlay px="0">
            <Box maxW="800px" px="6">
                <H4 mb="1">App Messages</H4>
                <Text textStyle="body2" mb="5" color="text.secondary">
                    Register your app. Text description. Register your app. Text description.
                    Register your app. Text description. Register your app. Text description.
                    Register your app. Text description.
                    <Link color="accent.blue" href="https://google.com" isExternal>
                        Learn more
                    </Link>
                </Text>
            </Box>
            <Divider mb="3" />
            <DappRegistrationForm />
        </Overlay>
    );
};
