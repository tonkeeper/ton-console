import { Box, BoxProps } from '@chakra-ui/react';
import { FC, PropsWithChildren } from 'react';

export const DropDownMenu: FC<
    BoxProps & PropsWithChildren
> = props => {
    return (
        <Box p="2" {...props}>
            {props.children}
        </Box>
    );
};
