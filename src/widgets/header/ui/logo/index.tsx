import { ComponentProps, FunctionComponent } from 'react';
import { HStack } from '@chakra-ui/react';
import { H4, TonConsoleIcon } from 'src/shared';
import { Link } from 'react-router-dom';

export const Logo: FunctionComponent<ComponentProps<typeof HStack>> = props => {
    return (
        <HStack as={Link} spacing="2" to="/" {...props}>
            <TonConsoleIcon />
            <H4>Console</H4>
        </HStack>
    );
};
