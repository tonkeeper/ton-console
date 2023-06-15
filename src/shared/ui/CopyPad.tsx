import { ComponentProps, FunctionComponent } from 'react';
import { Pad } from './Pad';
import { Text, Tooltip, useClipboard } from '@chakra-ui/react';
import { CopyIcon24 } from './icons/CopyIcon24';

export const CopyPad: FunctionComponent<ComponentProps<typeof Pad> & { text: string }> = ({
    text,
    ...rest
}) => {
    const { hasCopied, onCopy } = useClipboard(text);

    return (
        <Tooltip isOpen={hasCopied} label="Copied!" offset={[0, -20]} placement="bottom">
            <Pad
                py="3"
                px="4"
                pr="2.5"
                display="flex"
                cursor="pointer"
                gap="7"
                alignItems="center"
                onClick={onCopy}
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
                <Text textStyle="body2" color="primary" fontFamily="mono" wordBreak="break-word">
                    {text}
                </Text>

                <CopyIcon24 />
            </Pad>
        </Tooltip>
    );
};
