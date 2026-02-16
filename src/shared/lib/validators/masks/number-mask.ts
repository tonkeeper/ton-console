export const numberMask = numberMaskWithPrecision(2);

 
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
