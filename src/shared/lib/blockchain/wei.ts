import BigNumber from 'bignumber.js';

export function toWei(value: string | number | BigNumber, decimals: number): BigNumber {
    return new BigNumber(value).multipliedBy(new BigNumber(10).pow(decimals));
}

export function fromWei(value: string | number | BigNumber, decimals: number): BigNumber {
    return new BigNumber(value).div(new BigNumber(10).pow(decimals));
}
