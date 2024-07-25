import { FC } from 'react';
import { EXTERNAL_LINKS, H3, Overlay, Image } from 'src/shared';
import { Badge, Button, Flex, Link, ListItem, OrderedList, Text } from '@chakra-ui/react';

import { observer } from 'mobx-react-lite';

const SitesEmptyState: FC<{ onAddDomain: () => void }> = ({ onAddDomain }) => {
    return (
        <Overlay pt="60px" display="flex" flexDirection="column" alignItems="center">
            <Flex align="center" mb="4">
                <H3>TON Sites</H3>
                <Badge
                    textStyle="label3"
                    ml="2"
                    color="accent.orange"
                    fontFamily="body"
                    bgColor={'color-mix(in srgb, currentColor 12%, transparent)'}
                >
                    BETA
                </Badge>
            </Flex>
            <Text textStyle="body2" maxW="560px" mb="4" color="text.secondary">
                Our service provides a seamless way to connect your TON DNS to your website on
                the World Wide Web. By utilizing our platform, you can ensure that your
                decentralized domain points directly to your traditional web presence, combining the
                advantages of blockchain technologies with the convenience of familiar technologies.
            </Text>

            <Image
                objectFit="contain"
                draggable="false"
                src="/assets/images/ton-sites.svg"
                mb="4"
            />

            <Text textStyle="label2" w="100%" maxW="560px" color="text.secondary">
                How it works
            </Text>
            <OrderedList textStyle="body2" maxW="560px" ml="0" pl="6" color="text.secondary">
                <ListItem>
                    Use our platform to connect your TON DNS to your website. You&apos;ll need to
                    provide your website&apos;s URL and some basic configuration details.
                </ListItem>
                <ListItem>
                    Our system will verify the link between your TON DNS and your website. Once
                    confirmed, your domain will be live and accessible through the TON DNS network.
                </ListItem>
            </OrderedList>

            <Text textStyle="body2" w="100%" maxW="560px" color="text.secondary" marginY="4">
                More information from this article{' '}
                <Link color="text.accent" href={EXTERNAL_LINKS.TON_ORG_ABOUT_TON_SITES} isExternal>
                    “TON Sites, TON WWW, TON Proxy”
                </Link>
                .
            </Text>

            <Button mt="6" onClick={onAddDomain}>
                Add Domain
            </Button>
        </Overlay>
    );
};

export default observer(SitesEmptyState);
