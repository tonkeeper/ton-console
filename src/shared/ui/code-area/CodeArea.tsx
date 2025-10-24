import { FC, useContext, useRef } from 'react';
import { Box, BoxProps, useTheme } from '@chakra-ui/react';
import CodeMirror from '@uiw/react-codemirror';
import { draculaInit } from '@uiw/codemirror-theme-dracula/src';
import { tags as t } from '@lezer/highlight';
import { CodeAreaGroupContext } from './CodeAreaGroup';
import type { Extension } from '@codemirror/state';
import AutoSizer from 'react-virtualized-auto-sizer';

export const CodeArea: FC<
    Omit<BoxProps, 'onChange'> & {
        value: string;
        onChange: (value: string) => void;
        extensions?: Extension[];
        isDisabled?: boolean;
        isLoading?: boolean;
    }
> = ({ value, onChange, extensions, isDisabled, isLoading, ...rest }) => {
    const theme = useTheme();
    const ref = useRef<HTMLDivElement | null>(null);
    const { hasFooter } = useContext(CodeAreaGroupContext);

    const { stringsColor, operatorsColor, ...codeAreaSettings } =
        theme.semanticTokens.colors.codeArea;

    const dracula = draculaInit({
        settings: {
            ...codeAreaSettings
        },
        styles: [
            { tag: t.string, color: stringsColor },
            { tag: [t.keyword, t.operator, t.tagName], color: operatorsColor }
        ]
    });

    const height = rest.h || rest.height || '260px';

    return (
        <Box
            {...rest}
            ref={ref}
            sx={{
                '.cm-editor, .cm-gutters': {
                    borderTopRadius: 'lg',
                    borderBottomRadius: hasFooter ? 'none' : 'lg',
                    outline: 'none'
                },
                '.cm-editor *': {
                    fontSize: '14px',
                    fontWeight: '500'
                },
                '.cm-scroller': {
                    paddingTop: '2'
                },
                ...(isLoading && {
                    '.cm-activeLine, .cm-activeLineGutter': {
                        backgroundColor: 'transparent'
                    },
                    '.cm-line': {
                        color: 'text.secondary'
                    }
                })
            }}
            w="100%"
            h={height}
        >
            <AutoSizer forceRender>
                {({ width }) => (
                    <CodeMirror
                        readOnly={isDisabled || isLoading}
                        editable={!isDisabled && !isLoading}
                        value={isLoading ? 'Loading...' : value}
                        onChange={onChange}
                        theme={dracula}
                        extensions={extensions}
                        basicSetup={{ autocompletion: true }}
                        width={width ? width.toString() + 'px' : '100%'}
                        height={height.toString()}
                    />
                )}
            </AutoSizer>
        </Box>
    );
};
