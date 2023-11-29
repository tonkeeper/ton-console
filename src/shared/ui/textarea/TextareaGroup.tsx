import {
    Children,
    ComponentProps,
    FunctionComponent,
    isValidElement,
    PropsWithChildren,
    useMemo,
    useState
} from 'react';
import { Box } from '@chakra-ui/react';
import { TextareaFooter } from './TextareaFooter';
import { TextareaGroupContext } from './textarea-group-context';

export const TextareaGroup: FunctionComponent<PropsWithChildren<ComponentProps<typeof Box>>> = ({
    children,
    ...props
}) => {
    const [showScrollDivider, setShowScrollDivider] = useState(false);
    const [focused, setFocused] = useState(false);
    const hasFooter = useMemo(
        () =>
            Children.toArray(children).some(
                child => isValidElement(child) && child.type === TextareaFooter
            ),
        [children]
    );
    return (
        <TextareaGroupContext.Provider
            value={{ hasFooter, showScrollDivider, setShowScrollDivider, focused, setFocused }}
        >
            <Box {...props}>{children}</Box>
        </TextareaGroupContext.Provider>
    );
};
