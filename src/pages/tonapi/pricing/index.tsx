import { FunctionComponent } from 'react';
import { H4, Overlay, TgChannelCardLink } from 'src/shared';
import { Box, Flex, Text } from '@chakra-ui/react';
import { TonApiTiersList } from 'src/features';

const PricingPage: FunctionComponent = () => {
    return (
        <Overlay h="fit-content">
            <Flex align="center" justify="space-between" pb="4">
                <Box>
                    <H4 mb="1">Pricing</H4>
                    <Text textStyle="body2" color="text.secondary">
                        Choose your plan for start
                    </Text>
                </Box>
                <TgChannelCardLink />
            </Flex>
            <TonApiTiersList />
        </Overlay>
    );
};

export default PricingPage;
