import { Box, Button, chakra } from '@chakra-ui/react';
import { ComponentProps, FunctionComponent, PropsWithChildren, ReactNode, useMemo } from 'react';
import { NavLink } from 'react-router-dom';

const MenuItemButton = chakra(Button, {
    baseStyle: {
        display: 'flex',
        gap: 3,
        outline: 'none',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        color: 'text.primary',
        borderRadius: 'md',
        backgroundColor: 'transparent',
        paddingY: 2,
        paddingX: 3,
        boxShadow: 'none',
        transition: '0.2s',
        _hover: {
            backgroundColor: 'button.secondary.backgroundHover',
            _disabled: {
                cursor: 'default'
            }
        },
        _focus: {
            transform: 'none',
            outline: 0
        }
    }
});

export const DropDownMenuItem: FunctionComponent<
    ComponentProps<typeof Box> &
        PropsWithChildren & { layer?: number; leftIcon?: ReactNode; linkTo?: string; path?: string }
> = props => {
    const navLinkProps = useMemo<
        ({ as: typeof NavLink } & ComponentProps<typeof NavLink>) | Record<never, never>
    >(
        () =>
            props.linkTo
                ? {
                      as: chakra(NavLink),
                      to: props.path ? `${props.path}/${props.linkTo}` : props.linkTo,
                      _activeLink: {
                          backgroundColor: 'background.contentTint',
                          _hover: {
                              transform: 'none'
                          },
                          _active: {
                              transform: 'none'
                          }
                      }
                  }
                : {},
        [props.linkTo, props.path]
    ) as { as: typeof NavLink } & ComponentProps<typeof NavLink>;
    return (
        <MenuItemButton
            pl={props.layer ? props.layer * 16 : 3}
            textStyle={props.layer ? 'body2' : 'label2'}
            {...navLinkProps}
        >
            {props.leftIcon}
            <Box wordBreak="break-all" noOfLines={1}>
                {props.children}
            </Box>
        </MenuItemButton>
    );
};
