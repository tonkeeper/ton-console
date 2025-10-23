import BigNumber from 'bignumber.js';
import { TokenCurrencyAmount } from 'src/shared';

export function createTransferLink(
    address: string,
    options?: {
        amount?: string | number | BigNumber | TokenCurrencyAmount;
        text?: string;
        exp?: Date | number | string;
        jetton?: string;
    }
): string {
    const baseUrl = 'https://app.tonkeeper.com/transfer';
    const link = new URL(address ? `${baseUrl}/${address}` : baseUrl);

    if (options?.jetton) {
        link.searchParams.append('jetton', options.jetton);
    }

    if (options?.amount) {
        let value: string;
        if (typeof options.amount === 'object' && 'amount' in options.amount) {
            value = options.amount.weiAmount.toFixed(0);
        } else {
            value = new BigNumber(options.amount).toFixed(0);
        }
        link.searchParams.append('amount', value);
    }

    if (options?.text) {
        link.searchParams.append('text', encodeURIComponent(options.text));
    }

    if (options?.exp) {
        link.searchParams.append(
            'exp',
            options.exp instanceof Date
                ? Math.floor(options.exp.getTime() / 1000).toString()
                : options.exp.toString()
        );
    }

    return link.toString();
}
