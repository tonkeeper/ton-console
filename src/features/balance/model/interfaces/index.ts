export type Balance = {
    total: number;
    usdt: {
        amount: bigint;
        promo_amount: bigint;
    };
    ton?: {
        amount: bigint;
        promo_amount: bigint;
    };
};

export type SufficiencyCheckResult = {
    canPay: boolean;
    usdt: {
        sufficient: boolean;
        deficit: bigint;
    };
    ton?: {
        sufficient: boolean;
        deficit: bigint;
    };
};
