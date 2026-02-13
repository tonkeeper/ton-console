import { forwardRef, IconButton as ChakraIconButton, IconButtonProps } from '@chakra-ui/react';

export const IconButton = forwardRef<
    IconButtonProps & {
        iconColor?: string;
        iconColorHover?: string;
        iconColorActive?: string;
    },
    typeof ChakraIconButton
>(({ iconColor, iconColorHover, iconColorActive, ...rest }, ref) => (
    <ChakraIconButton
        ref={ref}
        sx={{
            svg: {
                color: iconColor || 'icon.secondary',
                transitionProperty: 'color',
                transitionDuration: '200ms'
            }
        }}
        _hover={{
            svg: { color: iconColorHover || 'icon.primary' }
        }}
        _active={{
            svg: { color: iconColorActive || 'icon.secondary' }
        }}
        size="fit"
        variant="flat"
        {...rest}
    />
));
