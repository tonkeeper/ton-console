import { defineStyle } from '@chakra-ui/react';

export default defineStyle({
    list: {
        p: '2',
        borderRadius: 'lg',
        border: 'none',
        bg: 'background.content',
        boxShadow: 'dropdown',
        minWidth: 'unset'
    },
    item: {
        pl: 2,
        py: 2,
        pr: 3,
        apply: 'textStyles.label2',
        color: 'text.primary',
        borderRadius: 'md',
        bg: 'background.content',
        _focus: {
            bg: 'background.content'
        },
        _hover: {
            bg: 'button.secondary.backgroundHover'
        }
    }
});
