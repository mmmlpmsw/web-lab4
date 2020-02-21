
export function normalizeNumber(n: number, scale: number = 5) {
    const c = 10 ** scale;

    return +(Math.round(n * c) / c).toFixed(scale);
}
