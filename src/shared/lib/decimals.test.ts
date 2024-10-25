import { fromDecimals } from './decimals';

interface TestCase {
    src: string | bigint;
    decimals: number | string;
    expected: bigint | 'Error';
}

const testCases: TestCase[] = [
    // **Valid Inputs:**

    // Simple positive numbers with fractional parts
    { src: '123.456', decimals: 3, expected: 123456n },
    { src: '123.456', decimals: 6, expected: 123456000n },
    { src: '0.000001', decimals: 6, expected: 1n },

    // Simple positive numbers without fractional parts
    { src: '1', decimals: 9, expected: 1000000000n },
    { src: '1000', decimals: 5, expected: 100000000n },
    { src: '1000.', decimals: 5, expected: 100000000n }, // Trailing decimal point

    // Negative numbers
    { src: '-1.234', decimals: 3, expected: -1234n },
    { src: '-0.00001', decimals: 5, expected: -1n },
    { src: '-0', decimals: 10, expected: 0n }, // Negative zero

    // Numbers with leading '+' sign
    { src: '+123.456', decimals: 3, expected: 123456n }, // If '+' is supported

    // Numbers with missing whole or fractional parts
    { src: '.12345', decimals: 5, expected: 12345n },
    { src: '-.12345', decimals: 5, expected: -12345n },

    // BigInt inputs
    { src: 1234567890n, decimals: 3, expected: 1234567890000n },
    { src: -1234567890n, decimals: 3, expected: -1234567890000n },

    // Edge cases with zero decimals
    { src: '1', decimals: 0, expected: 1n },
    { src: '0', decimals: 0, expected: 0n },
    { src: '-0', decimals: 0, expected: 0n },

    // Numbers with maximum decimal precision (up to 255)
    {
        src: '1.' + '1'.repeat(255),
        decimals: 255,
        expected: BigInt('1' + '1'.repeat(255))
    },
    {
        src: '0.' + '1'.repeat(255),
        decimals: 255,
        expected: BigInt('1'.repeat(255))
    },
    {
        src: '-1.' + '2'.repeat(255),
        decimals: 255,
        expected: -BigInt('1' + '2'.repeat(255))
    },
    {
        src: '999999.999999999999999999',
        decimals: 18,
        expected: 999999999999999999999999n
    },
    {
        src: '1234567890.0987654321',
        decimals: 10,
        expected: 12345678900987654321n
    },
    {
        src: '0.0000000000000000000000000001',
        decimals: 28,
        expected: 1n
    },

    // **Invalid Inputs:**

    // Empty string
    { src: '', decimals: 3, expected: 'Error' },

    // Standalone decimal point
    { src: '.', decimals: 3, expected: 'Error' },

    // Zero decimals with decimal point
    { src: '123.0', decimals: 0, expected: 'Error' },
    { src: '.0', decimals: 0, expected: 'Error' },

    // Multiple decimal points
    { src: '123.45.67', decimals: 3, expected: 'Error' },

    // Non-digit characters
    { src: 'abc', decimals: 3, expected: 'Error' },
    { src: '123a.456', decimals: 3, expected: 'Error' },
    { src: '123.45b', decimals: 3, expected: 'Error' },

    // Too many decimal places
    { src: '123.4567', decimals: 3, expected: 'Error' },

    // Invalid decimals values
    { src: '123.456', decimals: -1, expected: 'Error' },
    { src: '123.456', decimals: 256, expected: 'Error' },
    { src: '123.456', decimals: 'invalid', expected: 'Error' }, // Non-numeric decimals

    // Invalid sign usage
    // { src: '--123.456', decimals: 3, expected: 'Error' }, // valid ??
    // { src: '-+123.456', decimals: 3, expected: 'Error' }, // valid ??
    { src: '+-123.456', decimals: 3, expected: 'Error' },
    { src: '++123.456', decimals: 3, expected: 'Error' }
];

describe('fromDecimals Function Tests', () => {
    testCases.forEach(({ src, decimals, expected }, index) => {
        const testCaseDescription = `Test Case #${index + 1}: fromDecimals("${src}", ${decimals})`;

        if (expected === 'Error') {
            it(`${testCaseDescription} should throw an error`, () => {
                expect(() => fromDecimals(src, decimals)).toThrow();
            });
        } else {
            it(`${testCaseDescription} should return ${expected}`, () => {
                expect(fromDecimals(src, decimals)).toBe(expected);
            });
        }
    });
});
