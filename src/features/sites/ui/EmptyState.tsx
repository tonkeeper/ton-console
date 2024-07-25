import { FunctionComponent } from 'react';
import { ButtonLink, H3, Overlay } from 'src/shared';
import { Flex, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { INVOICES_LINKS } from 'src/features';
import { GloubeIcon24 } from 'src/shared';

const EmptyState: FunctionComponent = () => {
    return (
        <Overlay pt="60px" display="flex" flexDirection="column" alignItems="center">
            <GloubeIcon24 mb="5" boxSize={40} />
            <H3 mb="4">TON Sites</H3>
            <Text textStyle="body2" maxW="392px" mb="9" color="text.secondary" textAlign="center">
                Your Domains and endpoints will be shown here. We help you connect to any resource
                using the TON DNS.
            </Text>

            <Flex gap="5">
                <ButtonLink
                    size="md"
                    variant="secondary"
                    isExternal
                    href={INVOICES_LINKS.BUSINESS_DESCRIPTION}
                >
                    Read Guide
                </ButtonLink>
                <ButtonLink isExternal href={INVOICES_LINKS.JOIN_CONTACT}>
                    Contact Us
                </ButtonLink>
            </Flex>
        </Overlay>
    );
};

export default observer(EmptyState);
