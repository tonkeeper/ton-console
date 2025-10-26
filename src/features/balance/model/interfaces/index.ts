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
