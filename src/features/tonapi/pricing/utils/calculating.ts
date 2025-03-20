interface WebhooksTier {
    limit: number;
    price: number;
}

interface WebhooksPricingTiers {
    accounts: WebhooksTier[];
    messages: WebhooksTier[];
}

export const WebhookTiers: WebhooksPricingTiers = {
    accounts: [
        { limit: 1_000_000, price: 60 },
        { limit: 10_000_000, price: 15 },
        { limit: Infinity, price: 6 }
    ],
    messages: [
        { limit: 1_000_000, price: 300 },
        { limit: 10_000_000, price: 60 },
        { limit: Infinity, price: 30 }
    ]
};

function normalizeTier(tiers: WebhooksTier[]): WebhooksTier[] {
    let commulatePreviousLimits = 0;

    return tiers.map(({ limit, price }) => {
        const normalizedLimit = limit - commulatePreviousLimits;
        commulatePreviousLimits += limit;

        return { limit: normalizedLimit, price };
    });
}

function calculateAmounts(input: number, tiers: WebhooksTier[]): number {
    const normalizedTiers = normalizeTier(tiers);

    return normalizedTiers.reduce(
        (acc, { limit, price }) => {
            const value = Math.min(acc.count, limit);
            const current = (value * price) / 1_000_000;

            return {
                count: acc.count - value,
                total: acc.total + current
            };
        },
        {
            count: input,
            total: 0
        }
    ).total;
}

export function calculateExpectedPrice(accounts: number | null, messages: number | null): number {
    const accountCount = accounts ?? 0;
    const accountsPrice = calculateAmounts(accountCount, WebhookTiers.accounts);

    const messageCount = messages ?? 0;
    const messagesPrice = calculateAmounts(messageCount, WebhookTiers.messages);

    return accountsPrice + messagesPrice;
}
