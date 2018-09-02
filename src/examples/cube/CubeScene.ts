import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Cube } from '../../geometrical-objects/Cube';
import { Matrix4f } from '../../math';
import { FlatShadingRenderingPipeline } from '../../rendering-pipelines/FlatShadingRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';

/**
 * TODO: use cube mesh and draw using drawObject2
 */
export class CubeScene extends AbstractScene {

    private static BACKGROUND_COLOR: number = Color.BLACK.toPackedFormat();
    private renderingPipeline: FlatShadingRenderingPipeline;
    private cubeMesh: Cube = new Cube();

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.setCullFace(CullFace.BACK);
        this.renderingPipeline = new FlatShadingRenderingPipeline(framebuffer);
        return Promise.all([]);
    }

    public render(framebuffer: Framebuffer): void {
        const elapsedTime: number = Date.now() * 0.02;

        framebuffer.clearColorBuffer(CubeScene.BACKGROUND_COLOR);
        framebuffer.clearDepthBuffer();

        this.renderingPipeline.draw(this.cubeMesh.getMesh(), this.getModelViewMatrix(elapsedTime), 100, 200, 100);
    }

    private getModelViewMatrix(elapsedTime: number): Matrix4f {
        const scale: number = 3.2;

        return Matrix4f.constructTranslationMatrix(0, 0, -9).multiplyMatrix(
            Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(
                Matrix4f.constructYRotationMatrix(elapsedTime * 0.05)).multiplyMatrix(
                    Matrix4f.constructXRotationMatrix(elapsedTime * 0.08)));
    }

}
