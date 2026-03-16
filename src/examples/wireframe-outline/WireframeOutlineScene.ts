import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';
import { Matrix4f, Vector4f } from '../../math';
import { GLBLoader } from '../../model/glb/GLBLoader';
import { GLBModel } from '../../model/glb/GLBModel';
import { WireFrameRenderingPipeline } from '../../rendering-pipelines/WireFrameRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';

/**
 * Wireframe outline rendering of a GLB model using the surface-ID
 * edge-detection technique.
 *
 * Each mesh primitive's connected components are assigned a unique
 * surface ID.  Every frame the triangles are rasterized into a
 * surface-ID buffer (with depth testing for hidden-surface removal),
 * then a post-process pass detects edges wherever neighbouring pixels
 * differ in surface ID or depth, producing clean non-antialiased
 * wireframe outlines.
 *
 * @see {@link WireFrameRenderingPipeline}
 */
export class WireframeOutlineScene extends AbstractScene {

    private model: GLBModel;
    private renderingPipeline: WireFrameRenderingPipeline;

    // Auto-fit camera parameters (computed from model bounds)
    private modelCenter: Vector4f;
    private autoScale: number;
    private cameraZ: number;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.renderingPipeline = new WireFrameRenderingPipeline(framebuffer);
        this.renderingPipeline.setCullFace(CullFace.BACK);

        // Dark outlines on a white background
        this.renderingPipeline.setOutlineColor(Color.BLACK.toPackedFormat());
        this.renderingPipeline.setBackgroundColor(Color.WHITE.toPackedFormat());

        return GLBLoader.load(
            require('@assets/glb/tugboat.glb')
        ).then((meshGroups) => {
            this.model = new GLBModel(meshGroups);

            // Compute surface IDs once from the merged mesh topology
            this.renderingPipeline.computeSurfaceIds(this.model.mergedMesh);

            // Auto-fit camera to model bounds
            const bounds = this.model.computeBounds();
            this.modelCenter = bounds.center;
            const radius = Math.max(bounds.radius, 0.001);

            const targetRadius = 3.0;
            this.autoScale = targetRadius / radius;
            this.cameraZ = -(2.8 * targetRadius);
        });
    }

    public render(framebuffer: Framebuffer, time: number): void {
        // Clear depth buffer and surface-ID buffer
        framebuffer.clearDepthBuffer();
        this.renderingPipeline.setFramebuffer(framebuffer);
        this.renderingPipeline.clearBuffers();

        const modelViewMatrix: Matrix4f = this.getModelViewMatrix(time);
        const mesh: FlatshadedMesh = this.model.mergedMesh;

        // Transform all vertices into view space
        for (let i = 0; i < mesh.points.length; i++) {
            modelViewMatrix.multiplyHomArr(mesh.points[i], mesh.transformedPoints[i]);
        }

        // Rasterize every face into the surface-ID + depth buffers.
        // Order doesn't matter because the depth buffer resolves visibility.
        let currentDoubleSided: boolean = false;
        for (let fi = 0; fi < mesh.faces.length; fi++) {
            const ds: boolean = this.model.isFaceDoubleSided(fi);
            if (ds !== currentDoubleSided) {
                currentDoubleSided = ds;
                this.renderingPipeline.setCullFace(ds ? CullFace.DISABLED : CullFace.BACK);
            }
            this.renderingPipeline.drawFace(framebuffer, mesh, fi);
        }

        // Post-process: detect edges in the surface-ID / depth buffers
        // and write outline pixels into the colour framebuffer.
        this.renderingPipeline.postProcessOutlines(framebuffer);
    }

    private getModelViewMatrix(elapsedTime: number): Matrix4f {
        return Matrix4f.constructTranslationMatrix(0, 0, this.cameraZ)
            .multiplyMatrix(Matrix4f.constructYRotationMatrix(-elapsedTime * 0.0006))
            .multiplyMatrix(Matrix4f.constructScaleMatrix(this.autoScale, this.autoScale, this.autoScale))
            .multiplyMatrix(Matrix4f.constructTranslationMatrix(
                -this.modelCenter.x, -this.modelCenter.y, -this.modelCenter.z
            ));
    }

}
