import { Color } from '@core/Color';
import { CullFace } from '@engine/geometry/primitives/CullFace';
import { Framebuffer } from '@engine/rendering/Framebuffer';
import { FlatshadedMesh } from '@engine/geometry/objects/FlatshadedMesh';
import { Icosahedron } from '@engine/geometry/objects/Icosahedron';
import { ModelViewMatrix } from '@engine/math';
import { WireFrameRenderingPipeline } from '@engine/rendering/pipelines/WireFrameRenderingPipeline';
import { AbstractScene } from '@core/AbstractScene';

/**
 * Oscilloscope-style rendering scene based on WireframeOutlineScene.
 * Renders a wireframe mesh suitable for oscilloscope XY output.
 *
 * @see {@link WireFrameRenderingPipeline}
 */
export class OscilloscopeScene extends AbstractScene {

    private mesh: FlatshadedMesh;
    private renderingPipeline: WireFrameRenderingPipeline;
    private modelView: ModelViewMatrix;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.renderingPipeline = new WireFrameRenderingPipeline(framebuffer);
        this.renderingPipeline.setCullFace(CullFace.BACK);

        // Dark outlines on a white background
        this.renderingPipeline.setOutlineColor(Color.BLACK.toPackedFormat());
        this.renderingPipeline.setBackgroundColor(Color.WHITE.toPackedFormat());

        // Explode shared-vertex mesh into per-face vertices so that
        // computeSurfaceIds can distinguish faces with different normals.
        this.mesh = FlatshadedMesh.explode(new Icosahedron().getMesh());

        // Compute surface IDs once from the mesh topology.
        // Use a tight threshold (30°) so that only truly coplanar faces
        // are merged.
        this.renderingPipeline.computeSurfaceIds(this.mesh, 30);

        // Auto-fit camera to mesh bounds
        this.modelView = new ModelViewMatrix();
        this.modelView.extraScale = 1.35;
        this.modelView.autoFit(this.mesh.points);

        return Promise.resolve();
    }

    public render(framebuffer: Framebuffer, time: number): void {
        framebuffer.clearDepthBuffer();
        this.renderingPipeline.setFramebuffer(framebuffer);
        this.renderingPipeline.clearBuffers();

        const mesh: FlatshadedMesh = this.mesh;

        // --- Left side: outline mode (with postProcessOutlines) ---
        this.renderingPipeline.drawOutline(
            framebuffer, mesh, this.modelView.getMatrix(time)
        );


    }

}
