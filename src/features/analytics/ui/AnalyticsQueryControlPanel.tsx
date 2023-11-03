import { ComponentProps, FunctionComponent } from 'react';
import { Box, Button, Flex, Skeleton } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { Span, TooltipHoverable, toTimeLeft } from 'src/shared';
import { analyticsQueryStore } from 'src/features';
import { CurrencyRate } from 'src/entities';

const AnalyticsQueryControlPanel: FunctionComponent<ComponentProps<typeof Box>> = props => {
    const request = analyticsQueryStore.request$.value;

    console.log(analyticsQueryStore.request$.error);

    return (
        <Flex {...props} align="center">
            {analyticsQueryStore.request$.isLoading && (
                <Skeleton display="inline-block" w="100px" h="20px" variant="dark" />
            )}

            {!analyticsQueryStore.request$.isLoading &&
                (analyticsQueryStore.request$.error ? (
                    <TooltipHoverable canBeShown host="Error">
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
                            <CurrencyRate
                                skeletonVariant="dark"
                                reverse
                                amount={request.estimatedCost.amount}
                                leftSign=" · $"
                            />
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
                onClick={() => analyticsQueryStore.createQuery()}
                size="sm"
                variant="contrast"
            >
                Run
            </Button>
        </Flex>
    );
};

export default observer(AnalyticsQueryControlPanel);
