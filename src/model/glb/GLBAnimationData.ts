import { Matrix4f } from '../../math/Matrix4f';

/**
 * Raw keyframe data for a single animated property of a single joint.
 */
export interface AnimationChannel {
    /** Index into the glTF nodes array (== joint index within the skin). */
    nodeIndex: number;
    /** Which transform component is animated. */
    path: 'translation' | 'rotation' | 'scale';
    /** Keyframe timestamps in seconds. */
    times: Float32Array;
    /** Keyframe values (3 floats for T/S, 4 floats for R per keyframe). */
    values: Float32Array;
    /** Interpolation mode. */
    interpolation: 'LINEAR' | 'STEP' | 'CUBICSPLINE';
}

/**
 * A complete parsed animation clip.
 */
export interface AnimationClip {
    name: string;
    channels: Array<AnimationChannel>;
    duration: number;
}

/**
 * Skin (skeleton) definition parsed from glTF.
 */
export interface SkinData {
    /** Joint node indices (into the glTF nodes array). */
    joints: Array<number>;
    /** One 4×4 inverse-bind matrix per joint (column-major flat). */
    inverseBindMatrices: Array<Matrix4f>;
    /** Optional skeleton root node index. */
    skeleton?: number;
}

/**
 * Per-vertex skinning attribute data.
 */
export interface SkinningAttributes {
    /** 4 joint indices per vertex (JOINTS_0). */
    joints: Uint16Array;
    /** 4 weights per vertex (WEIGHTS_0). */
    weights: Float32Array;
}

/**
 * The local TRS decomposition of a node, easy to interpolate.
 */
export interface NodeTRS {
    translation: [number, number, number];
    rotation: [number, number, number, number]; // quaternion xyzw
    scale: [number, number, number];
}

/**
 * Everything needed to reconstruct the skeleton hierarchy.
 */
export interface NodeHierarchy {
    /** For each glTF node, its children node indices. */
    children: Array<Array<number>>;
    /** For each glTF node, its default local TRS. */
    defaultTRS: Array<NodeTRS>;
    /** Total number of nodes. */
    count: number;
}
