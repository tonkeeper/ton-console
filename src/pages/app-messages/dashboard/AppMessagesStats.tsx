import { ComponentProps, FunctionComponent } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { InfoTooltip, Span } from 'src/shared';

export const AppMessagesStats: FunctionComponent<ComponentProps<typeof Box>> = props => {
    return (
        <Box {...props}>
            <Flex justify="space-between">
                <Box mb="2">
                    <Span textStyle="body2" color="text.secondary">
                        All users
                    </Span>
                    &nbsp;
                    <InfoTooltip>текст тултипа</InfoTooltip>
                </Box>
                <Text textStyle="body2" textAlign="end">
                    123
                </Text>
            </Flex>
            <Flex justify="space-between">
                <Box mb="2">
                    <Span textStyle="body2" color="text.secondary">
                        With notifications enabled
                    </Span>
                    &nbsp;
                    <InfoTooltip>текст тултипа</InfoTooltip>
                </Box>
                <Text textStyle="body2" textAlign="end">
                    123
                </Text>
            </Flex>
            <Flex justify="space-between">
                <Box mb="2">
                    <Span textStyle="body2" color="text.secondary">
                        Available notifications
                    </Span>
                    &nbsp;
                    <InfoTooltip>текст тултипа</InfoTooltip>
                </Box>
                <Text textStyle="body2" textAlign="end">
                    123
                </Text>
            </Flex>
            <Flex justify="space-between">
                <Box mb="2">
                    <Span textStyle="body2" color="text.secondary">
                        Notifications sent last week
                    </Span>
                    &nbsp;
                    <InfoTooltip>текст тултипа</InfoTooltip>
                </Box>
                <Text textStyle="body2" textAlign="end">
                    123
                </Text>
            </Flex>
        </Box>
    );
};
