import { defineStyle } from '@chakra-ui/react';
import type { SystemStyleInterpolation } from '@chakra-ui/styled-system';
import textStyles from '../../foundations/textStyles';

function variant(backgroundColor: string, color: string): SystemStyleInterpolation {
    return defineStyle({
        ...textStyles.label2,
        backgroundColor,
        borderRadius: 'md',
        color,
        _hover: {
            backgroundColor,
            transform: 'scale(1.03)',
            _disabled: {
                transform: 'scale(1)'
            }
        },
        _active: {
            transform: 'scale(0.97)'
        },
        _disabled: {
            opacity: 0.48
        },
        _loading: {
            _hover: {
                bg: backgroundColor
            }
        }
    });
}

const primary = variant('#000000', '#FFFFFF');
const secondary = variant('#F1F3F5', 'text.primary');
const danger = variant('accent.red', '#FFFFFF');
const tertiary = variant('rgba(0, 0, 0, 0.24)', '#FFFFFF');
const flat = variant('transparent', 'text.primary');

export default {
    primary,
    secondary,
    danger,
    tertiary,
    flat
};
