import { ComponentProps, FunctionComponent } from 'react';
import { Pad } from './Pad';
import { Text, Tooltip, useClipboard } from '@chakra-ui/react';
import { CopyIcon24 } from './icons/CopyIcon24';

const padAnimation = {
    transition: '0.15s ease-in-out',
    _hover: {
        transform: 'scale(1.03)'
    },
    _active: {
        transform: 'scale(0.98)'
    }
};
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
                {...padAnimation}
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
