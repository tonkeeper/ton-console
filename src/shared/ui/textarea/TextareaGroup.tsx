import {
    Children,
   
    FC,
    isValidElement,
    PropsWithChildren,
    useMemo,
    useState
} from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import { TextareaFooter } from './TextareaFooter';
import { TextareaGroupContext } from './textarea-group-context';
import { TextareaRight } from './TextareaRight';

const horizontalStyles = {
    display: 'flex',
    textarea: {
        flex: 1
    }
};

export const TextareaGroup: FC<PropsWithChildren<BoxProps>> = ({
    children,
    ...props
}) => {
    const [showScrollDivider, setShowScrollDivider] = useState(false);
    const [focused, setFocused] = useState(false);
    const [hasFooter, hasRight] = useMemo(() => {
        const chn = Children.toArray(children);
        const _hasFooter = chn.some(
            child => isValidElement(child) && child.type === TextareaFooter
        );
        const _hasRight = chn.some(child => isValidElement(child) && child.type === TextareaRight);
        return [_hasFooter, _hasRight];
    }, [children]);

    return (
        <TextareaGroupContext.Provider
            value={{
                hasFooter,
                showScrollDivider,
                setShowScrollDivider,
                focused,
                setFocused,
                hasRight
            }}
        >
            <Box {...(hasRight && horizontalStyles)} {...props}>
                {children}
            </Box>
        </TextareaGroupContext.Provider>
    );
};
