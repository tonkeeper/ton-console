import textStyles from 'src/app/providers/with-chakra/theme/foundations/textStyles';
import { definePartsStyle } from './parts';

export default definePartsStyle({
    label: {
        ...textStyles.body2,
        color: 'text.primary',
        ml: '2'
    },
    control: {
        h: '18px',
        w: '18px',
        border: '1.5px solid',
        borderColor: 'icon.tertiary',
        bg: 'transparent',
        boxSizing: 'border-box',
        transition: 'background 0.15s ease-in-out',
        _focus: {
            boxShadow: 'none'
        },
        _hover: {
            borderColor: 'icon.secondary'
        },
        '> .chakra-icon': {
            visibility: 'hidden'
        },
        _checked: {
            bg: 'icon.primary',
            border: 'none',
            _hover: {
                bg: 'icon.primary'
            },
            '> .chakra-icon': {
                visibility: 'visible'
            }
        },
        borderRadius: 'sm'
    }
});
