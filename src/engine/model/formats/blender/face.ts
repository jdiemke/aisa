export class Face {
    public vertices: Array<number>;
    public normals: Array<number>;
    public uv: Array<number>;
    public materialName?: string;
    /** Smoothing group (from `s`). `undefined` means smoothing is off. */
    public smoothingGroup?: string | number;
}
