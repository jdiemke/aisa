/**
 * Represents a single material definition parsed from a Wavefront MTL file.
 *
 * @see https://en.wikipedia.org/wiki/Wavefront_.obj_file#Material_template_library
 */
export class MtlMaterial {

    /** Material name (from `newmtl` directive) */
    public name: string;

    /** Ambient color RGB, each component 0–1 (from `Ka`) */
    public ambientColor: [number, number, number] = [1, 1, 1];

    /** Diffuse color RGB, each component 0–1 (from `Kd`) */
    public diffuseColor: [number, number, number] = [0.8, 0.8, 0.8];

    /** Specular color RGB, each component 0–1 (from `Ks`) */
    public specularColor: [number, number, number] = [0, 0, 0];

    /** Emissive color RGB, each component 0–1 (from `Ke`) */
    public emissiveColor: [number, number, number] = [0, 0, 0];

    /** Specular exponent, 0–1000 (from `Ns`) */
    public specularExponent: number = 0;

    /** Dissolve / opacity, 0–1 where 1 = fully opaque (from `d`) */
    public dissolve: number = 1;

    /** Optical density / index of refraction (from `Ni`) */
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

    /** Diffuse texture map filename (from `map_Kd`) */
    public diffuseTextureMap?: string;

    /** Ambient texture map filename (from `map_Ka`) */
    public ambientTextureMap?: string;

    /** Specular texture map filename (from `map_Ks`) */
    public specularTextureMap?: string;

    /** Specular highlight texture map filename (from `map_Ns`) */
    public specularHighlightMap?: string;

    /** Alpha / dissolve texture map filename (from `map_d`) */
    public alphaTextureMap?: string;

    /** Bump map filename (from `bump` or `map_bump`) */
    public bumpMap?: string;

    /** Displacement map filename (from `disp`) */
    public displacementMap?: string;

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
