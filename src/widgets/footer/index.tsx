import { FC } from 'react';
import { Flex, FlexProps, Link } from '@chakra-ui/react';
import { EXTERNAL_LINKS } from 'src/shared';

export const Footer: FC<FlexProps> = props => {
    return (
        <Flex as="footer" columnGap="4" {...props} wrap="wrap">
            <Link p="1" href={EXTERNAL_LINKS.DOCUMENTATION} isExternal>
                Docs
            </Link>
            <Link p="1" href={EXTERNAL_LINKS.SUPPORT} isExternal>
                Support
            </Link>
            <Link p="1" href={EXTERNAL_LINKS.TG_CHANNEL} isExternal>
                Telegram Channel
            </Link>
        </Flex>
    );
};
