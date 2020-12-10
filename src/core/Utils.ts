export class Utils {
    /**
     * Returns a number whose value is limited to the given range.
     *
     * Example: limit the output of this computation to between 0 and 255
     * (x * 255).clamp(0, 255)
     *
     * @param {Number} min The lower boundary of the output range
     * @param {Number} max The upper boundary of the output range
     * @returns A number in the range [min, max]
     * @type Number
     */
    public static clamp(input: number, min: number, max: number): number {
        return Math.min(Math.max(input, min), max);
    };

    /**
     * Re-maps a number from one range to another.
     *
     * @param  {number} value           the incoming value to be converted
     * @param  {number} istart          lower bound of the value's current range
     * @param  {number} istop           upper bound of the value's current range
     * @param  {number} ostart          lower bound of the value's target range
     * @param  {number} ostop           upper bound of the value's target range
     */
    public static map(value: number, istart: number, istop: number, ostart: number, ostop: number): number {
        return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
    }

    /**
     * returns random integer between two values
     *
     * @param  {number} value           the incoming value to be converted
     */
    public static getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }

}
