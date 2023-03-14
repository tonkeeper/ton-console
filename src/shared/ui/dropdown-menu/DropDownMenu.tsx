import { Box } from '@chakra-ui/react';
import { ComponentProps, FunctionComponent, PropsWithChildren } from 'react';

export const DropDownMenu: FunctionComponent<
    ComponentProps<typeof Box> & PropsWithChildren
> = props => {
    return (
        <Box p="2" {...props}>
            {props.children}
        </Box>
    );
};
