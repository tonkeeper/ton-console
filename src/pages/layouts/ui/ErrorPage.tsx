import { Flex, Text } from '@chakra-ui/react';
import { INVOICES_LINKS } from 'src/features';
import { ButtonLink, H3, Overlay } from 'src/shared';

const ErrorPage = () => {
    return (
        <Overlay pt="60px" display="flex" flexDirection="column" alignItems="center">
            <H3>Something went wrong</H3>

            <Text textAlign="center" marginY="4">
                We are sorry, but something went wrong. Please try again later.
            </Text>

            <Flex gap="5">
                <ButtonLink isExternal href={INVOICES_LINKS.JOIN_CONTACT}>
                    Contact Us
                </ButtonLink>
            </Flex>
        </Overlay>
    );
};

export default ErrorPage;
