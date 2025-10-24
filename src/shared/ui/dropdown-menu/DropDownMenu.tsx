import { Box } from '@chakra-ui/react';
import { ComponentProps, FC, PropsWithChildren } from 'react';

export const DropDownMenu: FC<
    ComponentProps<typeof Box> & PropsWithChildren
> = props => {
    return (
        <Box p="2" {...props}>
            {props.children}
        </Box>
    );
};
