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

    public static arrayCopy(src, srcPosition: number, dst, dstPosition: number, length: number) {
        // the index to begin splicing from dst array
        let start: number;
        let end: number;

        if (typeof length !== 'undefined') {
            end = Math.min(length, src.length);
            start = dstPosition;
            src = src.slice(srcPosition, end + srcPosition);
        } else {
            if (typeof dst !== 'undefined') {
                // src, dst, length
                // rename  so we don't get confused
                end = dst;
                end = Math.min(end, src.length);
            } else {
                // src, dst
                end = src.length;
            }

            start = 0;
            // rename  so we don't get confused
            dst = srcPosition;
            src = src.slice(0, end);
        }

        // Since we are not returning the array and JavaScript is pass by reference
        // we must modify the actual values of the array
        // instead of reassigning arrays
        Array.prototype.splice.apply(dst, [start, end].concat(src));
    }

    // This is a port of Ken Perlin's Java code. The
    // original Java code is at http://cs.nyu.edu/%7Eperlin/noise/.
    // Note that in this version, a number from 0 to 1 is returned.
    // tslint:disable-next-line:new-parens
    public static PerlinNoise = new function () {

        this.noise = (x: number, y: number, z: number) => {

            const p = new Array(512)
            const permutation = [151, 160, 137, 91, 90, 15,
                131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
                190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
                88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
                77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
                102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
                135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
                5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
                223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
                129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
                251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
                49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
                138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
            ];
            for (let i = 0; i < 256; i++)
                p[256 + i] = p[i] = permutation[i];

            const X = Math.floor(x) & 255;                              // FIND UNIT CUBE THAT
            const Y = Math.floor(y) & 255;                              // CONTAINS POINT.
            const Z = Math.floor(z) & 255;
            x -= Math.floor(x);                                         // FIND RELATIVE X,Y,Z
            y -= Math.floor(y);                                         // OF POINT IN CUBE.
            z -= Math.floor(z);
            const u = fade(x);                                          // COMPUTE FADE CURVES
            const v = fade(y);                                          // FOR EACH OF X,Y,Z.
            const w = fade(z);
            const A = p[X] + Y;
            const AA = p[A] + Z;
            const AB = p[A + 1] + Z;       // HASH COORDINATES OF
            const B = p[X + 1] + Y;
            const BA = p[B] + Z;
            const BB = p[B + 1] + Z;   // THE 8 CUBE CORNERS,

            return scale(lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z),  // AND ADD
                grad(p[BA], x - 1, y, z)), // BLENDED
                lerp(u, grad(p[AB], x, y - 1, z),  // RESULTS
                    grad(p[BB], x - 1, y - 1, z))),// FROM  8
                lerp(v, lerp(u, grad(p[AA + 1], x, y, z - 1),  // CORNERS
                    grad(p[BA + 1], x - 1, y, z - 1)), // OF CUBE
                    lerp(u, grad(p[AB + 1], x, y - 1, z - 1),
                        grad(p[BB + 1], x - 1, y - 1, z - 1)))));
        }
        function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
        function lerp(t, a, b) { return a + t * (b - a); }
        function grad(hash, x, y, z) {
            const h = hash & 15;                      // CONVERT LO 4 BITS OF HASH CODE
            const u = h < 8 ? x : y;                 // INTO 12 GRADIENT DIRECTIONS.
            const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
            return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
        }
        function scale(n) { return (1 + n) / 2; }
    }

}
