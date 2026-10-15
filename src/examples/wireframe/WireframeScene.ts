import { Color, AbstractScene } from '@core';
import { CullFace } from '@engine/geometry/primitives';
import { Framebuffer } from '@engine/rendering/Framebuffer';
import { FlatshadedMesh, Icosahedron } from '@engine/geometry/objects';
import { ModelViewMatrix } from '@engine/math';
import { WireFrameRenderingPipeline } from '@engine/rendering/pipelines';

/**
 * See-through wireframe rendering
 *
 * @see {@link WireFrameRenderingPipeline}
 */
export class WireframeScene extends AbstractScene {

    private mesh: FlatshadedMesh;
    private renderingPipeline: WireFrameRenderingPipeline;
    private modelView: ModelViewMatrix;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.renderingPipeline = new WireFrameRenderingPipeline(framebuffer);
        this.renderingPipeline.setCullFace(CullFace.BACK);

        this.renderingPipeline.setOutlineColor(Color.BLACK.toPackedFormat());
        this.renderingPipeline.setBackgroundColor(Color.SLATE_GRAY.toPackedFormat());

        this.mesh = new Icosahedron().getMesh();

        // Auto-fit camera to mesh bounds
        this.modelView = new ModelViewMatrix();
        this.modelView.extraScale = 2.5;
        this.modelView.autoFit(this.mesh.points);

        return Promise.resolve();
    }

    public render(framebuffer: Framebuffer, time: number): void {
        framebuffer.clearColorBuffer(Color.SLATE_GRAY.toPackedFormat());
        framebuffer.clearDepthBuffer();
        this.renderingPipeline.setFramebuffer(framebuffer);
        this.renderingPipeline.clearBuffers();

        this.renderingPipeline.drawSeeThroughWireframe(
            framebuffer, this.mesh, this.modelView.getMatrix(time)
        );
    }

}
