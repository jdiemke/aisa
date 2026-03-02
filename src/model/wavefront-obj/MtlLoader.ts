import { MtlMaterial } from './MtlMaterial';

/**
 * Parser for Wavefront MTL (Material Template Library) files.
 *
 * Covers the full specification (Alias|Wavefront v4.2, October 1995):
 *
 * **Colour & illumination:**
 *   newmtl, Ka, Kd, Ks, Ke, Tf, Ns, Ni, d (incl. -halo), Tr, illum, sharpness
 *
 * **Texture maps:**
 *   map_Ka, map_Kd, map_Ks, map_Ns, map_d, map_aat, bump / map_bump, disp, decal
 *
 * **Reflection maps:**
 *   refl -type sphere / cube_top / cube_bottom / cube_front / cube_back /
 *        cube_left / cube_right
 *
 * Colour directives support the three mutually-exclusive forms:
 *   Ka r [g b]          – RGB (single value is replicated to g and b)
 *   Ka spectral f.rfl f – spectral (stored as filename string)
 *   Ka xyz x [y z]      – CIEXYZ (treated like RGB for storage)
 *
 * @see https://www.fileformat.info/format/material/
 * @see https://www.martinreddy.net/gfx/3d/OBJ.spec
 */
export class MtlLoader {

    /**
     * Parses MTL text content into a map of material name → {@link MtlMaterial}.
     */
    public static parse(mtlText: string): Map<string, MtlMaterial> {
        const materials: Map<string, MtlMaterial> = new Map();
        let current: MtlMaterial | null = null;

        const lines: Array<string> = mtlText
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .split('\n');

        for (const rawLine of lines) {
            const line: string = rawLine.trim();

            // Skip empty lines and comments
            if (line.length === 0 || line.startsWith('#')) {
                continue;
            }

            const parts: Array<string> = line.split(/\s+/);
            const keyword: string = parts[0];

            switch (keyword) {
                case 'newmtl': {
                    const name: string = parts.slice(1).join(' ');
                    current = new MtlMaterial(name);
                    materials.set(name, current);
                    break;
                }

                // ── Colour statements ────────────────────────────────

                case 'Ka':
                    if (current) {
                        current.ambientColor = MtlLoader.parseColor(parts);
                    }
                    break;

                case 'Kd':
                    if (current) {
                        current.diffuseColor = MtlLoader.parseColor(parts);
                    }
                    break;

                case 'Ks':
                    if (current) {
                        current.specularColor = MtlLoader.parseColor(parts);
                    }
                    break;

                case 'Ke':
                    if (current) {
                        current.emissiveColor = MtlLoader.parseColor(parts);
                    }
                    break;

                case 'Tf':
                    if (current) {
                        current.transmissionFilter = MtlLoader.parseColor(parts);
                    }
                    break;

                // ── Scalar illumination parameters ───────────────────

                case 'Ns':
                    if (current) {
                        current.specularExponent = parseFloat(parts[1]);
                    }
                    break;

                case 'd':
                    if (current) {
                        if (parts[1] === '-halo') {
                            // d -halo factor
                            current.dissolveHalo = true;
                            current.dissolve = parseFloat(parts[2]);
                        } else {
                            current.dissolveHalo = false;
                            current.dissolve = parseFloat(parts[1]);
                        }
                    }
                    break;

                case 'Tr':
                    // Tr = 1 - d (transparency is inverse of dissolve)
                    if (current) {
                        current.dissolve = 1.0 - parseFloat(parts[1]);
                    }
                    break;

                case 'Ni':
                    if (current) {
                        current.opticalDensity = parseFloat(parts[1]);
                    }
                    break;

                case 'illum':
                    if (current) {
                        current.illuminationModel = parseInt(parts[1], 10);
                    }
                    break;

                case 'sharpness':
                    if (current) {
                        current.sharpness = parseFloat(parts[1]);
                    }
                    break;

                // ── Texture maps ─────────────────────────────────────

                case 'map_Kd':
                    if (current) {
                        current.diffuseTextureMap = MtlLoader.parseMapFilename(parts);
                    }
                    break;

                case 'map_Ka':
                    if (current) {
                        current.ambientTextureMap = MtlLoader.parseMapFilename(parts);
                    }
                    break;

                case 'map_Ks':
                    if (current) {
                        current.specularTextureMap = MtlLoader.parseMapFilename(parts);
                    }
                    break;

                case 'map_Ns':
                    if (current) {
                        current.specularHighlightMap = MtlLoader.parseMapFilename(parts);
                    }
                    break;

                case 'map_d':
                    if (current) {
                        current.alphaTextureMap = MtlLoader.parseMapFilename(parts);
                    }
                    break;

                case 'map_aat':
                    if (current) {
                        current.antiAliasTextures = (parts[1] === 'on');
                    }
                    break;

                case 'bump':
                case 'map_bump':
                    if (current) {
                        current.bumpMap = MtlLoader.parseMapFilename(parts);
                    }
                    break;

                case 'disp':
                    if (current) {
                        current.displacementMap = MtlLoader.parseMapFilename(parts);
                    }
                    break;

                case 'decal':
                    if (current) {
                        current.decalMap = MtlLoader.parseMapFilename(parts);
                    }
                    break;

                // ── Reflection maps ──────────────────────────────────

                case 'refl':
                    if (current) {
                        MtlLoader.parseReflection(parts, current);
                    }
                    break;

                default:
                    // Silently skip unrecognised directives (Pr, Pm, Pc, etc.)
                    break;
            }
        }

        return materials;
    }

    /**
     * Fetches an MTL file by URL and parses it.
     */
    public static load(url: string): Promise<Map<string, MtlMaterial>> {
        return fetch(url)
            .then((response: Response) => response.text())
            .then((text: string) => MtlLoader.parse(text));
    }

    /**
     * Parses an RGB colour value from the three forms allowed by the spec:
     *
     *   `Ka r [g b]`           – RGB; if only r is given, g = b = r
     *   `Ka spectral f.rfl f`  – spectral curve (ignored – defaults to white)
     *   `Ka xyz x [y z]`       – CIEXYZ; treated as RGB for storage
     */
    private static parseColor(parts: Array<string>): [number, number, number] {
        // Handle `Ka spectral …` – we can't evaluate .rfl files, so default to 1,1,1.
        if (parts[1] === 'spectral') {
            return [1, 1, 1];
        }

        // Handle `Ka xyz x [y z]`
        const startIdx: number = parts[1] === 'xyz' ? 2 : 1;

        const r: number = parseFloat(parts[startIdx]) || 0;
        // If only one value is given, replicate it to g and b per the spec.
        const g: number = (parts.length > startIdx + 1) ? (parseFloat(parts[startIdx + 1]) || 0) : r;
        const b: number = (parts.length > startIdx + 2) ? (parseFloat(parts[startIdx + 2]) || 0) : r;

        return [r, g, b];
    }

    /**
     * Extracts the texture map filename from a directive like
     * `map_Kd [-options...] filename.png`.
     *
     * Texture map options (e.g. `-o`, `-s`, `-bm`) and their numeric
     * arguments are skipped; the last token that does **not** belong to
     * an option is treated as the filename.
     *
     * Known options with argument counts:
     *   -blendu 1, -blendv 1, -cc 1, -clamp 1, -bm 1, -boost 1,
     *   -texres 1, -imfchan 1, -mm 2, -o 1–3, -s 1–3, -t 1–3
     */
    private static parseMapFilename(parts: Array<string>): string {
        // The filename is always the last non-option token.
        // Walk backwards – the last element is the filename in virtually
        // all real-world MTL files and all spec examples.
        for (let i: number = parts.length - 1; i >= 1; i--) {
            if (!parts[i].startsWith('-')) {
                return parts[i];
            }
        }
        return parts[parts.length - 1];
    }

    /**
     * Parses `refl -type <type> [options] <filename>` into the correct
     * field on the material.
     */
    private static parseReflection(parts: Array<string>, mtl: MtlMaterial): void {
        // Find the -type argument
        let reflType: string = 'sphere'; // default
        for (let i: number = 1; i < parts.length - 1; i++) {
            if (parts[i] === '-type') {
                reflType = parts[i + 1];
                break;
            }
        }

        const filename: string = MtlLoader.parseMapFilename(parts);

        switch (reflType) {
            case 'sphere':
                mtl.reflectionMapSphere = filename;
                break;
            case 'cube_top':
                mtl.reflectionMapCubeTop = filename;
                break;
            case 'cube_bottom':
                mtl.reflectionMapCubeBottom = filename;
                break;
            case 'cube_front':
                mtl.reflectionMapCubeFront = filename;
                break;
            case 'cube_back':
                mtl.reflectionMapCubeBack = filename;
                break;
            case 'cube_left':
                mtl.reflectionMapCubeLeft = filename;
                break;
            case 'cube_right':
                mtl.reflectionMapCubeRight = filename;
                break;
            default:
                break;
        }
    }

}
