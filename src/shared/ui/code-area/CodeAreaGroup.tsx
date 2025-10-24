import {
    Children,
    ComponentProps,
    createContext,
    FC,
    isValidElement,
    PropsWithChildren,
    useMemo
} from 'react';
import { Box } from '@chakra-ui/react';
import { CodeAreaFooter } from 'src/shared/ui/code-area/CodeAreaFooter';

export const CodeAreaGroupContext = createContext<{ hasFooter: boolean }>({ hasFooter: false });

export const CodeAreaGroup: FC<PropsWithChildren<ComponentProps<typeof Box>>> = ({
    children,
    ...props
}) => {
    const hasFooter = useMemo(
        () =>
            Children.toArray(children).some(
                child => isValidElement(child) && child.type === CodeAreaFooter
            ),
        [children]
    );
    return (
        <CodeAreaGroupContext.Provider value={{ hasFooter }}>
            <Box {...props}>{children}</Box>
        </CodeAreaGroupContext.Provider>
    );
};
