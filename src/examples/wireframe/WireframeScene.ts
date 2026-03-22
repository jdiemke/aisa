import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';
import { Icosahedron } from '../../geometrical-objects/Icosahedron';
import { ModelViewMatrix } from '../../math';
import { WireFrameRenderingPipeline } from '../../rendering-pipelines/WireFrameRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';

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
