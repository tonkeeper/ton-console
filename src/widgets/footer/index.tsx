import { FunctionComponent } from 'react';
import { Box, Flex, Link } from '@chakra-ui/react';
import { EXTERNAL_LINKS } from 'src/shared';

export const Footer: FunctionComponent = () => {
    return (
        <Box as="footer" ml="1">
            <Flex wrap="wrap" gap="4" rowGap="1.5" mb="1.5" pl="1">
                <Link href="https://tonapi.io/docs" isExternal>
                    Documentation
                </Link>
                <Link href={EXTERNAL_LINKS.SUPPORT} isExternal>
                    Support
                </Link>
            </Flex>
        </Box>
    );
};
