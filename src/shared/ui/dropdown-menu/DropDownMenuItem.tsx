import { Box, Button, chakra } from '@chakra-ui/react';
import { ComponentProps, FunctionComponent, PropsWithChildren, ReactNode } from 'react';

const MenuItemButton = chakra(Button, {
    baseStyle: {
        display: 'flex',
        gap: 3,
        justifyContent: 'flex-start',
        width: '100%',
        color: 'text.primary',
        borderRadius: 'md',
        backgroundColor: 'transparent',
        paddingY: 2,
        paddingX: 3,
        boxShadow: 'none',
        _hover: {
            transform: 'none',
            backgroundColor: 'background.contentTint',
            _disabled: {
                cursor: 'default'
            }
        },
        _active: {
            backgroundColor: 'background.contentTint',
            transform: 'none'
        },
        _focus: {
            transform: 'none',
            outline: 0
        }
    }
});

export const DropDownMenuItem: FunctionComponent<
    ComponentProps<typeof Box> & PropsWithChildren & { layer?: number; leftIcon?: ReactNode }
> = props => {
    return (
        <MenuItemButton
            pl={props.layer ? props.layer * 16 : 3}
            textStyle={props.layer ? 'body2' : 'label2'}
        >
            {props.leftIcon}
            <Box wordBreak="break-all" noOfLines={1}>
                {props.children}
            </Box>
        </MenuItemButton>
    );
};
