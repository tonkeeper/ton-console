import { ComponentProps, FunctionComponent } from 'react';
import { Box, Button, Flex, Skeleton } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { Span, toTimeLeft } from 'src/shared';
import { analyticsQueryStore } from 'src/features';
import { CurrencyRate } from 'src/entities';

const AnalyticsQueryControlPanel: FunctionComponent<ComponentProps<typeof Box>> = props => {
    const request = analyticsQueryStore.request$.value;

    return (
        <Flex {...props} align="center">
            {analyticsQueryStore.request$.isLoading && (
                <Skeleton display="inline-block" w="100px" h="20px" variant="dark" />
            )}

            {request && !analyticsQueryStore.request$.isLoading && (
                <Span display="inline-flex" opacity="0.6" fontFamily="mono">
                    <Span>≈ {toTimeLeft(request.estimatedTimeMS)}</Span>
                    <CurrencyRate
                        skeletonVariant="dark"
                        reverse
                        amount={request.estimatedCost.amount}
                        leftSign=" · $"
                    />
                </Span>
            )}

            <Button
                ml="4"
                isDisabled={!analyticsQueryStore.request$.value}
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
