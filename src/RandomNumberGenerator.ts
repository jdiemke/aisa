export default class RandomNumberGenerator {

    private seed: number;

    public constructor() {
        this.seed = 6;
    }

    public getFloat(): number {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }

    public setSeed(seed: number): void {
        this.seed = seed;
    }

}
