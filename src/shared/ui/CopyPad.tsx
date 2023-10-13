import { ComponentProps, FunctionComponent } from 'react';
import { Pad } from './Pad';
import { Spinner, Text, Tooltip, useClipboard } from '@chakra-ui/react';
import { CopyIcon16, CopyIcon24 } from './icons';

export const CopyPad: FunctionComponent<
    ComponentProps<typeof Pad> & {
        text: string;
        textStyles?: ComponentProps<typeof Text>;
        iconAlign?: 'start' | 'center';
        isLoading?: boolean;
        size?: 'sm' | 'md';
        variant?: 'primary' | 'flat';
    }
> = ({ text, iconAlign, isLoading, size, variant, textStyles, ...rest }) => {
    const { hasCopied, onCopy } = useClipboard(text);

    return (
        <Tooltip
            isOpen={hasCopied}
            label="Copied!"
            offset={[0, variant === 'flat' ? -3 : -20]}
            placement="bottom"
        >
            <Pad
                py={variant === 'flat' ? '0' : '3'}
                px={variant === 'flat' ? '0' : '4'}
                pr={variant === 'flat' ? '0' : '2.5'}
                display="flex"
                cursor={isLoading ? 'default' : 'pointer'}
                gap={size === 'sm' ? '2' : '7'}
                alignItems="center"
                justifyContent="space-between"
                opacity={isLoading ? '0.48' : '1'}
                onClick={isLoading ? () => {} : onCopy}
                wordBreak="break-word"
                _hover={
                    !isLoading && {
                        svg: {
                            color: 'icon.primary'
                        }
                    }
                }
                sx={
                    !isLoading && {
                        svg: {
                            transitionProperty: 'color',
                            transitionDuration: '200ms'
                        }
                    }
                }
                {...(variant === 'flat' && { bgColor: 'transparent' })}
                {...rest}
            >
                {isLoading ? (
                    <Spinner mx="auto" size="sm" />
                ) : (
                    <Text textStyle="body2" color="primary" fontFamily="mono" {...textStyles}>
                        {text}
                    </Text>
                )}

                {size === 'sm' ? (
                    <CopyIcon16 alignSelf={iconAlign === 'start' ? 'flex-start' : 'center'} />
                ) : (
                    <CopyIcon24 alignSelf={iconAlign === 'start' ? 'flex-start' : 'center'} />
                )}
            </Pad>
        </Tooltip>
    );
};
