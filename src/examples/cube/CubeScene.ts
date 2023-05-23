import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Cube } from '../../geometrical-objects/Cube';
import { Matrix4f } from '../../math';
import { GouraudShadingRenderingPipeline } from '../../rendering-pipelines/GouraudShadingRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';

export class CubeScene extends AbstractScene {

    private renderingPipeline: GouraudShadingRenderingPipeline;
    private cubeMesh: Cube = new Cube();
    private fairlight: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.renderingPipeline = new GouraudShadingRenderingPipeline(framebuffer);
        this.renderingPipeline.setCullFace(CullFace.BACK);

        return Promise.all([
            TextureUtils.load(require('../../assets/logo-fairlight-10.png'), false).then(texture => this.fairlight = texture),
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.fairlight.texture);
        framebuffer.clearDepthBuffer();

        this.renderCube(framebuffer,time);
    }

    public renderCube(framebuffer: Framebuffer, time: number): void {
        const elapsedTime: number = time * 0.02;
        this.renderingPipeline.draw(framebuffer, this.cubeMesh.getMesh(), this.getModelViewMatrix(elapsedTime));
    }

    public renderBackground(framebuffer: Framebuffer, time: number): void {
        const elapsedTime: number = time * 0.02;
        framebuffer.clearDepthBuffer();
        this.renderingPipeline.draw(framebuffer, this.cubeMesh.getMesh(), this.getModelViewMatrix(elapsedTime));
    }

    private getModelViewMatrix(elapsedTime: number): Matrix4f {
        const scale: number = 6.2  +Math.sin(elapsedTime * 0.05)*3;

        return Matrix4f.constructTranslationMatrix(Math.sin(elapsedTime * 0.08)*8, Math.sin(elapsedTime * 0.05)*6, -20).multiplyMatrix(
            Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(
                Matrix4f.constructYRotationMatrix(elapsedTime * 0.09)).multiplyMatrix(
                    Matrix4f.constructXRotationMatrix(elapsedTime * 0.08)));
    }

}
