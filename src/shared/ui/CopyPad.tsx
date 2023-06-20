import { ComponentProps, FunctionComponent } from 'react';
import { Pad } from './Pad';
import { Spinner, Text, Tooltip, useClipboard } from '@chakra-ui/react';
import { CopyIcon24 } from './icons/CopyIcon24';

export const CopyPad: FunctionComponent<
    ComponentProps<typeof Pad> & {
        text: string;
        iconAlign?: 'start' | 'center';
        isLoading?: boolean;
    }
> = ({ text, iconAlign, isLoading, ...rest }) => {
    const { hasCopied, onCopy } = useClipboard(text);

    return (
        <Tooltip isOpen={hasCopied} label="Copied!" offset={[0, -20]} placement="bottom">
            <Pad
                py="3"
                px="4"
                pr="2.5"
                display="flex"
                cursor={isLoading ? 'default' : 'pointer'}
                gap="7"
                alignItems="center"
                justifyContent="space-between"
                opacity={isLoading ? '0.48' : '1'}
                onClick={isLoading ? () => {} : onCopy}
                wordBreak="break-word"
                _hover={{
                    svg: {
                        color: 'icon.primary'
                    }
                }}
                sx={{
                    svg: {
                        transitionProperty: 'color',
                        transitionDuration: '200ms'
                    }
                }}
                {...rest}
            >
                {isLoading ? (
                    <Spinner mx="auto" size="sm" />
                ) : (
                    <Text textStyle="body2" color="primary" fontFamily="mono">
                        {text}
                    </Text>
                )}

                <CopyIcon24 alignSelf={iconAlign === 'start' ? 'flex-start' : 'center'} />
            </Pad>
        </Tooltip>
    );
};
