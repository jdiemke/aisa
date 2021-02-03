import { Framebuffer } from '../../Framebuffer';
import { Matrix4f } from '../../math';
import { TexturedMesh } from '../../rendering-pipelines/TexturedMesh';
import { TexturingRenderingPipeline } from '../../rendering-pipelines/TexturingRenderingPipeline';

class TexturedMeshGroup {

    constructor(private meshes: Array<TexturedMesh>, private pipeline: TexturingRenderingPipeline) {
    }

    public draw(framebuffer: Framebuffer, mv: Matrix4f): void {
        this.pipeline.drawMeshArray(framebuffer, this.meshes);
    }

}
