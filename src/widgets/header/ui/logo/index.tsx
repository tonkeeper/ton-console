import { FC } from 'react';
import { HStack, StackProps } from '@chakra-ui/react';
import { H4, TonConsoleIcon } from 'src/shared';
import { Link } from 'react-router-dom';

export const Logo: FC<StackProps> = props => {
    return (
        <HStack as={Link} spacing="2" to="/" {...props}>
            <TonConsoleIcon />
            <H4 cursor="pointer">Ton Console</H4>
        </HStack>
    );
};
