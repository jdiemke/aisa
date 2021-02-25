import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Cube } from '../../geometrical-objects/Cube';
import { Matrix4f } from '../../math';
import { FlatShadingRenderingPipeline } from '../../rendering-pipelines/FlatShadingRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';

export class CubeScene extends AbstractScene {

    private static BACKGROUND_COLOR: number = Color.BLACK.toPackedFormat();
    private renderingPipeline: FlatShadingRenderingPipeline;
    private cubeMesh: Cube = new Cube();

    public init(framebuffer: Framebuffer): Promise<any> {
        this.renderingPipeline = new FlatShadingRenderingPipeline(framebuffer);
        this.renderingPipeline.setCullFace(CullFace.BACK);

        return Promise.all([]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        const elapsedTime: number = time * 0.02;
        framebuffer.clearColorBuffer(CubeScene.BACKGROUND_COLOR);
        framebuffer.clearDepthBuffer();
        this.renderingPipeline.draw(framebuffer, this.cubeMesh.getMesh(), this.getModelViewMatrix(elapsedTime));
    }

    public renderBackground(framebuffer: Framebuffer, time: number): void {
        const elapsedTime: number = time * 0.02;
        framebuffer.clearDepthBuffer();
        this.renderingPipeline.draw(framebuffer, this.cubeMesh.getMesh(), this.getModelViewMatrix(elapsedTime));
    }

    private getModelViewMatrix(elapsedTime: number): Matrix4f {
        const scale: number = 3.2;

        return Matrix4f.constructTranslationMatrix(0, 0, -9).multiplyMatrix(
            Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(
                Matrix4f.constructYRotationMatrix(elapsedTime * 0.05)).multiplyMatrix(
                    Matrix4f.constructXRotationMatrix(elapsedTime * 0.08)));
    }

}
