import { ComponentProps, FunctionComponent, useState } from 'react';
import { Box, Button, Textarea } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { analyticsGPTGenerationStore, analyticsQueryGPTRequestStore } from '../model';
import { TextareaBody, TextareaGroup, useLocalStorage } from 'src/shared';
import { TextareaRight } from 'src/shared/ui/textarea/TextareaRight';

const SHOW_CONTEXT_CMD = 'run:show_context';
const HIDE_CONTEXT_CMD = 'run:hide_context';

const AnalyticsQueryGPTGeneration: FunctionComponent<ComponentProps<typeof Box>> = props => {
    const [message, setMessage] = useState('');
    const [context, setContext] = useState('');
    const [showContext, setShowContext] = useLocalStorage('analytics:showContext', false);

    const onGenerate = () => {
        if (message.startsWith('run:')) {
            if (message === SHOW_CONTEXT_CMD) {
                setMessage('');
                return setShowContext(true);
            }

            if (message === HIDE_CONTEXT_CMD) {
                setMessage('');
                return setShowContext(false);
            }

            return alert('Unknown command');
        }

        analyticsQueryGPTRequestStore.clear();
        analyticsGPTGenerationStore.generateSQL(message, context || undefined);
    };

    return (
        <Box {...props}>
            {showContext && (
                <Textarea
                    mb="3"
                    resize="none"
                    autoComplete="off"
                    onChange={e => setContext(e.target.value)}
                    placeholder="GPT context"
                    rows={4}
                    spellCheck={false}
                />
            )}
            <TextareaGroup>
                <TextareaBody
                    resize="none"
                    autoComplete="off"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Type message here…"
                    spellCheck={false}
                    rows={4}
                />
                <TextareaRight display="flex" alignItems="flex-end">
                    <Button
                        isDisabled={!message}
                        isLoading={analyticsGPTGenerationStore.generateSQL.isLoading}
                        onClick={onGenerate}
                        size="sm"
                    >
                        Generate
                    </Button>
                </TextareaRight>
            </TextareaGroup>
        </Box>
    );
};

export default observer(AnalyticsQueryGPTGeneration);
