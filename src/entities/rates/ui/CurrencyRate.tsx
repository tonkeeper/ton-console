import { ComponentProps, FunctionComponent, PropsWithChildren, useState } from 'react';
import { Skeleton, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { Amount, CURRENCY, getWindow, subtractPixels } from 'src/shared';
import { ratesStore } from 'src/entities/rates';
import { computed } from 'mobx';
const CurrencyRate: FunctionComponent<
    PropsWithChildren<
        ComponentProps<typeof Text> & {
            showSkeletonOnUpdate?: boolean;
            leftSign?: string;
            currency: CURRENCY;
            amount: Amount;
            skeletonWidth?: string | number;
            precision?: number;
        }
    >
> = ({
    children,
    showSkeletonOnUpdate,
    leftSign,
    currency,
    amount,
    skeletonWidth,
    precision,
    ...rest
}) => {
    const sign = leftSign === undefined ? '$' : leftSign;
    const precisionWithFallback = precision === undefined ? 2 : precision;
    const [skeletonHeight, setSkeletonHeight] = useState('30px');
    const rate$ = ratesStore.rates$[currency as CURRENCY];

    const ref = (element: HTMLElement | null): void => {
        const window = getWindow();
        if (element && window) {
            const lineHeight = window.getComputedStyle(element).lineHeight;
            setSkeletonHeight(subtractPixels(lineHeight, '8'));
        }
    };

    const value = computed(() =>
        ratesStore.rates$[currency as CURRENCY].value
            .multipliedBy(amount)
            .decimalPlaces(precisionWithFallback)
            .toString()
    );

    return (
        <Text ref={ref} alignItems="center" display="flex" {...rest}>
            {!rate$.isResolved || (rate$.isLoading && showSkeletonOnUpdate) ? (
                <Skeleton display="inline-block" w={skeletonWidth || '40px'} h={skeletonHeight} />
            ) : (
                sign + value
            )}
            {children}
        </Text>
    );
};

export default observer(CurrencyRate);
