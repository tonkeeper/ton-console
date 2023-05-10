import { ComponentProps, FunctionComponent } from 'react';
import { Pad } from './Pad';
import { Text, Tooltip, useClipboard } from '@chakra-ui/react';
import { CopyIcon24 } from './icons/CopyIcon24';

const padAnimation = {
    transition: '0.15s ease-in-out',
    _hover: {
        transform: 'scale(1.01)'
    },
    _active: {
        transform: 'scale(0.99)'
    }
};
export const CopyPad: FunctionComponent<
    ComponentProps<typeof Pad> & { text: string; iconAlign?: 'start' | 'center' }
> = ({ text, iconAlign, ...rest }) => {
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
                justifyContent="space-between"
                onClick={onCopy}
                {...padAnimation}
                {...rest}
            >
                <Text textStyle="body2" color="primary" fontFamily="mono" wordBreak="break-word">
                    {text}
                </Text>

                <CopyIcon24 alignSelf={iconAlign === 'start' ? 'flex-start' : 'center'} />
            </Pad>
        </Tooltip>
    );
};
