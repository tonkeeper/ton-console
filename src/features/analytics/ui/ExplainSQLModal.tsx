import { FunctionComponent } from 'react';
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from '@chakra-ui/react';
import { CopyPad, H4, Pad } from 'src/shared';
import { observer } from 'mobx-react-lite';
import { analyticsQueryGPTRequestStore, analyticsQuerySQLRequestStore } from 'src/features';
import CodeMirror from '@uiw/react-codemirror';
import { PostgreSQL, sql as sqlExtension } from '@codemirror/lang-sql';

const ExplainSQLModal: FunctionComponent<{
    isOpen: boolean;
    onClose: () => void;
    type: 'sql' | 'gpt';
}> = ({ isOpen, onClose, type }) => {
    const text =
        (type === 'sql'
            ? analyticsQuerySQLRequestStore.request$.value?.explanation
            : analyticsQueryGPTRequestStore.request$.value?.explanation) || '';

    const sql =
        (type === 'sql'
            ? analyticsQuerySQLRequestStore.request$.value?.request
            : analyticsQueryGPTRequestStore.request$.value?.request) || '';
    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="5xl">
            <ModalOverlay />
            <ModalContent mx="30px">
                <ModalCloseButton />
                <ModalHeader>
                    <H4>Explain</H4>
                </ModalHeader>
                <ModalBody py="0">
                    <Pad
                        mb="4"
                        maxH="300px"
                        w="100%"
                        px="4"
                        py="3"
                        whiteSpace="pre"
                        overflow="auto"
                        sx={{
                            '.cm-gutters': {
                                display: 'none'
                            },
                            '.cm-content': {
                                padding: 0
                            },
                            '.cm-editor': {
                                background: 'transparent !important',
                                outline: 'none'
                            },
                            '.cm-editor *': {
                                fontSize: '14px',
                                fontWeight: '500',
                                fontFamily: 'mono'
                            },
                            '.cm-activeLine, .cm-activeLineGutter': {
                                backgroundColor: 'transparent'
                            }
                        }}
                    >
                        <CodeMirror
                            extensions={[
                                sqlExtension({
                                    dialect: PostgreSQL
                                })
                            ]}
                            readOnly={true}
                            editable={true}
                            value={sql.trim()}
                        />
                    </Pad>
                    <CopyPad
                        maxH="400px"
                        iconAlign="start"
                        w="100%"
                        whiteSpace="pre"
                        text={text.trim()}
                        overflow="auto"
                    />
                </ModalBody>
                <ModalFooter>
                    <Button flex={1} onClick={onClose} variant="secondary">
                        Done
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default observer(ExplainSQLModal);
