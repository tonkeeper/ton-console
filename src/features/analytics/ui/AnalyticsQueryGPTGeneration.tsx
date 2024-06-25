import { FC, useState } from 'react';
import { Box, BoxProps, Button, Textarea } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { analyticsGPTGenerationStore, analyticsQueryGPTRequestStore } from '../model';
import { Span, TextareaBody, TextareaFooter, TextareaGroup, useLocalStorage } from 'src/shared';

const SHOW_CONTEXT_CMD = 'run:show_context';
const HIDE_CONTEXT_CMD = 'run:hide_context';

interface AnalyticsQueryGPTGenerationProps extends BoxProps {
    defaultRequest?: string;
}

const AnalyticsQueryGPTGeneration: FC<AnalyticsQueryGPTGenerationProps> = ({
    defaultRequest,
    ...restProps
}) => {
    const [message, setMessage] = useState(defaultRequest ?? '');
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

        analyticsGPTGenerationStore.gptPrompt = message;
        analyticsQueryGPTRequestStore.clearRequest();
        analyticsGPTGenerationStore.generateSQL(message, context || undefined);
    };

    let price = null;
    const gptPricing = analyticsGPTGenerationStore.gptPricing$.value;
    if (gptPricing) {
        if (gptPricing.freeRequestsNumber > gptPricing.usedFreeRequest) {
            price = `${
                gptPricing.freeRequestsNumber - gptPricing.usedFreeRequest
            } free requests left`;
        } else {
            price = `Costs up to ${gptPricing.requestPrice.stringCurrencyAmount}`;
        }
    }

    return (
        <Box {...restProps}>
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
                <TextareaFooter
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    gap="3"
                >
                    {!!price && (
                        <Span color="text.secondary" textStyle="label2">
                            {price}
                        </Span>
                    )}
                    <Button
                        isDisabled={!message}
                        isLoading={analyticsGPTGenerationStore.generateSQL.isLoading}
                        onClick={onGenerate}
                        size="sm"
                    >
                        Generate
                    </Button>
                </TextareaFooter>
            </TextareaGroup>
        </Box>
    );
};

export default observer(AnalyticsQueryGPTGeneration);
