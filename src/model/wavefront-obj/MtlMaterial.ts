/**
 * Represents a single material definition parsed from a Wavefront MTL file.
 *
 * Covers the full MTL specification (Alias|Wavefront v4.2, October 1995):
 *
 * **Color & illumination:**
 *   newmtl, Ka, Kd, Ks, Ke, Tf, Ns, Ni, d (incl. -halo), illum, sharpness
 *
 * **Texture maps:**
 *   map_Ka, map_Kd, map_Ks, map_Ns, map_d, map_aat, bump/map_bump, disp, decal
 *
 * **Reflection maps:**
 *   refl -type sphere / cube_top / cube_bottom / cube_front / cube_back / cube_left / cube_right
 *
 * @see https://www.fileformat.info/format/material/
 */
export class MtlMaterial {

    /** Material name (from `newmtl` directive) */
    public name: string;

    // ── Colour & illumination ────────────────────────────────────────

    /** Ambient color RGB, each component 0–1 (from `Ka`) */
    public ambientColor: [number, number, number] = [1, 1, 1];

    /** Diffuse color RGB, each component 0–1 (from `Kd`) */
    public diffuseColor: [number, number, number] = [0.8, 0.8, 0.8];

    /** Specular color RGB, each component 0–1 (from `Ks`) */
    public specularColor: [number, number, number] = [0, 0, 0];

    /** Emissive color RGB, each component 0–1 (from `Ke`) — non-standard but widely used */
    public emissiveColor: [number, number, number] = [0, 0, 0];

    /**
     * Transmission filter RGB (from `Tf`).
     * Filters light passing through the object.
     * Default is `[1,1,1]` (fully transparent / no filtering).
     */
    public transmissionFilter: [number, number, number] = [1, 1, 1];

    /** Specular exponent, 0–1000 (from `Ns`) */
    public specularExponent: number = 0;

    /** Dissolve / opacity, 0–1 where 1 = fully opaque (from `d`) */
    public dissolve: number = 1;

    /**
     * Whether the dissolve uses the halo model (from `d -halo`).
     * When true, dissolve varies from 1.0 (edge) to {@link dissolve}
     * (centre) based on surface orientation relative to the viewer.
     */
    public dissolveHalo: boolean = false;

    /** Optical density / index of refraction, 0.001–10 (from `Ni`). 1.0 = no bending. */
    public opticalDensity: number = 1;

    /**
     * Illumination model (from `illum`).
     *
     *  0 – Color on, Ambient off
     *  1 – Color on, Ambient on
     *  2 – Highlight on
     *  3 – Reflection on, Ray trace on
     *  4 – Transparency: Glass on, Reflection: Ray trace on
     *  5 – Reflection: Fresnel on, Ray trace on
     *  6 – Transparency: Refraction on, Reflection: Fresnel off, Ray trace on
     *  7 – Transparency: Refraction on, Reflection: Fresnel on, Ray trace on
     *  8 – Reflection on, Ray trace off
     *  9 – Transparency: Glass on, Reflection: Ray trace off
     * 10 – Casts shadows onto invisible surfaces
     */
    public illuminationModel: number = 2;

    /**
     * Sharpness of reflections from the local reflection map (from `sharpness`).
     * Range 0–1000, default 60.
     */
    public sharpness: number = 60;

    // ── Texture maps ─────────────────────────────────────────────────

    /** Diffuse texture map filename (from `map_Kd`) */
    public diffuseTextureMap?: string;

    /** Ambient texture map filename (from `map_Ka`) */
    public ambientTextureMap?: string;

    /** Specular texture map filename (from `map_Ks`) */
    public specularTextureMap?: string;

    /** Specular highlight / exponent texture map filename (from `map_Ns`) */
    public specularHighlightMap?: string;

    /** Alpha / dissolve texture map filename (from `map_d`) */
    public alphaTextureMap?: string;

    /** Bump map filename (from `bump` or `map_bump`) */
    public bumpMap?: string;

    /** Displacement map filename (from `disp`) */
    public displacementMap?: string;

    /** Decal texture map filename (from `decal`) */
    public decalMap?: string;

    /** Whether anti-aliasing is enabled for this material's textures (from `map_aat on`) */
    public antiAliasTextures: boolean = false;

    // ── Reflection maps ──────────────────────────────────────────────

    /** Spherical reflection map filename (from `refl -type sphere`) */
    public reflectionMapSphere?: string;

    /** Cubic reflection map filenames (from `refl -type cube_*`) */
    public reflectionMapCubeTop?: string;
    public reflectionMapCubeBottom?: string;
    public reflectionMapCubeFront?: string;
    public reflectionMapCubeBack?: string;
    public reflectionMapCubeLeft?: string;
    public reflectionMapCubeRight?: string;

    constructor(name: string) {
        this.name = name;
    }

    /**
     * Returns the diffuse color as 0–255 packed ABGR integer,
     * suitable for use with the engine's framebuffer format.
     */
    public getDiffuseColorPacked(): number {
        const r: number = Math.min(255, Math.max(0, Math.round(this.diffuseColor[0] * 255)));
        const g: number = Math.min(255, Math.max(0, Math.round(this.diffuseColor[1] * 255)));
        const b: number = Math.min(255, Math.max(0, Math.round(this.diffuseColor[2] * 255)));
        const a: number = Math.min(255, Math.max(0, Math.round(this.dissolve * 255)));
        return r | (g << 8) | (b << 16) | (a << 24);
    }

}
