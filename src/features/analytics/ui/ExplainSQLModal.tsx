import { FC } from 'react';
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
import CodeMirror from '@uiw/react-codemirror';
import { PostgreSQL, sql as sqlExtension } from '@codemirror/lang-sql';

const ExplainSQLModal: FC<{
    isOpen: boolean;
    onClose: () => void;
    request?: string;
    explanation?: string;
    title?: string;
}> = ({ isOpen, onClose, title = 'Explain', request = '', explanation = '' }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="5xl">
            <ModalOverlay />
            <ModalContent mx="30px">
                <ModalCloseButton />
                <ModalHeader>
                    <H4>{title}</H4>
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
                            value={request.trim()}
                        />
                    </Pad>
                    {explanation && (
                        <CopyPad
                            maxH="400px"
                            iconAlign="start"
                            w="100%"
                            whiteSpace="pre"
                            iconPosition="sticky"
                            text={explanation.trim()}
                        />
                    )}
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
