import { ComponentProps, FunctionComponent } from 'react';
import { Flex, Link } from '@chakra-ui/react';
import { EXTERNAL_LINKS } from 'src/shared';

export const Footer: FunctionComponent<ComponentProps<typeof Flex>> = props => {
    return (
        <Flex as="footer" gap="4" {...props}>
            <Link p="1" href={EXTERNAL_LINKS.DOCUMENTATION} isExternal>
                Documentation
            </Link>
            <Link p="1" href={EXTERNAL_LINKS.SUPPORT} isExternal>
                Support
            </Link>
        </Flex>
    );
};
