import { ComponentProps, FunctionComponent, useEffect } from 'react';
import { Box, Button, Center, Flex, Skeleton } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { InfoIcon16, Span, TooltipHoverable, toTimeLeft } from 'src/shared';
import { analyticsQueryStore } from 'src/features';
import { useSearchParams } from 'react-router-dom';
import { computed } from 'mobx';

const AnalyticsQueryControlPanel: FunctionComponent<ComponentProps<typeof Box>> = props => {
    const request = analyticsQueryStore.request$.value;
    const [_, setSearchParams] = useSearchParams();

    const canProcess = computed(
        () =>
            analyticsQueryStore.request$.value &&
            !analyticsQueryStore.requestEqQuery &&
            !analyticsQueryStore.request$.isLoading &&
            !analyticsQueryStore.createQuery.isLoading
    );

    const onCreate = async (): Promise<void> => {
        const query = await analyticsQueryStore.createQuery();
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

    return (
        <Flex {...props} align="center">
            {analyticsQueryStore.request$.isLoading && (
                <Skeleton display="inline-block" w="100px" h="20px" variant="dark" />
            )}

            {!analyticsQueryStore.request$.isLoading &&
                (analyticsQueryStore.request$.error ? (
                    <TooltipHoverable
                        canBeShown
                        host={
                            <Center gap="1" color="accent.red" cursor="default">
                                Error <InfoIcon16 color="accent.red" />
                            </Center>
                        }
                    >
                        <Span color="text.primary">
                            {analyticsQueryStore.request$.error.toString()}
                        </Span>
                    </TooltipHoverable>
                ) : (
                    !!request && (
                        <Span display="inline-flex" opacity="0.6" fontFamily="mono">
                            {request.estimatedTimeMS < 1000 ? (
                                '< 1s'
                            ) : (
                                <Span>≈ {toTimeLeft(request.estimatedTimeMS)}</Span>
                            )}
                            &nbsp;·&nbsp;
                            {request.estimatedCost.toStringCurrencyAmount({ decimalPlaces: 'all' })}
                        </Span>
                    )
                ))}

            <Button
                ml="4"
                isDisabled={
                    !analyticsQueryStore.request$.value || analyticsQueryStore.requestEqQuery
                }
                isLoading={
                    analyticsQueryStore.request$.isLoading ||
                    analyticsQueryStore.createQuery.isLoading
                }
                onClick={onCreate}
                size="sm"
                variant="contrast"
            >
                Run
            </Button>
        </Flex>
    );
};

export default observer(AnalyticsQueryControlPanel);
