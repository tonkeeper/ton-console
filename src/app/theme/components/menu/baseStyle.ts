import { defineStyle } from '@chakra-ui/react';

export default defineStyle({
    list: {
        p: '2',
        borderRadius: 'lg',
        border: 'none',
        bg: 'background.content',
        boxShadow: 'dropdown'
    },
    item: {
        p: 2,
        apply: 'textStyles.label2',
        color: 'text.primary',
        borderRadius: 'md',
        bg: 'background.content',
        _focus: {
            bg: 'background.content'
        },
        _hover: {
            bg: 'background.contentTint'
        }
    }
});
