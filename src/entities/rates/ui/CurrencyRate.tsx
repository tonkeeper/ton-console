import { ComponentProps, FunctionComponent, PropsWithChildren, useState } from 'react';
import { Box, Skeleton, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { Amount, CRYPTO_CURRENCY, getWindow, subtractPixels } from 'src/shared';
import { ratesStore } from 'src/entities/rates';
import { computed } from 'mobx';
import BigNumber from 'bignumber.js';
const CurrencyRate: FunctionComponent<
    PropsWithChildren<
        ComponentProps<typeof Text> & {
            showSkeletonOnUpdate?: boolean;
            leftSign?: string;
            currency: CRYPTO_CURRENCY;
            amount?: Amount;
            skeletonWidth?: string | number;
            precision?: number;
            reverse?: boolean;
            amountLoading?: boolean;
            contentUnderSkeleton?: string;
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
    reverse,
    amountLoading,
    contentUnderSkeleton,
    ...rest
}) => {
    const sign = leftSign === undefined ? '$' : leftSign;
    const precisionWithFallback = precision === undefined ? 2 : precision;
    const [skeletonHeight, setSkeletonHeight] = useState('30px');
    const rate$ = ratesStore.rates$[currency as CRYPTO_CURRENCY];

    const ref = (element: HTMLElement | null): void => {
        const window = getWindow();
        if (element && window) {
            const lineHeight = window.getComputedStyle(element).lineHeight;
            setSkeletonHeight(subtractPixels(lineHeight, '8'));
        }
    };

    const value = computed(() => {
        if (amount === undefined) {
            return undefined;
        }

        const rate = ratesStore.rates$[currency as CRYPTO_CURRENCY].value;

        const result = reverse ? new BigNumber(amount).div(rate) : rate.multipliedBy(amount);

        return result.decimalPlaces(precisionWithFallback).toString();
    });

    return (
        <Text ref={ref} as={Box} alignItems="center" display="flex" {...rest}>
            {amountLoading || !rate$.isResolved || (rate$.isLoading && showSkeletonOnUpdate) ? (
                <Skeleton display="inline-block" w={skeletonWidth || '40px'} h={skeletonHeight} />
            ) : value.get() !== undefined ? (
                sign + value + (contentUnderSkeleton || '')
            ) : (
                ''
            )}
            {value.get() !== undefined && children}
        </Text>
    );
};

export default observer(CurrencyRate);
