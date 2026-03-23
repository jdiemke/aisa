import { Matrix4f } from '../../math/Matrix4f';
import {
    AnimationChannel, AnimationClip, NodeHierarchy, NodeTRS,
    SkinData, SkinningAttributes
} from './GLBAnimationData';

/**
 * Parses glTF animation, skin, and node-hierarchy data from a GLB file's
 * JSON chunk + BIN chunk.
 *
 * Deliberately kept separate from {@link GLBLoader} so that the static
 * mesh path stays untouched.
 */
export class GLBAnimationLoader {

    private static readonly UNSIGNED_BYTE  = 5121;
    private static readonly UNSIGNED_SHORT = 5123;
    private static readonly UNSIGNED_INT   = 5125;
    private static readonly FLOAT          = 5126;

    // ── Public API ─────────────────────────────────────────────────

    public static parseAnimations(gltf: any, binChunk: ArrayBuffer | null): Array<AnimationClip> {
        if (!gltf.animations) { return []; }

        return gltf.animations.map((anim: any, idx: number) => {
            const channels: Array<AnimationChannel> = [];
            let duration = 0;

            for (const ch of anim.channels) {
                const sampler = anim.samplers[ch.sampler];
                const times = GLBAnimationLoader.readFloatAccessor(gltf, binChunk, sampler.input);
                const outputAccessor = gltf.accessors[sampler.output];
                const values = GLBAnimationLoader.readFloatAccessor(gltf, binChunk, sampler.output);

                if (times.length > 0) {
                    duration = Math.max(duration, times[times.length - 1]);
                }

                channels.push({
                    nodeIndex: ch.target.node,
                    path: ch.target.path as AnimationChannel['path'],
                    times,
                    values,
                    interpolation: (sampler.interpolation || 'LINEAR') as AnimationChannel['interpolation'],
                });
            }

            return {
                name: anim.name || `animation_${idx}`,
                channels,
                duration,
            } as AnimationClip;
        });
    }

    public static parseSkins(gltf: any, binChunk: ArrayBuffer | null): Array<SkinData> {
        if (!gltf.skins) { return []; }

        return gltf.skins.map((skin: any) => {
            const joints: Array<number> = skin.joints;
            const inverseBindMatrices: Array<Matrix4f> = [];

            if (skin.inverseBindMatrices !== undefined) {
                const floats = GLBAnimationLoader.readFloatAccessor(
                    gltf, binChunk, skin.inverseBindMatrices
                );
                for (let i = 0; i < joints.length; i++) {
                    inverseBindMatrices.push(
                        GLBAnimationLoader.fromColumnMajorFlat(floats, i * 16)
                    );
                }
            } else {
                for (let i = 0; i < joints.length; i++) {
                    inverseBindMatrices.push(Matrix4f.constructIdentityMatrix());
                }
            }

            return {
                joints,
                inverseBindMatrices,
                skeleton: skin.skeleton,
            } as SkinData;
        });
    }

    public static parseNodeHierarchy(gltf: any): NodeHierarchy {
        const count = gltf.nodes ? gltf.nodes.length : 0;
        const children: Array<Array<number>> = [];
        const defaultTRS: Array<NodeTRS> = [];

        for (let i = 0; i < count; i++) {
            const node = gltf.nodes[i];
            children.push(node.children ? [...node.children] : []);

            if (node.matrix) {
                const trs = GLBAnimationLoader.decomposeMatrix(node.matrix);
                defaultTRS.push(trs);
            } else {
                defaultTRS.push({
                    translation: node.translation
                        ? [node.translation[0], node.translation[1], node.translation[2]]
                        : [0, 0, 0],
                    rotation: node.rotation
                        ? [node.rotation[0], node.rotation[1], node.rotation[2], node.rotation[3]]
                        : [0, 0, 0, 1],
                    scale: node.scale
                        ? [node.scale[0], node.scale[1], node.scale[2]]
                        : [1, 1, 1],
                });
            }
        }

        return { children, defaultTRS, count };
    }

    /**
     * Reads JOINTS_0 and WEIGHTS_0 for a given mesh primitive.
     */
    public static parseSkinningAttributes(
        gltf: any, binChunk: ArrayBuffer | null, primitive: any
    ): SkinningAttributes | null {
        const jointsIdx = primitive.attributes.JOINTS_0;
        const weightsIdx = primitive.attributes.WEIGHTS_0;

        if (jointsIdx === undefined || weightsIdx === undefined) {
            return null;
        }

        const joints = GLBAnimationLoader.readJointsAccessor(gltf, binChunk, jointsIdx);
        const weights = GLBAnimationLoader.readFloatAccessor(gltf, binChunk, weightsIdx);

        return { joints, weights };
    }

    /**
     * Finds which skin is used by which mesh, returning a map of
     * meshIndex -> skinIndex. In glTF, skins are referenced by nodes.
     */
    public static buildMeshToSkinMap(gltf: any): Map<number, number> {
        const map = new Map<number, number>();
        if (!gltf.nodes) { return map; }

        for (const node of gltf.nodes) {
            if (node.mesh !== undefined && node.skin !== undefined) {
                map.set(node.mesh, node.skin);
            }
        }
        return map;
    }

    // ── Accessor readers ───────────────────────────────────────────

    private static readFloatAccessor(
        gltf: any, binChunk: ArrayBuffer | null, accessorIdx: number
    ): Float32Array {
        const accessor = gltf.accessors[accessorIdx];
        const bufferView = gltf.bufferViews[accessor.bufferView];
        const buffer = GLBAnimationLoader.getBuffer(gltf, binChunk, bufferView.buffer);
        const byteOffset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);

        const componentCount = GLBAnimationLoader.typeComponentCount(accessor.type);
        const totalFloats = accessor.count * componentCount;

        const stride = bufferView.byteStride;
        if (stride && stride !== componentCount * 4) {
            // Interleaved — read with stride
            const result = new Float32Array(totalFloats);
            const dv = new DataView(buffer);
            for (let i = 0; i < accessor.count; i++) {
                const base = byteOffset + i * stride;
                for (let c = 0; c < componentCount; c++) {
                    result[i * componentCount + c] = dv.getFloat32(base + c * 4, true);
                }
            }
            return result;
        }

        return new Float32Array(buffer, byteOffset, totalFloats);
    }

    private static readJointsAccessor(
        gltf: any, binChunk: ArrayBuffer | null, accessorIdx: number
    ): Uint16Array {
        const accessor = gltf.accessors[accessorIdx];
        const bufferView = gltf.bufferViews[accessor.bufferView];
        const buffer = GLBAnimationLoader.getBuffer(gltf, binChunk, bufferView.buffer);
        const byteOffset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
        const count = accessor.count * 4; // VEC4
        const compType = accessor.componentType;
        const dv = new DataView(buffer);
        const result = new Uint16Array(count);

        if (compType === GLBAnimationLoader.UNSIGNED_BYTE) {
            for (let i = 0; i < count; i++) {
                result[i] = dv.getUint8(byteOffset + i);
            }
        } else if (compType === GLBAnimationLoader.UNSIGNED_SHORT) {
            for (let i = 0; i < count; i++) {
                result[i] = dv.getUint16(byteOffset + i * 2, true);
            }
        } else {
            for (let i = 0; i < count; i++) {
                result[i] = dv.getUint32(byteOffset + i * 4, true);
            }
        }

        return result;
    }

    // ── Helpers ────────────────────────────────────────────────────

    private static getBuffer(
        gltf: any, binChunk: ArrayBuffer | null, bufferIdx: number
    ): ArrayBuffer {
        const bufferDef = gltf.buffers[bufferIdx];
        if (bufferIdx === 0 && !bufferDef.uri) {
            if (!binChunk) {
                throw new Error('GLBAnimationLoader: BIN chunk missing');
            }
            return binChunk;
        }
        throw new Error('GLBAnimationLoader: external buffer URIs not supported');
    }

    private static typeComponentCount(type: string): number {
        switch (type) {
            case 'SCALAR': return 1;
            case 'VEC2':   return 2;
            case 'VEC3':   return 3;
            case 'VEC4':   return 4;
            case 'MAT4':   return 16;
            default:       return 1;
        }
    }

    private static fromColumnMajorFlat(floats: Float32Array, offset: number): Matrix4f {
        const m = Matrix4f.constructIdentityMatrix();
        m.m11 = floats[offset];      m.m12 = floats[offset + 4]; m.m13 = floats[offset + 8];  m.m14 = floats[offset + 12];
        m.m21 = floats[offset + 1];  m.m22 = floats[offset + 5]; m.m23 = floats[offset + 9];  m.m24 = floats[offset + 13];
        m.m31 = floats[offset + 2];  m.m32 = floats[offset + 6]; m.m33 = floats[offset + 10]; m.m34 = floats[offset + 14];
        m.m41 = floats[offset + 3];  m.m42 = floats[offset + 7]; m.m43 = floats[offset + 11]; m.m44 = floats[offset + 15];
        return m;
    }

    /**
     * Decompose a column-major 4×4 matrix into TRS.
     * Only handles matrices that are a product of T * R * S
     * (no skew / projection).
     */
    private static decomposeMatrix(m: number[]): NodeTRS {
        const tx = m[12], ty = m[13], tz = m[14];

        // Column vectors of 3×3 part
        const sx = Math.sqrt(m[0] * m[0] + m[1] * m[1] + m[2] * m[2]);
        const sy = Math.sqrt(m[4] * m[4] + m[5] * m[5] + m[6] * m[6]);
        const sz = Math.sqrt(m[8] * m[8] + m[9] * m[9] + m[10] * m[10]);

        // Normalised rotation matrix
        const r00 = m[0] / sx, r10 = m[1] / sx, r20 = m[2] / sx;
        const r01 = m[4] / sy, r11 = m[5] / sy, r21 = m[6] / sy;
        const r02 = m[8] / sz, r12 = m[9] / sz, r22 = m[10] / sz;

        // Rotation matrix → quaternion
        const trace = r00 + r11 + r22;
        let qx: number, qy: number, qz: number, qw: number;

        if (trace > 0) {
            const s = 0.5 / Math.sqrt(trace + 1.0);
            qw = 0.25 / s;
            qx = (r21 - r12) * s;
            qy = (r02 - r20) * s;
            qz = (r10 - r01) * s;
        } else if (r00 > r11 && r00 > r22) {
            const s = 2.0 * Math.sqrt(1.0 + r00 - r11 - r22);
            qw = (r21 - r12) / s;
            qx = 0.25 * s;
            qy = (r01 + r10) / s;
            qz = (r02 + r20) / s;
        } else if (r11 > r22) {
            const s = 2.0 * Math.sqrt(1.0 + r11 - r00 - r22);
            qw = (r02 - r20) / s;
            qx = (r01 + r10) / s;
            qy = 0.25 * s;
            qz = (r12 + r21) / s;
        } else {
            const s = 2.0 * Math.sqrt(1.0 + r22 - r00 - r11);
            qw = (r10 - r01) / s;
            qx = (r02 + r20) / s;
            qy = (r12 + r21) / s;
            qz = 0.25 * s;
        }

        return {
            translation: [tx, ty, tz],
            rotation: [qx, qy, qz, qw],
            scale: [sx, sy, sz],
        };
    }
}
