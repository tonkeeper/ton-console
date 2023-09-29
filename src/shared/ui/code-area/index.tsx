import { ComponentProps, FunctionComponent } from 'react';
import { Box } from '@chakra-ui/react';
import CodeMirror from '@uiw/react-codemirror';
import { PostgreSQL, sql } from '@codemirror/lang-sql';
import { dracula } from '@uiw/codemirror-theme-dracula';

export const CodeArea: FunctionComponent<ComponentProps<typeof Box>> = props => {
    return (
        <Box
            {...props}
            sx={{
                '.cm-editor, .cm-gutters': {
                    borderRadius: 'lg',
                    outline: 'none'
                },
                '.cm-editor *': {
                    fontSize: '14px',
                    fontWeight: '500'
                }
            }}
        >
            <CodeMirror
                value="hello"
                onChange={() => {}}
                theme={dracula}
                extensions={[sql({ dialect: PostgreSQL })]}
                basicSetup={{ autocompletion: true }}
                width={'856px'}
                height={'255px'}
            />
        </Box>
    );
};
