import { FC, useEffect } from 'react';
import { BoxProps, Button, Center, Flex, Skeleton, Spacer, useDisclosure } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { InfoIcon16, Span, TooltipHoverable, toTimeLeft } from 'src/shared';
import {
    analyticsQueryGPTRequestStore,
    analyticsQuerySQLRequestStore,
    analyticsQueryStore
} from 'src/features';
import { useSearchParams } from 'react-router-dom';
import { computed } from 'mobx';
import ExplainSQLModal from './ExplainSQLModal';

const AnalyticsQueryControlPanel: FC<BoxProps & { type: 'sql' | 'gpt' }> = ({ type, ...props }) => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const store = type === 'sql' ? analyticsQuerySQLRequestStore : analyticsQueryGPTRequestStore;
    const request = store.request$.value;
    const [_, setSearchParams] = useSearchParams();

    const requestEqQuery = computed(
        () =>
            store.request$.value?.request === analyticsQueryStore.query$.value?.request &&
            store.network === analyticsQueryStore.query$.value?.network
    ).get();

    const canProcess = computed(
        () =>
            store.request$.value &&
            !requestEqQuery &&
            !store.request$.isLoading &&
            !analyticsQueryStore.createQuery.isLoading
    );

    const onCreate = async (): Promise<void> => {
        const query = await analyticsQueryStore.createQuery(
            store.request$.value!.request,
            store.request$.value!.network
        );
        setSearchParams({ id: query.id });
    };

    useEffect(() => {
        const onCtrlEnter = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && canProcess.get()) {
                e.preventDefault();
                onCreate();
            }
        };

        document.addEventListener('keydown', onCtrlEnter, { capture: true });
        return () => {
            document.removeEventListener('keydown', onCtrlEnter);
        };
    }, []);

    const explanation = store.request$.value?.explanation;
    const isEstimationAlert =
        explanation &&
        (explanation.includes('Seq Scan on transactions') ||
            explanation.includes('Seq Scan on messages') ||
            explanation.includes('Seq Scan on blocks'));

    return (
        <Flex {...props} align="center" justify="flex-end" w="100%">
            {!!request && !store.request$.error && !store.request$.isLoading && (
                <>
                    <Button
                        minH="unset"
                        color="button.primary.foreground"
                        onClick={onOpen}
                        variant="flat"
                    >
                        Explain
                    </Button>
                    {isEstimationAlert && (
                        <TooltipHoverable
                            canBeShown
                            host={<InfoIcon16 color="accent.red" ml="1" />}
                        >
                            <Span w="180px" color="text.primary" textAlign="center">
                                Full scan on transaction, messages or blocks can require too much
                                time
                            </Span>
                        </TooltipHoverable>
                    )}
                    <Spacer />
                </>
            )}
            {store.request$.isLoading && (
                <Skeleton display="inline-block" w="100px" h="20px" variant="dark" />
            )}

            {!store.request$.isLoading &&
                (store.request$.error ? (
                    <TooltipHoverable
                        canBeShown
                        host={
                            <Center gap="1" color="accent.red" cursor="default">
                                Error <InfoIcon16 color="accent.red" />
                            </Center>
                        }
                    >
                        <Span color="text.primary">{store.request$.error.toString()}</Span>
                    </TooltipHoverable>
                ) : (
                    !!request && (
                        <Span display="inline-flex" opacity="0.6" fontFamily="mono">
                            {request.estimatedTimeMS < 1000 ? (
                                '< 1s'
                            ) : (
                                <>
                                    <Span paddingRight="5px" fontSize={20} lineHeight="24px">
                                        ≈
                                    </Span>
                                    <Span>{toTimeLeft(request.estimatedTimeMS)}</Span>
                                </>
                            )}
                            &nbsp;·&nbsp;
                            {request.estimatedCost.toStringCurrencyAmount({ decimalPlaces: null })}
                        </Span>
                    )
                ))}

            <Button
                ml="4"
                colorScheme="blue"
                isDisabled={!store.request$.value || requestEqQuery}
                isLoading={store.request$.isLoading || analyticsQueryStore.createQuery.isLoading}
                onClick={onCreate}
                size="sm"
                variant="solid"
            >
                Run
            </Button>
            <ExplainSQLModal
                isOpen={isOpen}
                onClose={onClose}
                explanation={explanation}
                request={store.request$.value?.request}
            />
        </Flex>
    );
};

export default observer(AnalyticsQueryControlPanel);
