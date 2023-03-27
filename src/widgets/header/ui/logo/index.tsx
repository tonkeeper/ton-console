import { ComponentProps, FunctionComponent } from 'react';
import { HStack } from '@chakra-ui/react';
import { H4, TonConsoleIcon } from 'src/shared';

export const Logo: FunctionComponent<ComponentProps<typeof HStack>> = props => {
    return (
        <HStack spacing="2" {...props}>
            <TonConsoleIcon />
            <H4>Console</H4>
        </HStack>
    );
};
