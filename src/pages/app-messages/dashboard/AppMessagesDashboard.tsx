import { FunctionComponent } from 'react';
import { H4, Overlay } from 'src/shared';
import { Box, Divider, Flex, Text } from '@chakra-ui/react';
import { CurrentDappCard } from 'src/entities';
import AppMessagesStats from './AppMessagesStats';
import AppMessagesAuthDocs from './AppMessagesAuthDocs';
import AppMessagesBalance from './AppMessagesBalance';

export const AppMessagesDashboard: FunctionComponent = () => {
    return (
        <Flex gap="4">
            <Overlay px="0">
                <Box mb="6" px="6">
                    <H4 mb="5">Tonkeeper Messages</H4>
                    <CurrentDappCard withMenu />
                </Box>
                <Divider />
                <Box mb="6" pt="5" px="6">
                    <Text textStyle="label1" mb="5">
                        Statistics
                    </Text>
                    <AppMessagesStats maxW="256px" />
                </Box>
                <Divider />
                <Box pt="5">
                    <Text textStyle="label1" mb="5" px="6">
                        Authorization
                    </Text>
                    <AppMessagesAuthDocs />
                </Box>
            </Overlay>
            <AppMessagesBalance flexShrink="0" />
        </Flex>
    );
};
