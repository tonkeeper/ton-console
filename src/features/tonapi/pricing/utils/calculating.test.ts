import { describe, it, expect } from 'vitest';
import { calculateExpectedPrice } from './calculating';

describe('calculateExpectedPrice', () => {
    it('should calculate price for 500k accounts and 700k messages', () => {
        const accounts = 500_000;
        const messages = 700_000;
        const expectedPrice = 240; // 0.5 * $60 + 0.7 * $300 = 30 + 210 = 240
        const price = calculateExpectedPrice(accounts, messages);
        expect(price).toBe(expectedPrice);
    });

    it('should calculate price for 5 million accounts and 20 million messages', () => {
        const accounts = 5_000_000;
        const messages = 20_000_000;
        const expectedPrice = 60 + 60 + 300 + 540 + 300;
        // 1 million accounts at $60 = $60
        // 4 million accounts at $15 = $60

        // 1 million messages at $300 = $300
        // 9 million messages at $60 = $540
        // 10 million messages at $30 = $300
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
        const expectedPrice = 360; // 1 * $60 + 1 * $300 = 60 + 300 = 360
        const price = calculateExpectedPrice(accounts, messages);
        expect(price).toBe(expectedPrice);
    });

    it('should calculate price for 15 million accounts and 50 million messages', () => {
        const accounts = 15_000_000;
        const messages = 50_000_000;
        const expectedPrice = 225 + 300 + 540 + 1200;
        // 1 million accounts at $60 = $60
        // 9 million accounts at $15 = $135
        // 5 million accounts at $6 = $30

        // 1 million messages at $300 = $300
        // 9 million messages at $60 = $540
        // 40 million messages at $30 = $1200
        const price = calculateExpectedPrice(accounts, messages);
        expect(price).toBe(expectedPrice);
    });

    it('should calculate price for 15.3 million accounts and 50.7 million messages', () => {
        const accounts = 15_300_000;
        const messages = 50_700_000;
        const expectedPrice = 60 + 135 + 31.8 + 300 + 540 + 1221;
        // 1 million accounts at $60 = $60
        // 9 million accounts at $15 = $135
        // 5.3 million accounts at $6 = $31.8

        // 1 million messages at $300 = $300
        // 9 million messages at $60 = $540
        // 40.7 million messages at $30 = $1221
        const price = calculateExpectedPrice(accounts, messages);
        expect(price).toBe(expectedPrice);
    });
});
