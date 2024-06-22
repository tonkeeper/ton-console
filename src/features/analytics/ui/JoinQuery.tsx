import { FC } from 'react';
import { ButtonLink, H3, DatabaseIcon40, Overlay } from 'src/shared';
import { Flex, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { ANALYTICS_LINKS } from 'src/features';
const JoinQuery: FC = () => {
    return (
        <Overlay pt="60px" display="flex" flexDirection="column" alignItems="center">
            <DatabaseIcon40 mb="5" />
            <H3 mb="4">SQL requests</H3>
            <Text textStyle="body2" maxW="392px" mb="9" color="text.secondary" textAlign="center">
                Make raw requests to database. <br />
                Contact us to start using it today!
            </Text>

            <Flex gap="5">
                <ButtonLink size="md" variant="secondary" isExternal href={ANALYTICS_LINKS.INTRO}>
                    Read Guide
                </ButtonLink>
                <ButtonLink isExternal href={ANALYTICS_LINKS.JOIN_CONTACT}>
                    Contact Us
                </ButtonLink>
            </Flex>
        </Overlay>
    );
};

export default observer(JoinQuery);
