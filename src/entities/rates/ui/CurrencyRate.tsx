import { FC, PropsWithChildren, useState, useMemo } from 'react';
import { Box, Skeleton, Text, TextProps } from '@chakra-ui/react';
import { Amount, CRYPTO_CURRENCY, getWindow, subtractPixels } from 'src/shared';
import { useRateQuery } from 'src/entities/rates';
import BigNumber from 'bignumber.js';

const CurrencyRate: FC<
    PropsWithChildren<
        TextProps & {
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
    const { data: rate, isLoading } = useRateQuery(currency);

    const ref = (element: HTMLElement | null): void => {
        const window = getWindow();
        if (element && window) {
            const lineHeight = window.getComputedStyle(element).lineHeight;
            setSkeletonHeight(subtractPixels(lineHeight, '8'));
        }
    };

    const value = useMemo(() => {
        if (amount === undefined || !rate) {
            return undefined;
        }

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
    }, [amount, rate, reverse, precisionWithFallback, thousandSeparatorsWithFallback]);

    return (
        <Text
            ref={ref}
            as={Box}
            alignItems="center"
            display="flex"
            title={value?.full}
            {...rest}
        >
            {amountLoading || isLoading && showSkeletonOnUpdate ? (
                <Skeleton
                    display="inline-block"
                    w={skeletonWidth || '40px'}
                    h={skeletonHeight}
                    variant={skeletonVariant}
                />
            ) : value?.fiendly !== undefined ? (
                sign + value.fiendly + (contentUnderSkeleton || '')
            ) : (
                ''
            )}
            {value !== undefined && children}
        </Text>
    );
};

export default CurrencyRate;
