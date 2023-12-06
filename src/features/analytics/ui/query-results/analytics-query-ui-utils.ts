export function removeOutliers(numbers: number[]): number[] {
    const average = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    const variance =
        numbers.reduce((sum, num) => sum + Math.pow(num - average, 2), 0) / numbers.length;
    const standardDeviation = Math.sqrt(variance);
    const threshold = 2 * standardDeviation;

    return numbers.filter(num => num <= average + threshold);
}

let canvas: HTMLCanvasElement | undefined;
let context: CanvasRenderingContext2D | undefined;
let font: string | undefined;
export function getTextWidth(text: string, useFont = 'normal 12px monospace'): number {
    canvas ||= document.createElement('canvas');
    context ||= canvas.getContext('2d')!;
    if (font !== useFont) {
        context.font = useFont;
    }
    const metrics = context.measureText(text);
    return metrics.width;
}

export function getTHWidth(textWidth: number, isEdge: boolean): number {
    const px = 24;
    const edgePadding = isEdge ? 16 : 0;
    return textWidth + 2 * px + edgePadding;
}
