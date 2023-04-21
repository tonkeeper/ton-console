import BigNumber from 'bignumber.js';
import { CurrencyAmount } from 'src/shared';

export function createTransferLink(
    address: string,
    amount?: string | number | BigNumber | CurrencyAmount
): string {
    const link = `https://app.tonkeeper.com/transfer/${address}`;
    if (!amount) {
        return link;
    }

    let value: string;
    if (typeof amount === 'object' && 'amount' in amount) {
        value = amount.weiAmount.toFixed(0);
    } else {
        value = new BigNumber(amount).toFixed(0);
    }
    return `${link}?amount=${value}`;
}
