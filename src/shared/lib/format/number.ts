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
