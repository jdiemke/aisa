import { Mesh } from './mesh';
import { Vector } from './vector';
import { TexCoord } from './tex-coord';
import { Face } from './face';

/**
 * Resolves an OBJ vertex index which may be positive (1-based absolute)
 * or negative (relative to the current count).  Returns a 0-based index
 * local to the current mesh by subtracting the appropriate offset.
 */
function resolveIndex(raw: number, count: number, offset: number): number {
    if (raw < 0) {
        // Negative: relative to current end of the list.
        // e.g. -1 means the last vertex added so far → count - 1 (0-based)
        // then subtract offset to make it local to the current mesh.
        return (count + raw) - offset;
    }
    // Positive: 1-based absolute → subtract 1 and the mesh offset.
    return raw - 1 - offset;
}

/**
 * Parses a single face-vertex token such as `"1/2/3"`, `"1//3"`, `"1/2"`,
 * or `"1"` and returns the raw 1-based (or negative) indices.
 *
 * The OBJ spec allows four face-vertex formats:
 *   v              → vertex only
 *   v/vt           → vertex + texture
 *   v/vt/vn        → vertex + texture + normal
 *   v//vn          → vertex + normal (no texture)
 */
function parseFaceToken(token: string): { v: number; vt: number | undefined; vn: number | undefined } {
    const parts: Array<string> = token.split('/');
    const v: number = parseInt(parts[0], 10);
    let vt: number | undefined;
    let vn: number | undefined;

    if (parts.length >= 2 && parts[1] !== '') {
        vt = parseInt(parts[1], 10);
    }
    if (parts.length >= 3 && parts[2] !== '') {
        vn = parseInt(parts[2], 10);
    }

    return { v, vt, vn };
}

/**
 * Parses a Wavefront OBJ text file into an array of {@link Mesh} objects.
 *
 * Supported OBJ directives (polygonal geometry):
 *   v, vn, vt       – vertex data
 *   f               – face elements (all four v/vt/vn variants + n-gon fan triangulation)
 *   o               – object name (creates a new mesh)
 *   g               – group name (creates a new mesh when no `o` is active)
 *   usemtl          – material assignment (stored per-face)
 *   s               – smoothing group (stored per-face)
 *   mtllib          – material library filename(s) (stored on the mesh)
 *   #               – comments (ignored)
 *   \               – line continuation
 *
 * Negative vertex references and arbitrary whitespace (tabs, multiple
 * spaces) are handled according to the specification at
 * https://www.martinreddy.net/gfx/3d/OBJ.spec
 */
export function convertToMeshArray(data: string): Array<Mesh> {
    const meshes: Array<Mesh> = new Array<Mesh>();

    let currentObject: Mesh | null = null;
    let currentMaterial: string | undefined = undefined;
    let currentSmoothingGroup: string | number | undefined = undefined;

    // Global running counters for absolute → local index conversion.
    let vertexCount: number = 0;
    let normalCount: number = 0;
    let uvCount: number = 0;
    let vertexOffset: number = 0;
    let normalOffset: number = 0;
    let uvOffset: number = 0;

    // ── Pre-process: join line continuations and normalise line endings ──
    const raw: string = data.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const joinedLines: string = raw.replace(/\\\n/g, ' ');
    const lines: Array<string> = joinedLines.split('\n');

    /**
     * Lazily creates a default mesh if vertex/face data appears before any
     * `o` or `g` statement.
     */
    function ensureMesh(name: string = 'default'): void {
        if (currentObject !== null) {
            return;
        }
        currentObject = new Mesh();
        currentObject.name = name;
        currentObject.normals = [];
        currentObject.vertices = [];
        currentObject.faces = [];
        currentObject.uv = [];
        meshes.push(currentObject);
        vertexOffset = vertexCount;
        normalOffset = normalCount;
        uvOffset = uvCount;
    }

    /**
     * Starts a brand-new mesh (called by `o` and `g` handlers).
     */
    function startNewMesh(name: string): void {
        currentObject = new Mesh();
        currentObject.name = name;
        currentObject.normals = [];
        currentObject.vertices = [];
        currentObject.faces = [];
        currentObject.uv = [];
        meshes.push(currentObject);
        vertexOffset = vertexCount;
        normalOffset = normalCount;
        uvOffset = uvCount;
    }

    for (const rawLine of lines) {
        const line: string = rawLine.trim();

        // Skip empty lines and comments
        if (line.length === 0 || line.startsWith('#')) {
            continue;
        }

        // Split on any whitespace (handles tabs, multiple spaces, etc.)
        const tokens: Array<string> = line.split(/\s+/);
        const keyword: string = tokens[0];

        switch (keyword) {

            // ── Object name ─────────────────────────────────────────
            case 'o':
                startNewMesh(tokens.slice(1).join(' ') || 'unnamed');
                // Reset per-object state so it doesn't leak across objects.
                currentMaterial = undefined;
                currentSmoothingGroup = undefined;
                break;

            // ── Group name ──────────────────────────────────────────
            // Treated like a lightweight `o`: creates a new mesh so that
            // faces belonging to different groups end up separated.
            case 'g':
                startNewMesh(tokens.slice(1).join(' ') || 'default');
                break;

            // ── Material library (metadata – stored on current mesh) ──
            case 'mtllib':
                if (currentObject !== null) {
                    (currentObject as any).mtllib = tokens.slice(1).join(' ');
                }
                break;

            // ── Material assignment ─────────────────────────────────
            case 'usemtl':
                currentMaterial = tokens.slice(1).join(' ');
                break;

            // ── Smoothing group ─────────────────────────────────────
            case 's': {
                const sg: string = tokens[1];
                currentSmoothingGroup = (sg === 'off' || sg === '0') ? undefined : parseInt(sg, 10);
                break;
            }

            // ── Geometric vertex:  v x y z [w] ─────────────────────
            case 'v': {
                ensureMesh();
                const vx: number = parseFloat(tokens[1]);
                const vy: number = parseFloat(tokens[2]);
                const vz: number = parseFloat(tokens[3]);
                // tokens[4] would be the optional weight `w`; ignored for polygonal geometry.
                currentObject.vertices.push(new Vector(vx, vy, vz));
                vertexCount++;
                break;
            }

            // ── Vertex normal:  vn i j k ────────────────────────────
            case 'vn': {
                ensureMesh();
                const nx: number = parseFloat(tokens[1]);
                const ny: number = parseFloat(tokens[2]);
                const nz: number = parseFloat(tokens[3]);
                currentObject.normals.push(new Vector(nx, ny, nz));
                normalCount++;
                break;
            }

            // ── Texture vertex:  vt u [v [w]] ──────────────────────
            case 'vt': {
                ensureMesh();
                const tu: number = parseFloat(tokens[1]);
                const tv: number = tokens.length >= 3 ? parseFloat(tokens[2]) : 0;
                // tokens[3] would be the optional `w`; ignored here.
                currentObject.uv.push(new TexCoord(tu, tv));
                uvCount++;
                break;
            }

            // ── Face element:  f  v1[/vt1[/vn1]]  v2 … ────────────
            case 'f': {
                ensureMesh();
                const faceTokens: Array<string> = tokens.slice(1); // drop 'f'
                const vertexTokenCount: number = faceTokens.length;

                if (vertexTokenCount < 3) {
                    break; // degenerate face – skip
                }

                // Parse all face-vertex tokens once.
                const parsed: Array<{ v: number; vt: number | undefined; vn: number | undefined }> =
                    faceTokens.map(parseFaceToken);

                // Helper to build a Face from three parsed tokens.
                const buildTriangle = (
                    a: { v: number; vt: number | undefined; vn: number | undefined },
                    b: { v: number; vt: number | undefined; vn: number | undefined },
                    c: { v: number; vt: number | undefined; vn: number | undefined }
                ): Face => {
                    const face: Face = new Face();
                    face.vertices = [
                        resolveIndex(a.v, vertexCount, vertexOffset),
                        resolveIndex(b.v, vertexCount, vertexOffset),
                        resolveIndex(c.v, vertexCount, vertexOffset),
                    ];

                    // Texture coordinates (optional)
                    if (a.vt !== undefined && b.vt !== undefined && c.vt !== undefined) {
                        face.uv = [
                            resolveIndex(a.vt, uvCount, uvOffset),
                            resolveIndex(b.vt, uvCount, uvOffset),
                            resolveIndex(c.vt, uvCount, uvOffset),
                        ];
                    } else {
                        face.uv = [];
                    }

                    // Normals (optional)
                    if (a.vn !== undefined && b.vn !== undefined && c.vn !== undefined) {
                        face.normals = [
                            resolveIndex(a.vn, normalCount, normalOffset),
                            resolveIndex(b.vn, normalCount, normalOffset),
                            resolveIndex(c.vn, normalCount, normalOffset),
                        ];
                    } else {
                        face.normals = [];
                    }

                    face.materialName = currentMaterial;
                    face.smoothingGroup = currentSmoothingGroup;
                    return face;
                };

                // First triangle
                currentObject.faces.push(buildTriangle(parsed[0], parsed[1], parsed[2]));

                // Fan-triangulate any remaining vertices (quads, n-gons)
                for (let fi: number = 3; fi < vertexTokenCount; fi++) {
                    currentObject.faces.push(buildTriangle(parsed[0], parsed[fi - 1], parsed[fi]));
                }
                break;
            }

            // ── Directives intentionally ignored for polygonal rendering ──
            // Free-form curve/surface: cstype, deg, bmat, step, curv, curv2, surf,
            //   parm, trim, hole, scrv, sp, end, con
            // Points / lines: p, l
            // Render attributes: bevel, c_interp, d_interp, lod, shadow_obj,
            //   trace_obj, ctech, stech, maplib, usemap, mg
            // Superseded: bsp, bzp, cdc, cdp, res
            // Shell / call: call, csh
            default:
                // Silently skip unrecognised/unused keywords.
                break;
        }
    }

    return meshes;
}
