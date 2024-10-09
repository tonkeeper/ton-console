import BigNumber from 'bignumber.js';

const suffixes = {
    1000: 'K',
    1_000_000: 'M',
    1_000_000_000: 'B'
};

export function formatWithSuffix(value: number | string | BigNumber, decimalPlaces = 1): string {
    const nValue = new BigNumber(value);

    for (const pair of Object.entries(suffixes).reverse()) {
        const [limit, suffix] = pair;
        if (nValue.gt(limit)) {
            return nValue.div(limit).decimalPlaces(decimalPlaces).toString() + suffix;
        }
    }

    return nValue.decimalPlaces(decimalPlaces).toString();
}

export function formatNumber(
    value: number | string | BigNumber,
    options?: {
        decimalPlaces?: number | null;
        thousandSeparators?: boolean;
        roundingMode?: BigNumber.RoundingMode;
    }
): string {
    let decimalPlaces = options?.decimalPlaces === undefined ? 2 : options.decimalPlaces;
    const roundingMode = options?.roundingMode || BigNumber.ROUND_CEIL;

    const bnVal = new BigNumber(value);

    if (bnVal.gt(0) && decimalPlaces !== null && bnVal.lt(new BigNumber(10).pow(-decimalPlaces))) {
        decimalPlaces =
            bnVal
                .toFixed()
                .split('')
                .findIndex(a => a !== '0' && a !== '.') - 1;
    }

    const thousandSeparators =
        options?.thousandSeparators === undefined ? true : options.thousandSeparators;

    const format = {
        decimalSeparator: '.',
        groupSeparator: thousandSeparators ? ' ' : '',
        groupSize: 3
    };

    const res = decimalPlaces
        ? new BigNumber(value).decimalPlaces(decimalPlaces, roundingMode)
        : new BigNumber(value);

    return res.toFormat(format);
}
