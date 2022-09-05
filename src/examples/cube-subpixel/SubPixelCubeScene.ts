import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Cube } from '../../geometrical-objects/Cube';
import { Matrix4f } from '../../math';
import { SubPixelRenderingPipeline } from '../../rendering-pipelines/SubPixelRenderingPipeline';
import { GouraudShadingRenderingPipeline } from '../../rendering-pipelines/GouraudShadingRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';

export class SubPixelCubeScene extends AbstractScene {

    private static BACKGROUND_COLOR: number = Color.BLACK.toPackedFormat();
    private subPixelRenderingPipeline: SubPixelRenderingPipeline;
    private gouraudRenderingPipeline: GouraudShadingRenderingPipeline;
    private cubeMesh: Cube = new Cube();

    public init(framebuffer: Framebuffer): Promise<any> {

        return Promise.all([
            this.subPixelRenderingPipeline = new SubPixelRenderingPipeline(framebuffer),
            this.subPixelRenderingPipeline.setCullFace(CullFace.BACK),

            this.gouraudRenderingPipeline = new GouraudShadingRenderingPipeline(framebuffer),
            this.gouraudRenderingPipeline.setCullFace(CullFace.BACK),
        ]);

    }

    public render(framebuffer: Framebuffer, time: number): void {
        // rotate slowly to showcase
        const elapsedTime: number = time * 0.001;
        framebuffer.clearColorBuffer(SubPixelCubeScene.BACKGROUND_COLOR);
        framebuffer.clearDepthBuffer();

        // compare subpixel to gourad
        this.subPixelRenderingPipeline.draw(framebuffer, this.cubeMesh.getMesh(), this.getModelViewMatrix(elapsedTime,-3));
        this.gouraudRenderingPipeline.draw(framebuffer, this.cubeMesh.getMesh(), this.getModelViewMatrix(elapsedTime,3));
    }

    public renderBackground(framebuffer: Framebuffer, time: number): void {
        const elapsedTime: number = time * 0.02;
        framebuffer.clearDepthBuffer();
        this.subPixelRenderingPipeline.draw(framebuffer, this.cubeMesh.getMesh(), this.getModelViewMatrix(elapsedTime,5));
    }

    private getModelViewMatrix(elapsedTime: number, xShift: number): Matrix4f {
        const scale: number = 3.2;

        return Matrix4f.constructTranslationMatrix(xShift, 0, -12).multiplyMatrix(
            Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(
                Matrix4f.constructYRotationMatrix(elapsedTime * 0.05)).multiplyMatrix(
                    Matrix4f.constructXRotationMatrix(elapsedTime * 0.08)));
    }

}
