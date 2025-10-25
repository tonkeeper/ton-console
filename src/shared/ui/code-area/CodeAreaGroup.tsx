import { Children, createContext, FC, isValidElement, PropsWithChildren, useMemo } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import { CodeAreaFooter } from 'src/shared/ui/code-area/CodeAreaFooter';

export const CodeAreaGroupContext = createContext<{ hasFooter: boolean }>({ hasFooter: false });

export const CodeAreaGroup: FC<PropsWithChildren<BoxProps>> = ({ children, ...props }) => {
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
