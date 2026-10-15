import { CullFace } from '@engine/geometry/primitives';
import { Framebuffer } from '@engine/rendering/Framebuffer';
import { Cube } from '@engine/geometry/objects';
import { Matrix4f } from '@engine/math';
import { GouraudShadingRenderingPipeline } from '@engine/rendering/pipelines';
import { AbstractScene } from '@core';
import { Texture, TextureUtils } from '@engine/texture';

export class CubeScene extends AbstractScene {

    private renderingPipeline: GouraudShadingRenderingPipeline;
    private cubeMesh: Cube = new Cube();
    private fairlight: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.renderingPipeline = new GouraudShadingRenderingPipeline(framebuffer);
        this.renderingPipeline.setCullFace(CullFace.BACK);

        return Promise.all([
            TextureUtils.load(require('@assets/logo-fairlight-10.png'), false).then(texture => this.fairlight = texture),
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        framebuffer.scaleClipBlitter.drawScaledTextureClipBi(0, 0, framebuffer.width, framebuffer.height, this.fairlight, 1.0);
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
