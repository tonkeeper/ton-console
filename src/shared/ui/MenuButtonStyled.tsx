import { Button, chakra } from '@chakra-ui/react';

export const MenuButtonStyled = chakra(Button, {
    baseStyle: {
        apply: 'textStyles.label2',
        color: 'text.primary',
        borderRadius: 'md',
        backgroundColor: 'background.contentTint',
        paddingY: 2,
        paddingLeft: 2,
        paddingRight: 3,
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
