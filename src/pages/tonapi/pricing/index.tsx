import { FC } from 'react';
import { EXTERNAL_LINKS, H4, Overlay, TgIcon } from 'src/shared';
import { Box, Divider, Flex, Hide, HStack, Link as ChakraLink, Text } from '@chakra-ui/react';
import { TonApiTiers } from 'src/features/tonapi/pricing';
import { Link } from 'react-router-dom';

const PricingPage: FC = () => {
    return (
        <Overlay h="fit-content">
            <Flex align="center" justify="space-between" mb="4">
                <Box>
                    <H4 mb="2">Pricing</H4>
                    <Text textStyle="body2" color="accent.blue">
                        <Link to="/balance">
                            View all bills
                        </Link>
                    </Text>
                </Box>
                <ChakraLink
                    _hover={{ textDecoration: 'none', opacity: 0.8 }}
                    href={EXTERNAL_LINKS.TG_CHANNEL}
                    isExternal
                >
                    <HStack color="text.secondary" spacing="2">
                        <TgIcon />
                        <Hide below="md">
                            <Text textStyle="body2">Telegram Channel</Text>
                        </Hide>
                    </HStack>
                </ChakraLink>
            </Flex>
            <Divider my="4" />
            <TonApiTiers />
        </Overlay>
    );
};

export default PricingPage;
