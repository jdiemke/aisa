export class Interpolator {

    public static interpolate(start: number, end: number, current: number): number {
        if (current <= start) {
            return 0;
        }
        if (current >= end) {
            return 1;
        }
        return (current - start) / (end - start);
    }

    public static cosineInterpolate(y1: number, y2: number, mu: number): number {
        if (mu <= y1) { return 0; }
        if (mu >= y2) { return 1; }
        const mu2 = (mu - y1) / (y2 - y1);
        return (1 - Math.cos(mu2 * Math.PI)) / 2;
    }

}
