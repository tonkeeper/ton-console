import { ComponentProps, FunctionComponent, useLayoutEffect, useRef, useState } from 'react';
import { Pad } from './Pad';
import { Box, Spinner, Text, Tooltip, useClipboard, useToken } from '@chakra-ui/react';
import { CopyIcon16, CopyIcon24 } from './icons';
import { hexToRGBA } from 'src/shared';

export const CopyPad: FunctionComponent<
    ComponentProps<typeof Pad> & {
        text: string;
        textView?: string;
        textStyles?: ComponentProps<typeof Text>;
        iconAlign?: 'start' | 'center';
        iconPosition?: 'sticky' | 'static';
        isLoading?: boolean;
        size?: 'sm' | 'md';
        variant?: 'primary' | 'flat';
        hideCopyIcon?: boolean;
    }
    // eslint-disable-next-line complexity
> = ({
    text,
    textView = text,
    iconAlign,
    iconPosition,
    isLoading,
    size,
    variant,
    textStyles,
    hideCopyIcon = false,
    ...rest
}) => {
    const { hasCopied, onCopy } = useClipboard(text);
    const bg = useToken('colors', 'background.page');
    const inner = useRef<HTMLDivElement | null>(null);
    const outer = useRef<HTMLDivElement | null>(null);
    const [height, setHeight] = useState(0);
    const [maxHeight, setMaxHeight] = useState('0');
    const [pt, setPt] = useState('0');
    const [pb, setPb] = useState('0');
    const [pr, setPr] = useState('0');
    const [pl, setPl] = useState('0');
    const staticIcon = !iconPosition || iconPosition === 'static';
    const iconOffset = size === 'sm' ? 16 : 24;
    const prWithIcon = staticIcon ? iconOffset + parseFloat(pr) + 'px' : pr;

    useLayoutEffect(() => {
        if (inner.current) {
            setHeight(inner.current?.scrollHeight);
        }

        if (outer.current) {
            const style = getComputedStyle(outer.current);
            setPt(style.paddingTop);
            setPb(style.paddingBottom);
            setPr(style.paddingRight);
            setPl(style.paddingLeft);
            setMaxHeight(style.maxHeight);
        }
    });

    return (
        <Tooltip
            isOpen={hasCopied}
            label="Copied!"
            offset={[0, variant === 'flat' ? -3 : -20]}
            placement="bottom"
        >
            <Pad
                ref={outer}
                display={isLoading ? 'flex' : 'block'}
                cursor={isLoading ? 'default' : 'pointer'}
                opacity={isLoading ? '0.48' : '1'}
                onClick={isLoading ? () => {} : onCopy}
                position="relative"
                {...(iconPosition === 'sticky' && { height: height + 'px' })}
                pr={variant === 'flat' ? '0' : '2.5'}
                px={variant === 'flat' ? '0' : '4'}
                py={variant === 'flat' ? '0' : '3'}
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
                {!hideCopyIcon &&
                    (size === 'sm' ? (
                        <CopyIcon16
                            zIndex="2"
                            bgColor={variant === 'flat' ? 'unset' : hexToRGBA(bg, 0.8)}
                            borderRadius="sm"
                            pos="absolute"
                            top={iconAlign === 'start' ? pt : 'calc(50% - 8px)'}
                            right={pr}
                        />
                    ) : (
                        <CopyIcon24
                            zIndex="2"
                            bgColor={variant === 'flat' ? 'unset' : hexToRGBA(bg, 0.8)}
                            borderRadius="sm"
                            pos="absolute"
                            top={iconAlign === 'start' ? pt : 'calc(50% - 12px)'}
                            right={pr}
                        />
                    ))}
                <Box
                    ref={inner}
                    pos={iconPosition === 'sticky' ? 'absolute' : 'static'}
                    top="0"
                    left="0"
                    overflow="auto"
                    w="100%"
                    h="fit-content"
                    maxH={maxHeight}
                    pt={iconPosition === 'sticky' ? pt : 0}
                    pr={hideCopyIcon ? 0 : prWithIcon}
                    pb={iconPosition === 'sticky' ? pb : 0}
                    pl={iconPosition === 'sticky' ? pl : 0}
                    whiteSpace="inherit"
                    wordBreak="break-word"
                >
                    {isLoading ? (
                        <Spinner mx="auto" size="sm" />
                    ) : (
                        <Text textStyle="body2" color="primary" fontFamily="mono" {...textStyles}>
                            {textView}
                        </Text>
                    )}
                </Box>
            </Pad>
        </Tooltip>
    );
};
