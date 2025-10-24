import { ComponentProps, FC, PropsWithChildren, useState } from 'react';
import { Box, Skeleton, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { Amount, CRYPTO_CURRENCY, getWindow, subtractPixels } from 'src/shared';
import { ratesStore } from 'src/entities/rates';
import { computed } from 'mobx';
import BigNumber from 'bignumber.js';

const CurrencyRate: FC<
    PropsWithChildren<
        ComponentProps<typeof Text> & {
            showSkeletonOnUpdate?: boolean;
            skeletonVariant?: string;
            leftSign?: string;
            currency?: CRYPTO_CURRENCY;
            amount?: Amount;
            skeletonWidth?: string | number;
            precision?: number;
            reverse?: boolean;
            amountLoading?: boolean;
            contentUnderSkeleton?: string;
            thousandSeparators?: boolean;
        }
    >
> = ({
    children,
    skeletonVariant,
    showSkeletonOnUpdate,
    leftSign,
    currency = CRYPTO_CURRENCY.TON,
    amount,
    skeletonWidth,
    precision,
    reverse,
    amountLoading,
    contentUnderSkeleton,
    thousandSeparators,
    ...rest
}) => {
    const sign = leftSign === undefined ? '' : leftSign;
    const precisionWithFallback = precision === undefined ? 2 : precision;
    const thousandSeparatorsWithFallback =
        thousandSeparators === undefined ? true : thousandSeparators;
    const [skeletonHeight, setSkeletonHeight] = useState('30px');
    const rate$ = ratesStore.rates$[currency];

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

        const format = {
            decimalSeparator: '.',
            groupSeparator: thousandSeparatorsWithFallback ? ' ' : '',
            groupSize: 3
        };

        return {
            fiendly: result
                .decimalPlaces(precisionWithFallback, BigNumber.ROUND_CEIL)
                .toFormat(format),
            full: result.toString()
        };
    });

    return (
        <Text
            ref={ref}
            as={Box}
            alignItems="center"
            display="flex"
            title={value.get()?.full}
            {...rest}
        >
            {amountLoading || !rate$.isResolved || (rate$.isLoading && showSkeletonOnUpdate) ? (
                <Skeleton
                    display="inline-block"
                    w={skeletonWidth || '40px'}
                    h={skeletonHeight}
                    variant={skeletonVariant}
                />
            ) : value.get()?.fiendly !== undefined ? (
                sign + value.get()?.fiendly + (contentUnderSkeleton || '')
            ) : (
                ''
            )}
            {value.get() !== undefined && children}
        </Text>
    );
};

export default observer(CurrencyRate);
