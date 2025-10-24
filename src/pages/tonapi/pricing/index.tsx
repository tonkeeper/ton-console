import { FC } from 'react';
import { H4, Overlay, TgChannelCardLink } from 'src/shared';
import { Box, Divider, Flex, Text } from '@chakra-ui/react';
import { TonApiTiers } from 'src/features/tonapi/pricing';
import { Link } from 'react-router-dom';

const PricingPage: FC = () => {
    return (
        <Overlay h="fit-content">
            <Flex align="center" justify="space-between" pb="4">
                <Box>
                    <H4 mb="1">Pricing</H4>
                    <Text textStyle="body2" color="accent.blue">
                        <Link to="/balance">All bills</Link>
                    </Text>
                </Box>
                <TgChannelCardLink />
            </Flex>
            <Divider mb="4" />
            <TonApiTiers />
        </Overlay>
    );
};

export default PricingPage;
