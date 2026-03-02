import { MtlMaterial } from './MtlMaterial';

/**
 * Parser for Wavefront MTL (Material Template Library) files.
 *
 * Supports the following directives:
 *   newmtl, Ka, Kd, Ks, Ke, Ns, d, Tr, Ni, illum,
 *   map_Kd, map_Ka, map_Ks, map_Ns, map_d, bump, map_bump, disp
 *
 * @see https://en.wikipedia.org/wiki/Wavefront_.obj_file#Material_template_library
 */
export class MtlLoader {

    /**
     * Parses MTL text content into a map of material name → {@link MtlMaterial}.
     */
    public static parse(mtlText: string): Map<string, MtlMaterial> {
        const materials: Map<string, MtlMaterial> = new Map();
        let current: MtlMaterial | null = null;

        const lines: Array<string> = mtlText.split('\n');

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

                case 'Ns':
                    if (current) {
                        current.specularExponent = parseFloat(parts[1]);
                    }
                    break;

                case 'd':
                    if (current) {
                        current.dissolve = parseFloat(parts[1]);
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

                default:
                    // Ignore unknown directives (Tf, Pr, Pm, etc.)
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
     * Parses an RGB color triplet from split parts: `["Ka", "r", "g", "b"]`
     */
    private static parseColor(parts: Array<string>): [number, number, number] {
        return [
            parseFloat(parts[1]) || 0,
            parseFloat(parts[2]) || 0,
            parseFloat(parts[3]) || 0
        ];
    }

    /**
     * Extracts the texture map filename from a directive like
     * `map_Kd [-options...] filename.png`.
     *
     * Texture map options (e.g. `-o`, `-s`, `-bm`) are skipped;
     * the last token that does not start with `-` is treated as
     * the filename.
     */
    private static parseMapFilename(parts: Array<string>): string {
        // Walk backwards from the end to find the filename
        // (options always start with '-')
        for (let i: number = parts.length - 1; i >= 1; i--) {
            if (!parts[i].startsWith('-')) {
                return parts[i];
            }
        }
        return parts[parts.length - 1];
    }

}
