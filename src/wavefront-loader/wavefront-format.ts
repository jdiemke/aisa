
export interface WavefrontVertex {
    x: number;
    y: number;
    z: number;
}

export interface WavefrontNormal {
    x: number;
    y: number;
    z: number;
}

export interface WavefrontFace {
    vertices: Array<number>;
    normals: Array<number>;
}

export interface WavefrontMesh {
    name: string;
    vertices: Array<WavefrontVertex>;
    normals: Array<WavefrontNormal>;
    faces: Array<WavefrontFace>;
}

export interface WavefrontFormat {

}
