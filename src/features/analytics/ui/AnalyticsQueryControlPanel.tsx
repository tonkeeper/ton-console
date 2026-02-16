import { FC, useEffect } from 'react';
import { BoxProps, Button, Center, Flex, Skeleton, Spacer, useDisclosure } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { InfoIcon16, Span, TooltipHoverable, toTimeLeft } from 'src/shared';
import { AnalyticsQueryStore, AnalyticsQueryRequestStore } from 'src/features';
import { useSearchParams } from 'react-router-dom';
import { computed } from 'mobx';
import ExplainSQLModal from './ExplainSQLModal';
import RefillModal from 'src/entities/balance/ui/RefillModal';
import { InsufficientBalanceModal } from 'src/entities/balance/ui/InsufficientBalanceModal';
import { useInsufficientBalanceModal } from './hooks';

interface AnalyticsQueryControlPanelProps extends BoxProps {
    type: 'sql' | 'gpt';
    analyticsQueryStore: AnalyticsQueryStore;
    analyticsQuerySQLRequestStore: AnalyticsQueryRequestStore;
    analyticsQueryGPTRequestStore: AnalyticsQueryRequestStore;
}

const AnalyticsQueryControlPanel: FC<AnalyticsQueryControlPanelProps> = ({
    type,
    analyticsQueryStore,
    analyticsQuerySQLRequestStore,
    analyticsQueryGPTRequestStore,
    ...props
}) => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const { isOpen: isRefillOpen, onClose: onRefillClose, onOpen: onRefillOpen } = useDisclosure();
    const {
        isOpen: isInsufficientBalanceOpen,
        onClose: onInsufficientBalanceClose,
        error: insufficientBalanceError,
        handlePaymentRequiredError
    } = useInsufficientBalanceModal();

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

    const onCreate = (): void => {
        analyticsQueryStore
            .createQuery(store.request$.value!.request, store.request$.value!.network)
            .then(({ data, error }) => {
                if (error) {
                    handlePaymentRequiredError(error);
                    return;
                }
                setSearchParams({ id: data!.id });
            });
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
                    request && (
                        <Span>
                            <TooltipHoverable
                                canBeShown
                                host={
                                    request.estimatedTimeMS < 1000 ? (
                                        '< 1s'
                                    ) : (
                                        <Span
                                            opacity={
                                                request.estimatedTimeMS < 20 * 60 * 1000 ? 0.6 : 1
                                            }
                                            fontFamily="mono"
                                            color={
                                                request.estimatedTimeMS < 20 * 60 * 1000
                                                    ? 'text.white'
                                                    : 'accent.red'
                                            }
                                        >
                                            <Span
                                                paddingRight="5px"
                                                fontSize={20}
                                                lineHeight="24px"
                                            >
                                                ≈
                                            </Span>
                                            <Span>{toTimeLeft(request.estimatedTimeMS)}</Span>
                                        </Span>
                                    )
                                }
                            >
                                <Span maxW="450px" color="text.primary">
                                    The actual time and cost may vary. If the query exceeds 30
                                    minutes, it will be terminated, and you will be charged for 30
                                    minutes of execution.
                                </Span>
                            </TooltipHoverable>
                            <Span
                                opacity="0.6"
                                fontFamily="mono"
                                title={request.estimatedCost.amount.toString()}
                            >
                                &nbsp;·&nbsp;
                                {request.estimatedCost.toStringCurrencyAmount()}
                            </Span>
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
            <InsufficientBalanceModal
                isOpen={isInsufficientBalanceOpen}
                onClose={onInsufficientBalanceClose}
                onOpenRefill={onRefillOpen}
                error={insufficientBalanceError}
            />
            <RefillModal isOpen={isRefillOpen} onClose={onRefillClose} />
        </Flex>
    );
};

export default observer(AnalyticsQueryControlPanel);
