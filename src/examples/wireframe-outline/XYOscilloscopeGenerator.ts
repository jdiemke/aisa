import { Framebuffer } from '../../Framebuffer';
import { WavEncoder } from './WavEncoder';

interface Point2D {
    x: number;
    y: number;
}

/**
 * Generates XY-mode oscilloscope audio from wireframe outline pixels.
 *
 * Pipeline:
 *  1. Scan the rendered framebuffer for outline (non-background) pixels.
 *  2. Order them into a continuous beam-trace path using nearest-neighbour
 *     traversal with a spatial-grid index for speed.
 *  3. Close the loop and resample the path at constant arc-length speed.
 *  4. Output stereo audio: Left = X, Right = Y (normalised to [-1, 1]).
 */
export class XYOscilloscopeGenerator {

    // ------------------------------------------------------------------ //
    //  Step 1 – Extract outline pixel coordinates
    // ------------------------------------------------------------------ //

    /**
     * Collect every pixel whose packed colour differs from the background.
     * Works with any outline/background colour combination.
     *
     * @param backgroundColor Packed ARGB background colour.
     *        Default 0xFFFFFFFF (white) matches the WireframeOutlineScene.
     */
    public static extractOutlinePixels(
        framebuffer: Framebuffer,
        backgroundColor: number = 0xFFFFFFFF
    ): Point2D[] {
        const pixels: Point2D[] = [];
        const fb = framebuffer.framebuffer;
        const w = framebuffer.width;
        const h = framebuffer.height;

        for (let y = 0; y < h; y++) {
            const row = y * w;
            for (let x = 0; x < w; x++) {
                if (fb[row + x] !== backgroundColor) {
                    pixels.push({ x, y });
                }
            }
        }
        return pixels;
    }

    // ------------------------------------------------------------------ //
    //  Step 2 – Order pixels into a continuous path (nearest-neighbour)
    // ------------------------------------------------------------------ //

    /**
     * Sort points by nearest-neighbour distance to avoid long jumps.
     *
     * Matches the rasterToVector approach from Beams of Light / nice3d:
     * for each point, sort all remaining points by distance from the
     * current pivot so the closest one ends up next.  The beam jumps
     * directly to each point (no interpolation between them).
     */
    public static orderPixelsIntoPath(
        pixels: Point2D[],
        _gridWidth: number,
        _gridHeight: number
    ): Point2D[] {
        const n = pixels.length;
        if (n <= 2) return pixels.slice();

        // Work on a mutable copy so we can sort sub-arrays in-place
        const pts = pixels.slice();

        for (let i = 1; i < n - 2; i++) {
            const px = pts[i - 1].x;
            const py = pts[i - 1].y;

            // Sort pts[i .. n-2] by squared distance from the pivot pts[i-1]
            const sub = pts.slice(i, n - 1);
            sub.sort((a, b) => {
                const da = (a.x - px) * (a.x - px) + (a.y - py) * (a.y - py);
                const db = (b.x - px) * (b.x - px) + (b.y - py) * (b.y - py);
                return da - db;
            });
            for (let j = 0; j < sub.length; j++) {
                pts[i + j] = sub[j];
            }
        }

        return pts;
    }

    // ------------------------------------------------------------------ //
    //  Step 3 – Generate XY audio samples from the ordered path
    // ------------------------------------------------------------------ //

    /**
     * Traverse the closed path at constant speed, looping continuously to
     * fill the requested duration.
     *
     * Segments longer than `jumpThreshold` pixels are treated as instant
     * teleports — the beam snaps to the destination without drawing a
     * line, avoiding stray lines between disconnected outline regions.
     *
     * @param traceHz How many complete loops per second (oscilloscope refresh
     *        rate).  Higher values = brighter / more stable display, but
     *        lower resolution per trace.  30 Hz is a good default.
     * @param jumpThreshold  Maximum pixel distance for a "real" segment.
     *        Any gap larger than this is a teleport (default 5 px).
     */
    public static generateAudio(
        path: Point2D[],
        width: number,
        height: number,
        sampleRate: number,
        durationSeconds: number,
        traceHz: number = 30,
        jumpThreshold: number = 5,
        xyzMode: boolean = false
    ): { left: Float32Array; right: Float32Array; z?: Float32Array } {
        const totalSamples = Math.floor(sampleRate * durationSeconds);
        const left = new Float32Array(totalSamples);
        const right = new Float32Array(totalSamples);
        const z = xyzMode ? new Float32Array(totalSamples) : undefined;

        if (path.length === 0) return { left, right, z };

        if (path.length === 1) {
            const nx = (path[0].x / width) * 2 - 1;
            const ny = -((path[0].y / height) * 2 - 1);
            left.fill(nx);
            right.fill(ny);
            if (z) z.fill(1); // beam on
            return { left, right, z };
        }

        const jumpSq = jumpThreshold * jumpThreshold;

        // Build cumulative arc-length, treating long jumps as zero-length
        // so the beam teleports instantly across them.
        const segReal: Float64Array = new Float64Array(path.length);
        const isJump: Uint8Array = new Uint8Array(path.length);
        const cumDist: Float64Array = new Float64Array(path.length);
        cumDist[0] = 0;

        for (let i = 1; i < path.length; i++) {
            const dx = path[i].x - path[i - 1].x;
            const dy = path[i].y - path[i - 1].y;
            const d2 = dx * dx + dy * dy;
            if (d2 > jumpSq) {
                isJump[i] = 1;
                segReal[i] = 0;
            } else {
                segReal[i] = Math.sqrt(d2);
            }
            cumDist[i] = cumDist[i - 1] + segReal[i];
        }

        // Closing segment (last → first)
        const closeDx = path[0].x - path[path.length - 1].x;
        const closeDy = path[0].y - path[path.length - 1].y;
        const closeD2 = closeDx * closeDx + closeDy * closeDy;
        const closeIsJump = closeD2 > jumpSq;
        const closeLen = closeIsJump ? 0 : Math.sqrt(closeD2);
        const totalLength = cumDist[path.length - 1] + closeLen;

        if (totalLength === 0) {
            const pointsPerSample = path.length / totalSamples;
            for (let s = 0; s < totalSamples; s++) {
                const idx = Math.min(Math.floor(s * pointsPerSample), path.length - 1);
                left[s] = (path[idx].x / width) * 2 - 1;
                right[s] = -((path[idx].y / height) * 2 - 1);
                if (z) z[s] = 1;
            }
            return { left, right, z };
        }

        const totalCycles = Math.max(1, Math.round(traceHz * durationSeconds));

        for (let s = 0; s < totalSamples; s++) {
            const cyclePos = ((s * totalCycles / totalSamples) % 1) * totalLength;

            let x: number;
            let y: number;
            let beamOn = true;

            if (cyclePos >= cumDist[path.length - 1]) {
                if (closeIsJump || closeLen === 0) {
                    x = path[0].x;
                    y = path[0].y;
                    beamOn = false;
                } else {
                    const t = (cyclePos - cumDist[path.length - 1]) / closeLen;
                    x = path[path.length - 1].x + t * closeDx;
                    y = path[path.length - 1].y + t * closeDy;
                }
            } else {
                let lo = 0;
                let hi = path.length - 1;
                while (lo < hi - 1) {
                    const mid = (lo + hi) >> 1;
                    if (cumDist[mid] <= cyclePos) lo = mid;
                    else hi = mid;
                }

                if (isJump[lo + 1]) {
                    x = path[lo + 1].x;
                    y = path[lo + 1].y;
                    beamOn = false;
                } else {
                    const segLen = segReal[lo + 1];
                    const t = segLen > 0 ? (cyclePos - cumDist[lo]) / segLen : 0;
                    x = path[lo].x + t * (path[lo + 1].x - path[lo].x);
                    y = path[lo].y + t * (path[lo + 1].y - path[lo].y);
                }
            }

            left[s] = (x / width) * 2 - 1;
            right[s] = -((y / height) * 2 - 1);
            if (z) z[s] = beamOn ? 1 : -1;
        }

        return { left, right, z };
    }

    // ------------------------------------------------------------------ //
    //  Convenience – full pipeline in one call
    // ------------------------------------------------------------------ //

    /**
     * Evenly subsample a sorted path down to at most `maxPoints` entries.
     * Picks points at evenly-spaced indices so the spatial distribution
     * stays representative of the original outline.
     */
    public static decimatePath(
        path: Point2D[],
        maxPoints: number
    ): Point2D[] {
        if (maxPoints <= 0 || path.length <= maxPoints) return path;

        const result: Point2D[] = new Array(maxPoints);
        for (let i = 0; i < maxPoints; i++) {
            const idx = Math.floor(i * path.length / maxPoints);
            result[i] = path[idx];
        }
        return result;
    }

    /**
     * Generate an animated WAV by calling `renderFrame` at successive
     * time steps.  Yields to the browser between frames so the UI
     * stays responsive.
     *
     * @param renderFrame  Called with `(framebuffer, timeMs)` to render
     *                     a single animation frame (same signature as
     *                     AbstractScene.render).
     * @param onProgress   Optional callback invoked after each frame
     *                     with `(currentFrame, totalFrames)`.
     */
    public static async generateWav(
        framebuffer: Framebuffer,
        sampleRate: number,
        durationSeconds: number,
        traceHz: number = 30,
        maxPoints: number = 0,
        backgroundColor: number = 0xFFFFFFFF,
        renderFrame?: (fb: Framebuffer, timeMs: number) => void,
        onProgress?: (current: number, total: number) => void,
        xyzMode: boolean = false
    ): Promise<Blob> {
        const totalSamples = Math.floor(sampleRate * durationSeconds);
        const left = new Float32Array(totalSamples);
        const right = new Float32Array(totalSamples);
        const z = xyzMode ? new Float32Array(totalSamples) : undefined;

        const fps = traceHz;
        const totalFrames = Math.max(1, Math.round(fps * durationSeconds));
        const samplesPerFrame = Math.floor(totalSamples / totalFrames);

        let sampleOffset = 0;

        for (let f = 0; f < totalFrames; f++) {
            const timeMs = (f / fps) * 1000;

            if (renderFrame) {
                renderFrame(framebuffer, timeMs);
            }

            const pixels = this.extractOutlinePixels(framebuffer, backgroundColor);
            let path = this.orderPixelsIntoPath(
                pixels, framebuffer.width, framebuffer.height
            );
            if (maxPoints > 0) {
                path = this.decimatePath(path, maxPoints);
            }

            const frameSamples = (f < totalFrames - 1)
                ? samplesPerFrame
                : totalSamples - sampleOffset;

            const frameAudio = this.generateAudio(
                path, framebuffer.width, framebuffer.height,
                sampleRate, frameSamples / sampleRate, 1, 5, xyzMode
            );

            left.set(frameAudio.left, sampleOffset);
            right.set(frameAudio.right, sampleOffset);
            if (z && frameAudio.z) z.set(frameAudio.z, sampleOffset);
            sampleOffset += frameSamples;

            if (onProgress) {
                onProgress(f + 1, totalFrames);
            }

            await new Promise<void>(resolve => setTimeout(resolve, 0));
        }

        const channels: Float32Array[] = z
            ? [left, right, z]
            : [left, right];
        return WavEncoder.encodeChannels(channels, sampleRate);
    }
}
