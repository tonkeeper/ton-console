import { calculateExpectedPrice } from './calculating';

describe('calculateExpectedPrice', () => {
    it('should calculate price for 500k accounts and 700k messages', () => {
        const accounts = 500_000;
        const messages = 700_000;
        const expectedPrice = 80; // 0.5 * 20$ + 0.7 * 100$ = 10 + 70 = 80
        const price = calculateExpectedPrice(accounts, messages);
        expect(price).toBe(expectedPrice);
    });

    it('should calculate price for 5 million accounts and 20 million messages', () => {
        const accounts = 5_000_000;
        const messages = 20_000_000;
        const expectedPrice = 20 + 20 + 100 + 180 + 100;
        // 1 million accounts at $20 = $20
        // 4 million accounts at $5 = $20

        // 1 million messages at $100 = $100
        // 9 million messages at $20 = $180
        // 10 million messages at $10 = $100
        const price = calculateExpectedPrice(accounts, messages);
        expect(price).toBe(expectedPrice);
    });

    it('should calculate price for 0 accounts and 0 messages', () => {
        const accounts = 0;
        const messages = 0;
        const expectedPrice = 0;
        const price = calculateExpectedPrice(accounts, messages);
        expect(price).toBe(expectedPrice);
    });

    it('should calculate price for 1 million accounts and 1 million messages', () => {
        const accounts = 1_000_000;
        const messages = 1_000_000;
        const expectedPrice = 120; // 1 * 20$ + 1 * 100$ = 20 + 100 = 120
        const price = calculateExpectedPrice(accounts, messages);
        expect(price).toBe(expectedPrice);
    });

    it('should calculate price for 15 million accounts and 50 million messages', () => {
        const accounts = 15_000_000;
        const messages = 50_000_000;
        const expectedPrice = 75 + 100 + 400 + 180;
        // 1 million accounts at $20 = $20
        // 9 million accounts at $5 = $45
        // 5 million accounts at $2 = $10

        // 1 million messages at $100 = $100
        // 9 million messages at $20 = $180
        // 40 million messages at $10 = $400
        const price = calculateExpectedPrice(accounts, messages);
        expect(price).toBe(expectedPrice);
    });

    it('should calculate price for 15.3 million accounts and 50.7 million messages', () => {
        const accounts = 15_300_000;
        const messages = 50_700_000;
        const expectedPrice = 20 + 45 + 10.6 + 100 + 180 + 407;
        // 1 million accounts at $20 = $20
        // 9 million accounts at $5 = $45
        // 5.3 million accounts at $2 = $10.6

        // 1 million messages at $100 = $100
        // 9 million messages at $20 = $180
        // 40.7 million messages at $10 = $407
        const price = calculateExpectedPrice(accounts, messages);
        expect(price).toBe(expectedPrice);
    });
});
