export const numberMask = numberMaskWithPrecision(2);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function numberMaskWithPrecision(precision: number) {
    return {
        mask: Number,
        scale: precision,
        signed: false,
        thousandsSeparator: '',
        padFractionalZeros: false,
        normalizeZeros: true,
        radix: '.',
        mapToRadix: ['.', ','],
        min: 0
    };
}
