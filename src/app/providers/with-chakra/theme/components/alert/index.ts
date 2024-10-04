import { alertAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
    alertAnatomy.keys
);

const AlertStyles = defineMultiStyleConfig({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    baseStyle: definePartsStyle({
        container: {
            padding: 3,
            borderRadius: 'md',
            boxShadow: 'lg',
            fontWeight: 'medium',
            bg: 'white',
            display: 'flex',
            alignItems: 'center',
            '& button:last-of-type': {
                position: 'static',
                color: 'gray.400',
                _hover: {
                    color: 'gray.600'
                }
            }
        },
        title: {
            fontSize: 'md',
            fontWeight: '590',
            color: 'black'
        },
        description: {
            fontSize: 'sm',
            color: 'text.secondary'
        },
        icon: {
            color: 'icon.secondary'
        },
        spinner: {
            color: 'icon.secondary'
        }
    }),
    variants: {
        error: {
            icon: {
                color: 'accent.red'
            }
        },
        success: {
            icon: {
                color: 'accent.green'
            }
        },
        info: {
            icon: {
                color: 'accent.blue'
            }
        },
        warning: {
            icon: {
                color: 'accent.orange'
            }
        }
    },
    defaultProps: {
        variant: 'info'
    }
});

export default AlertStyles;
