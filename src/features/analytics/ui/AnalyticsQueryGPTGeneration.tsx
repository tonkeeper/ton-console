import { ComponentProps, FunctionComponent, useState } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { analyticsGPTGenerationStore, analyticsQueryGPTRequestStore } from '../model';
import { TextareaBody, TextareaGroup } from 'src/shared';
import { TextareaRight } from 'src/shared/ui/textarea/TextareaRight';

const AnalyticsQueryGPTGeneration: FunctionComponent<ComponentProps<typeof Box>> = props => {
    const [message, setMessage] = useState('');

    const onGenerate = () => {
        analyticsQueryGPTRequestStore.clear();
        analyticsGPTGenerationStore.generateSQL(message);
    };

    return (
        <Box {...props}>
            <TextareaGroup>
                <TextareaBody
                    resize="none"
                    autoComplete="off"
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
