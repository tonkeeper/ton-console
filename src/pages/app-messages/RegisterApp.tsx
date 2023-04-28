import { FunctionComponent } from 'react';
import { H4, Overlay } from 'src/shared';
import { Box, Divider, Link, Text } from '@chakra-ui/react';
import { AppUrlForm } from 'src/features';

export const RegisterApp: FunctionComponent = () => {
    return (
        <Overlay>
            <Box maxW="804px">
                <H4 mb="1">App Messages</H4>
                <Text textStyle="body2" mb="5" color="text.secondary">
                    Register your app. Text description. Register your app. Text description.
                    Register your app. Text description. Register your app. Text description.
                    Register your app. Text description.
                    <Link color="accent.blue" href="https://google.com" isExternal>
                        Learn more
                    </Link>
                </Text>
                <Divider mb="3" />
                <AppUrlForm onSubmit={console.log} />
            </Box>
        </Overlay>
    );
};
