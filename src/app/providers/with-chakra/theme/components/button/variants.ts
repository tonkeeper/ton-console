import { defineStyle } from '@chakra-ui/react';
import type { SystemStyleInterpolation } from '@chakra-ui/styled-system';
import textStyles from '../../foundations/textStyles';
import semanticTokens from '../../foundations/semanticTokens';

const button = semanticTokens.colors.button;

function variant(backgroundColor: string, color: string): SystemStyleInterpolation {
    const { minHeight, ...fontStyles } = textStyles.label2;
    return defineStyle({
        ...fontStyles,
        backgroundColor,
        borderRadius: 'md',
        color,
        _hover: {
            backgroundColor,
            opacity: 0.88,
            _disabled: {
                backgroundColor,
                opacity: 0.48
            }
        },
        _active: {
            opacity: 1,
            backgroundColor
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

const primary = variant(button.primary.background, button.primary.foreground);
const secondary = {
    ...variant(button.secondary.background, button.secondary.foreground),
    _hover: {
        backgroundColor: button.secondary.backgroundHover,
        opacity: 1,
        _disabled: {
            backgroundColor: button.secondary.background,
            opacity: 0.48
        }
    }
};

const overlay = {
    ...variant(button.overlay.background, button.overlay.foreground),
    _hover: {
        backgroundColor: button.overlay.backgroundHover,
        opacity: 1,
        _disabled: {
            backgroundColor: button.overlay.background,
            opacity: 0.48
        }
    }
};

const danger = variant(button.danger.background, button.danger.foreground);
const flat = {
    ...variant(button.flat.background, button.flat.foreground),
    px: 0,
    py: 0,
    p: 0,
    h: 'fit-content'
};
const contrast = variant(button.contrast.background, button.contrast.foreground);

export default {
    primary,
    secondary,
    overlay,
    danger,
    flat,
    contrast
};
