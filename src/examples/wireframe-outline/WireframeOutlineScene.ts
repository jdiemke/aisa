import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Cube } from '../../geometrical-objects/Cube';
import { Dodecahedron } from '../../geometrical-objects/Dodecahedron';
import { FlatShadedFace } from '../../geometrical-objects/FlatShadedFace';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';
import { TorusKnot } from '../../geometrical-objects/TorusKnot';
import { Matrix4f, Vector4f } from '../../math';
import { WireFrameRenderingPipeline } from '../../rendering-pipelines/WireFrameRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';

/**
 * Wireframe outline rendering of a cube using the surface-ID
 * edge-detection technique.
 *
 * @see {@link WireFrameRenderingPipeline}
 */
export class WireframeOutlineScene extends AbstractScene {

    private mesh: FlatshadedMesh;
    private renderingPipeline: WireFrameRenderingPipeline;

    // Auto-fit camera parameters (computed from mesh bounds)
    private modelCenter: Vector4f;
    private autoScale: number;
    private cameraZ: number;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.renderingPipeline = new WireFrameRenderingPipeline(framebuffer);
        this.renderingPipeline.setCullFace(CullFace.BACK);

        // Dark outlines on a white background
        this.renderingPipeline.setOutlineColor(Color.BLACK.toPackedFormat());
        this.renderingPipeline.setBackgroundColor(Color.WHITE.toPackedFormat());

        // Explode shared-vertex mesh into per-face vertices so that
        // computeSurfaceIds can distinguish faces with different normals.
        this.mesh = WireframeOutlineScene.explodeMesh(new Dodecahedron().getMesh());

        // Compute surface IDs once from the mesh topology.
        // Use a tight threshold (30°) so that only truly coplanar faces
        // (e.g. triangles within the same pentagonal face) are merged.
        // The default 80° is too wide for the dodecahedron whose adjacent
        // face normals differ by only ~63°.
        this.renderingPipeline.computeSurfaceIds(this.mesh, 30);

        // Auto-fit camera to mesh bounds
        const mesh = this.mesh;
        const min = new Vector4f(Infinity, Infinity, Infinity);
        const max = new Vector4f(-Infinity, -Infinity, -Infinity);
        for (const p of mesh.points) {
            if (p.x < min.x) min.x = p.x;
            if (p.y < min.y) min.y = p.y;
            if (p.z < min.z) min.z = p.z;
            if (p.x > max.x) max.x = p.x;
            if (p.y > max.y) max.y = p.y;
            if (p.z > max.z) max.z = p.z;
        }
        this.modelCenter = new Vector4f(
            (min.x + max.x) / 2,
            (min.y + max.y) / 2,
            (min.z + max.z) / 2
        );
        const dx = max.x - min.x;
        const dy = max.y - min.y;
        const dz = max.z - min.z;
        const radius = Math.max(Math.sqrt(dx * dx + dy * dy + dz * dz) / 2, 0.001);

        const targetRadius = 3.0;
        this.autoScale = targetRadius / radius;
        this.cameraZ = -(5.8 * targetRadius);

        return Promise.resolve();
    }

    public render(framebuffer: Framebuffer, time: number): void {
        framebuffer.clearDepthBuffer();
        this.renderingPipeline.setFramebuffer(framebuffer);
        this.renderingPipeline.clearBuffers();

        const modelViewMatrix: Matrix4f = this.getModelViewMatrix(time);
        const mesh: FlatshadedMesh = this.mesh;

        for (let i = 0; i < mesh.points.length; i++) {
            modelViewMatrix.multiplyHomArr(mesh.points[i], mesh.transformedPoints[i]);
        }

        for (let fi = 0; fi < mesh.faces.length; fi++) {
            this.renderingPipeline.drawFace(framebuffer, mesh, fi);
        }

        this.renderingPipeline.postProcessOutlines(framebuffer);
    }

    private getModelViewMatrix(elapsedTime: number): Matrix4f {
        return Matrix4f.constructTranslationMatrix(0, 0, this.cameraZ)
            .multiplyMatrix(Matrix4f.constructYRotationMatrix(-elapsedTime * 0.0006))
            .multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.0004))
            .multiplyMatrix(Matrix4f.constructScaleMatrix(this.autoScale, this.autoScale, this.autoScale))
            .multiplyMatrix(Matrix4f.constructTranslationMatrix(
                -this.modelCenter.x, -this.modelCenter.y, -this.modelCenter.z
            ));
    }

    /**
     * Duplicate vertices per face so that each face owns its own
     * vertex copies.  This lets computeSurfaceIds distinguish faces
     * with different normals (shared vertices defeat the union-find).
     */
    private static explodeMesh(source: FlatshadedMesh): FlatshadedMesh {
        const faceCount = source.faces.length;
        const points: Array<Vector4f> = new Array(faceCount * 3);
        const faces: Array<FlatShadedFace> = new Array(faceCount);

        for (let i = 0; i < faceCount; i++) {
            const f = source.faces[i];
            points[i * 3]     = source.points[f.v1];
            points[i * 3 + 1] = source.points[f.v2];
            points[i * 3 + 2] = source.points[f.v3];

            const face = new FlatShadedFace();
            face.v1 = i * 3;
            face.v2 = i * 3 + 1;
            face.v3 = i * 3 + 2;
            face.n1 = f.n1;
            face.n2 = f.n2;
            face.n3 = f.n3;
            faces[i] = face;
        }

        return {
            points,
            normals: source.normals,
            faces,
            transformedPoints: points.map(() => new Vector4f(0, 0, 0, 0)),
            transformedNormals: source.normals.map(() => new Vector4f(0, 0, 0, 0))
        };
    }

}
