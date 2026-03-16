import { Framebuffer } from '../Framebuffer';
import { FlatshadedMesh } from '../geometrical-objects/FlatshadedMesh';
import { Vector4f } from '../math/Vector4f';
import { AbstractRenderingPipeline } from './AbstractRenderingPipeline';

/**
 * A rendering pipeline that produces wireframe outlines using the surface-ID
 * edge-detection technique described by Omar Shehata:
 * https://omar-shehata.medium.com/better-outline-rendering-using-surface-ids-with-webgl-e13cdab1fd94
 *
 * For each frame the pipeline:
 *  1. Rasterizes every visible triangle into a per-pixel surface-ID buffer
 *     and the depth buffer (hidden-surface removal).
 *  2. Runs a post-process pass that detects edges by comparing each pixel's
 *     surface ID and depth with its four direct neighbours.
 *  3. Writes detected outline pixels into the colour framebuffer.
 *
 * Surface IDs are computed once from the mesh topology using a union-find
 * algorithm that groups faces sharing vertex indices into connected
 * components (surfaces).
 *
 * Lines are intentionally NOT antialiased — all edges are drawn at native
 * pixel resolution.
 */
export class WireFrameRenderingPipeline extends AbstractRenderingPipeline {

    /** Per-pixel surface ID buffer (0 = background / no geometry). */
    private surfaceIdBuffer: Uint32Array;

    /** Outline colour (packed ARGB). */
    private outlineColor: number = 0xFF000000; // black

    /** Background colour (packed ARGB). */
    private backgroundColor: number = 0xFFFFFFFF; // white

    /** Depth-discontinuity threshold for silhouette edges. */
    private depthThreshold: number = 0.02;

    /** Cached per-face surface IDs for the current mesh. */
    private faceSurfaceIds: number[] | null = null;

    constructor(framebuffer: Framebuffer) {
        super(framebuffer);
        const size = framebuffer.width * framebuffer.height;
        this.surfaceIdBuffer = new Uint32Array(size);
    }

    // ── Configuration ──────────────────────────────────────────────

    public setOutlineColor(color: number): void {
        this.outlineColor = color;
    }

    public setBackgroundColor(color: number): void {
        this.backgroundColor = color;
    }

    public setDepthThreshold(threshold: number): void {
        this.depthThreshold = threshold;
    }

    public setFramebuffer(framebuffer: Framebuffer): void {
        this.framebuffer = framebuffer;
        const size = framebuffer.width * framebuffer.height;
        if (this.surfaceIdBuffer.length !== size) {
            this.surfaceIdBuffer = new Uint32Array(size);
        }
    }

    // ── Surface-ID computation (union-find + vertex welding) ──────

    /**
     * Computes a unique surface ID per connected component of the mesh.
     *
     * Before running the union-find, duplicate vertices sitting at the
     * same spatial position are **welded** together (index-remapped) so
     * that triangles sharing a geometric edge — but using separate vertex
     * indices for per-face normals — are correctly recognised as
     * belonging to the same surface.
     *
     * The welding algorithm is ported from Omar Shehata's VerticesWelder:
     * https://github.com/OmarShehata/webgl-outlines/blob/main/vertex-welder/src/VerticesWelder.js
     *
     * @param thresholdAngle  Maximum angle (degrees) between two
     *   adjacent face normals for their shared edge to be welded.
     *   Defaults to 80 — generous enough to merge most hard-surface
     *   edges while still preserving intentional creases.
     */
    public computeSurfaceIds(mesh: FlatshadedMesh, thresholdAngle: number = 80): void {
        // Build flat arrays from the mesh for the welder
        const vertCount = mesh.points.length;
        const faceCount = mesh.faces.length;
        const flatVerts = new Float64Array(vertCount * 3);
        for (let i = 0; i < vertCount; i++) {
            flatVerts[i * 3]     = mesh.points[i].x;
            flatVerts[i * 3 + 1] = mesh.points[i].y;
            flatVerts[i * 3 + 2] = mesh.points[i].z;
        }
        const flatIndices = new Int32Array(faceCount * 3);
        for (let i = 0; i < faceCount; i++) {
            flatIndices[i * 3]     = mesh.faces[i].v1;
            flatIndices[i * 3 + 1] = mesh.faces[i].v2;
            flatIndices[i * 3 + 2] = mesh.faces[i].v3;
        }

        // Weld duplicate vertices — produces a remapped index buffer
        const weldedIndices = WireFrameRenderingPipeline.weldVertices(
            flatVerts, flatIndices, thresholdAngle
        );

        // ── Union-find over the welded index buffer ────────────────
        const parent = new Int32Array(vertCount);
        const rank = new Uint8Array(vertCount);
        for (let i = 0; i < vertCount; i++) { parent[i] = i; }

        const find = (x: number): number => {
            while (parent[x] !== x) {
                parent[x] = parent[parent[x]];
                x = parent[x];
            }
            return x;
        };

        const union = (a: number, b: number): void => {
            let ra = find(a);
            let rb = find(b);
            if (ra === rb) return;
            if (rank[ra] < rank[rb]) { const t = ra; ra = rb; rb = t; }
            parent[rb] = ra;
            if (rank[ra] === rank[rb]) rank[ra]++;
        };

        for (let i = 0; i < weldedIndices.length; i += 3) {
            union(weldedIndices[i], weldedIndices[i + 1]);
            union(weldedIndices[i], weldedIndices[i + 2]);
        }

        const rootToId = new Map<number, number>();
        let nextId = 1;

        this.faceSurfaceIds = new Array<number>(faceCount);
        for (let i = 0; i < faceCount; i++) {
            const root = find(weldedIndices[i * 3]);
            let id = rootToId.get(root);
            if (id === undefined) {
                id = nextId++;
                rootToId.set(root, id);
            }
            this.faceSurfaceIds[i] = id;
        }
    }

    // ── Vertex welding ─────────────────────────────────────────────
    // Ported from Omar Shehata's VerticesWelder.js:
    // https://github.com/OmarShehata/webgl-outlines/blob/main/vertex-welder/src/VerticesWelder.js

    private static readonly PRECISION_POINTS = 4;
    private static readonly PRECISION = Math.pow(10, WireFrameRenderingPipeline.PRECISION_POINTS);

    private static hashVertex(x: number, y: number, z: number): string {
        const p = WireFrameRenderingPipeline.PRECISION;
        return `${Math.round(x * p)},${Math.round(y * p)},${Math.round(z * p)}`;
    }

    private static faceNormal(
        ax: number, ay: number, az: number,
        bx: number, by: number, bz: number,
        cx: number, cy: number, cz: number
    ): [number, number, number] {
        // (c - b) × (a - b)
        const cbx = cx - bx, cby = cy - by, cbz = cz - bz;
        const abx = ax - bx, aby = ay - by, abz = az - bz;
        let nx = cby * abz - cbz * aby;
        let ny = cbz * abx - cbx * abz;
        let nz = cbx * aby - cby * abx;
        const lenSq = nx * nx + ny * ny + nz * nz;
        if (lenSq > 0) {
            const invLen = 1 / Math.sqrt(lenSq);
            nx *= invLen; ny *= invLen; nz *= invLen;
        }
        return [nx, ny, nz];
    }

    /**
     * Finds pairs of edges between triangles whose normals are within
     * `thresholdAngle` degrees and that share the same spatial positions.
     * Returns an array of edge-pairs: each entry is [[i0,i1],[j0,j1]].
     */
    private static computeEdgesToMerge(
        verts: Float64Array, indices: Int32Array, thresholdAngle: number
    ): Array<[[ number, number ], [ number, number ]]> {
        const DEG2RAD = Math.PI / 180;
        const thresholdDot = Math.cos(DEG2RAD * thresholdAngle);
        const edgeData: Map<string, { i0: number; i1: number; nx: number; ny: number; nz: number } | null> = new Map();
        const result: Array<[[number, number], [number, number]]> = [];

        for (let i = 0; i < indices.length; i += 3) {
            const i0 = indices[i], i1 = indices[i + 1], i2 = indices[i + 2];
            const ax = verts[i0 * 3], ay = verts[i0 * 3 + 1], az = verts[i0 * 3 + 2];
            const bx = verts[i1 * 3], by = verts[i1 * 3 + 1], bz = verts[i1 * 3 + 2];
            const cx = verts[i2 * 3], cy = verts[i2 * 3 + 1], cz = verts[i2 * 3 + 2];

            const [nx, ny, nz] = this.faceNormal(ax, ay, az, bx, by, bz, cx, cy, cz);

            const idxArr = [i0, i1, i2];
            const hashes = [
                this.hashVertex(ax, ay, az),
                this.hashVertex(bx, by, bz),
                this.hashVertex(cx, cy, cz)
            ];

            // Skip degenerate triangles
            if (hashes[0] === hashes[1] || hashes[1] === hashes[2] || hashes[2] === hashes[0]) {
                continue;
            }

            for (let j = 0; j < 3; j++) {
                const jNext = (j + 1) % 3;
                const hash = `${hashes[j]}_${hashes[jNext]}`;
                const reverseHash = `${hashes[jNext]}_${hashes[j]}`;

                if (edgeData.has(reverseHash) && edgeData.get(reverseHash) !== null) {
                    const sibling = edgeData.get(reverseHash)!;
                    const dot = nx * sibling.nx + ny * sibling.ny + nz * sibling.nz;
                    if (dot > thresholdDot) {
                        result.push([
                            [sibling.i0, sibling.i1],
                            [idxArr[j], idxArr[jNext]]
                        ]);
                    }
                    edgeData.set(reverseHash, null);
                } else if (!edgeData.has(hash)) {
                    edgeData.set(hash, {
                        i0: idxArr[j], i1: idxArr[jNext],
                        nx, ny, nz
                    });
                }
            }
        }
        return result;
    }

    /**
     * Merges vertices along shared edges between triangles whose face
     * normals are within `thresholdAngle` degrees.  Returns a new index
     * array where duplicate vertex indices have been replaced by their
     * canonical counterpart.
     */
    private static weldVertices(
        verts: Float64Array, indices: Int32Array, thresholdAngle: number
    ): Int32Array {
        const edgePairs = this.computeEdgesToMerge(verts, indices, thresholdAngle);

        // Build look-up: edge (as string) -> pair of edges
        const edgesToMergeMap = new Map<string, [[number, number], [number, number]]>();
        for (const pair of edgePairs) {
            const key0 = `${pair[0][0]},${pair[0][1]}`;
            const key1 = `${pair[1][0]},${pair[1][1]}`;
            edgesToMergeMap.set(key0, pair);
            edgesToMergeMap.set(key1, pair);
        }

        // mergedMap[i] = list of indices merged into i
        const mergedMap = new Map<number, number[]>();
        // vertexAliases[deleted] = canonical
        const vertexAliases = new Map<number, number>();

        const merge = (i1: number, i2: number): void => {
            let list = mergedMap.get(i1);
            if (!list) { list = []; mergedMap.set(i1, list); }
            list.push(i2);
        };

        const aliasDeletedVertex = (deleted: number, remaining: number): void => {
            if (deleted === remaining) return;
            vertexAliases.set(deleted, remaining);
        };

        const distSq = (a: number, b: number): number => {
            const dx = verts[a * 3] - verts[b * 3];
            const dy = verts[a * 3 + 1] - verts[b * 3 + 1];
            const dz = verts[a * 3 + 2] - verts[b * 3 + 2];
            return dx * dx + dy * dy + dz * dz;
        };

        // Process every triangle edge
        for (let i = 0; i < indices.length; i += 3) {
            const tri = [indices[i], indices[i + 1], indices[i + 2]];
            const edges: [number, number][] = [
                [tri[0], tri[1]], [tri[0], tri[2]], [tri[1], tri[2]]
            ];

            for (const edge of edges) {
                let index0 = edge[0];
                let index1 = edge[1];
                const key = `${index0},${index1}`;
                const revKey = `${index1},${index0}`;

                let originalEdge: [number, number] | undefined;
                let otherEdge: [number, number] | undefined;

                const pair = edgesToMergeMap.get(key) || edgesToMergeMap.get(revKey);
                if (!pair) continue;

                const edgeToMerge = edgesToMergeMap.has(key) ? key : revKey;

                const possibleEdge1 = pair[0];
                const possibleEdge2 = pair[1];

                // Pick the edge that is NOT the current one
                if ((possibleEdge1[0] === index0 && possibleEdge1[1] === index1) ||
                    (possibleEdge1[0] === index1 && possibleEdge1[1] === index0)) {
                    otherEdge = possibleEdge2;
                    originalEdge = possibleEdge1;
                } else {
                    otherEdge = possibleEdge1;
                    originalEdge = possibleEdge2;
                }

                let idx2 = otherEdge[0];
                let idx3 = otherEdge[1];
                index0 = originalEdge[0];
                index1 = originalEdge[1];

                // Skip degenerate self-edges
                if (index0 === idx2 && index1 === idx3) continue;

                // Figure out correct merge orientation (match closest vertices)
                if (distSq(index0, idx2) > 0.01) {
                    const tmp = idx3; idx3 = idx2; idx2 = tmp;
                }

                // Follow existing aliases
                if (vertexAliases.has(index0)) index0 = vertexAliases.get(index0)!;
                if (vertexAliases.has(index1)) index1 = vertexAliases.get(index1)!;
                if (vertexAliases.has(idx2)) idx2 = vertexAliases.get(idx2)!;
                if (vertexAliases.has(idx3)) idx3 = vertexAliases.get(idx3)!;

                merge(index0, idx2);
                merge(index1, idx3);
                aliasDeletedVertex(idx2, index0);
                aliasDeletedVertex(idx3, index1);

                // Remove processed edges from the map
                edgesToMergeMap.delete(edgeToMerge);
                const mergedKey = `${idx2},${idx3}`;
                edgesToMergeMap.delete(mergedKey);
            }
        }

        // Build final merge map: for every index merged into a key,
        // point it back to that key
        const finalMap = new Map<number, number>();
        for (const [key, list] of mergedMap) {
            for (const idx of list) {
                finalMap.set(idx, key);
            }
        }

        // Produce new index buffer with merged indices
        const result = new Int32Array(indices.length);
        for (let i = 0; i < indices.length; i++) {
            const idx = indices[i];
            result[i] = finalMap.has(idx) ? finalMap.get(idx)! : idx;
        }
        return result;
    }

    // ── Projection ─────────────────────────────────────────────────

    private projectVertex(v: { x: number; y: number; z: number }, out: Vector4f): void {
        const invZ = 1 / (-v.z);
        out.x = (this.framebuffer.width / 2) + 292 * v.x * invZ;
        out.y = (this.framebuffer.height / 2) - v.y * 292 * invZ;
        out.z = v.z;
    }

    // ── Clear ──────────────────────────────────────────────────────

    /** Clears the surface-ID buffer.  Call once per frame before drawing. */
    public clearBuffers(): void {
        this.surfaceIdBuffer.fill(0);
    }

    // ── Drawing ────────────────────────────────────────────────────

    /**
     * Rasterizes a single face from the mesh into the surface-ID buffer
     * and the depth buffer.  Vertices must already be transformed into
     * view space (i.e. `mesh.transformedPoints` is up-to-date).
     */
    public drawFace(framebuffer: Framebuffer, mesh: FlatshadedMesh, faceIndex: number): void {
        if (!this.faceSurfaceIds) return;

        const face = mesh.faces[faceIndex];
        const v1 = mesh.transformedPoints[face.v1];
        const v2 = mesh.transformedPoints[face.v2];
        const v3 = mesh.transformedPoints[face.v3];

        const v1Front = this.isInFrontOfNearPlane(v1);
        const v2Front = this.isInFrontOfNearPlane(v2);
        const v3Front = this.isInFrontOfNearPlane(v3);

        if (!v1Front && !v2Front && !v3Front) return;

        const surfaceId = this.faceSurfaceIds[faceIndex];

        if (v1Front && v2Front && v3Front) {
            const p1 = new Vector4f(0, 0, 0);
            const p2 = new Vector4f(0, 0, 0);
            const p3 = new Vector4f(0, 0, 0);
            this.projectVertex(v1, p1);
            this.projectVertex(v2, p2);
            this.projectVertex(v3, p3);

            if (!this.isTriangleCCW(p1, p2, p3)) return;

            this.rasterizeTriangle(framebuffer, p1, p2, p3, surfaceId);
        } else {
            // Near-plane clipping
            const verts: Array<{ x: number; y: number; z: number }> = [v1, v2, v3];
            const clipped = this.clipToNearPlane(verts);
            if (clipped.length < 3) return;

            const projected: Array<Vector4f> = [];
            for (const v of clipped) {
                const p = new Vector4f(0, 0, 0);
                this.projectVertex(v, p);
                projected.push(p);
            }

            if (!this.isTriangleCCW(projected[0], projected[1], projected[2])) return;

            // Triangulate the clipped convex polygon
            for (let j = 0; j < projected.length - 2; j++) {
                this.rasterizeTriangle(
                    framebuffer,
                    projected[0],
                    projected[1 + j],
                    projected[2 + j],
                    surfaceId
                );
            }
        }
    }

    // ── Near-plane clipping (Sutherland–Hodgman) ───────────────────

    private clipToNearPlane(
        verts: Array<{ x: number; y: number; z: number }>
    ): Array<Vector4f> {
        const output: Array<Vector4f> = [];
        const np = this.NEAR_PLANE_Z;

        let prev = verts[verts.length - 1];
        let prevInside = prev.z < np;

        for (const curr of verts) {
            const currInside = curr.z < np;

            if (currInside) {
                if (!prevInside) {
                    output.push(this.interpolateNearPlane(prev, curr));
                }
                output.push(new Vector4f(curr.x, curr.y, curr.z));
            } else if (prevInside) {
                output.push(this.interpolateNearPlane(prev, curr));
            }

            prev = curr;
            prevInside = currInside;
        }

        return output;
    }

    private interpolateNearPlane(
        a: { x: number; y: number; z: number },
        b: { x: number; y: number; z: number }
    ): Vector4f {
        const t = (this.NEAR_PLANE_Z - a.z) / (b.z - a.z);
        return new Vector4f(
            a.x + t * (b.x - a.x),
            a.y + t * (b.y - a.y),
            this.NEAR_PLANE_Z
        );
    }

    // ── Scanline triangle rasterizer (surface-ID + depth) ──────────

    /**
     * Rasterizes a single projected triangle into the surface-ID buffer
     * and depth buffer using a standard top/bottom-half scanline fill.
     *
     * Depth is interpolated as 1/z (perspective-correct) and tested
     * against the existing wBuffer values so that nearer geometry wins.
     */
    private rasterizeTriangle(
        framebuffer: Framebuffer,
        p0: Vector4f, p1: Vector4f, p2: Vector4f,
        surfaceId: number
    ): void {
        const w = framebuffer.width;
        const h = framebuffer.height;

        // Sort vertices by Y ascending (top to bottom)
        let a = p0, b = p1, c = p2;
        if (a.y > b.y) { const t = a; a = b; b = t; }
        if (a.y > c.y) { const t = a; a = c; c = t; }
        if (b.y > c.y) { const t = b; b = c; c = t; }

        // 1/z values for depth interpolation
        const wa = 1 / a.z;
        const wb = 1 / b.z;
        const wc = 1 / c.z;

        const totalHeight = c.y - a.y;
        if (totalHeight < 0.5) return;

        const invTotalHeight = 1 / totalHeight;

        // ── Top half: a → b ────────────────────────────────────────
        const topHalf = b.y - a.y;
        if (topHalf > 0) {
            const invTopHalf = 1 / topHalf;
            const yStart = Math.max(0, Math.ceil(a.y));
            const yEnd = Math.min(h - 1, Math.ceil(b.y) - 1);

            for (let y = yStart; y <= yEnd; y++) {
                const tAB = (y - a.y) * invTopHalf;
                const tAC = (y - a.y) * invTotalHeight;

                let x1 = a.x + (b.x - a.x) * tAB;
                let x2 = a.x + (c.x - a.x) * tAC;
                let w1 = wa + (wb - wa) * tAB;
                let w2 = wa + (wc - wa) * tAC;

                if (x1 > x2) {
                    let t = x1; x1 = x2; x2 = t;
                    t = w1; w1 = w2; w2 = t;
                }

                const xStart = Math.max(0, Math.ceil(x1));
                const xEnd = Math.min(w - 1, Math.ceil(x2) - 1);

                if (xStart <= xEnd) {
                    const spanWidth = x2 - x1;
                    const wDelta = spanWidth > 0 ? (w2 - w1) / spanWidth : 0;
                    let wCur = w1 + (xStart - x1) * wDelta;
                    let idx = y * w + xStart;

                    for (let x = xStart; x <= xEnd; x++) {
                        if (wCur < framebuffer.wBuffer[idx]) {
                            framebuffer.wBuffer[idx] = wCur;
                            this.surfaceIdBuffer[idx] = surfaceId;
                        }
                        wCur += wDelta;
                        idx++;
                    }
                }
            }
        }

        // ── Bottom half: b → c ─────────────────────────────────────
        const bottomHalf = c.y - b.y;
        if (bottomHalf > 0) {
            const invBottomHalf = 1 / bottomHalf;
            const yStart = Math.max(0, Math.ceil(b.y));
            const yEnd = Math.min(h - 1, Math.ceil(c.y) - 1);

            for (let y = yStart; y <= yEnd; y++) {
                const tBC = (y - b.y) * invBottomHalf;
                const tAC = (y - a.y) * invTotalHeight;

                let x1 = b.x + (c.x - b.x) * tBC;
                let x2 = a.x + (c.x - a.x) * tAC;
                let w1 = wb + (wc - wb) * tBC;
                let w2 = wa + (wc - wa) * tAC;

                if (x1 > x2) {
                    let t = x1; x1 = x2; x2 = t;
                    t = w1; w1 = w2; w2 = t;
                }

                const xStart = Math.max(0, Math.ceil(x1));
                const xEnd = Math.min(w - 1, Math.ceil(x2) - 1);

                if (xStart <= xEnd) {
                    const spanWidth = x2 - x1;
                    const wDelta = spanWidth > 0 ? (w2 - w1) / spanWidth : 0;
                    let wCur = w1 + (xStart - x1) * wDelta;
                    let idx = y * w + xStart;

                    for (let x = xStart; x <= xEnd; x++) {
                        if (wCur < framebuffer.wBuffer[idx]) {
                            framebuffer.wBuffer[idx] = wCur;
                            this.surfaceIdBuffer[idx] = surfaceId;
                        }
                        wCur += wDelta;
                        idx++;
                    }
                }
            }
        }
    }

    // ── Post-process: edge detection ───────────────────────────────

    /**
     * Scans the surface-ID buffer and depth buffer, writing outline
     * pixels into the colour framebuffer wherever an edge is detected.
     *
     * To avoid double-thick lines the kernel only compares each pixel
     * with its **right** and **bottom** neighbours.  This guarantees
     * every boundary is detected exactly once, producing single-pixel
     * outlines.
     *
     * An edge is detected at pixel (x, y) when:
     *  - Its right or bottom neighbour has a different surface ID, OR
     *  - The depth difference to that neighbour exceeds the threshold.
     *
     * Additionally, silhouette edges at the geometry/background
     * boundary are detected when a geometry pixel borders a background
     * pixel in any of the 4 cardinal directions.
     *
     * The background is filled with the configured background colour;
     * edges are drawn with the configured outline colour.
     */
    public postProcessOutlines(framebuffer: Framebuffer): void {
        const w = framebuffer.width;
        const h = framebuffer.height;
        const fb = framebuffer.framebuffer;
        const sid = this.surfaceIdBuffer;
        const depth = framebuffer.wBuffer;

        // Fill colour buffer with background
        fb.fill(this.backgroundColor);

        const threshold = this.depthThreshold;

        for (let y = 1; y < h - 1; y++) {
            const rowIdx = y * w;
            for (let x = 1; x < w - 1; x++) {
                const idx = rowIdx + x;
                const s = sid[idx];

                // Skip pure background pixels (no geometry)
                if (s === 0) continue;

                // Silhouette: geometry pixel that borders background
                // (check all 4 neighbours for background = 0)
                if (sid[idx - 1] === 0 || sid[idx + 1] === 0 ||
                    sid[idx - w] === 0 || sid[idx + w] === 0) {
                    fb[idx] = this.outlineColor;
                    continue;
                }

                const d = depth[idx];

                // Internal edges: only check RIGHT and DOWN neighbours
                // so each boundary is marked on one side only (1px lines)
                const sR = sid[idx + 1];
                const sD = sid[idx + w];

                if (sR !== s || sD !== s) {
                    fb[idx] = this.outlineColor;
                    continue;
                }

                // Depth discontinuity (silhouette edges between
                // overlapping surfaces at different depths) — again
                // only right and down to keep lines thin.
                const dR = depth[idx + 1];
                const dD = depth[idx + w];

                if (Math.abs(d - dR) > threshold ||
                    Math.abs(d - dD) > threshold) {
                    fb[idx] = this.outlineColor;
                }
            }
        }
    }

}
