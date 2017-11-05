export default class RandomNumberGenerator {

    private seed: number;

    constructor() {
        this.seed = 6;
    }

    getFloat() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }

    setSeed(seed) {
        this.seed = seed;
    }

}