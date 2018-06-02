import { Canvas } from '../../Canvas';
import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Matrix4f, Vector3f } from '../../math';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { FlatShadingRenderingPipeline } from '../../rendering-pipelines/FlatShadingRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';

export class GearsScene extends AbstractScene {

    private blurred: Texture;
    private noise: Texture;
    private blenderObj3: any;
    private accumulationBuffer: Uint32Array = new Uint32Array(320 * 200);
    private renderingPipeline: FlatShadingRenderingPipeline;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.renderingPipeline = new FlatShadingRenderingPipeline(framebuffer);
        framebuffer.setCullFace(CullFace.FRONT);
        this.blenderObj3 = framebuffer.getBlenderScene2(require('../../assets/gear.json'), false);
        console.log(JSON.stringify(this.blenderObj3));
        return Promise.all([
            TextureUtils.load(require('../../assets/blurredBackground.png'), false).then(
                (texture: Texture) => this.blurred = texture
            ),
            TextureUtils.generateProceduralNoise().then(
                (texture: Texture) => this.noise = texture
            )
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();
        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);

        this.drawBlenderScene4(framebuffer, time, null, null);
        /*  [
              { tex: this.texture10, scale: 0.0, alpha: 1.0 },
              { tex: this.texture11, scale: 2.3, alpha: 0.5 },
              { tex: this.texture13, scale: 1.6, alpha: 0.25 },
              { tex: this.texture13, scale: 0.7, alpha: 0.22 },
              { tex: this.texture13, scale: -0.4, alpha: 0.22 },
          ], this.dirt);*/

        const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
        framebuffer.drawTexture(0, 0, texture3, 0.75);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);
        framebuffer.noise(time, this.noise);
    }

    public drawBlenderScene4(framebuffer: Framebuffer, elapsedTime: number,
        texture: Array<{ tex: Texture, scale: number, alpha: number }>, dirt: Texture): void {
        framebuffer.clearDepthBuffer();

        const camera: Matrix4f = Matrix4f.constructTranslationMatrix(0, 0, -21).multiplyMatrix(
            Matrix4f.constructYRotationMatrix(elapsedTime * 0.0002)
                .multiplyMatrix(
                    Matrix4f.constructXRotationMatrix(elapsedTime * 0.0002)
                )
        );

        let scale: number = 0.1 * 2.1 * 2.1;
        let factor: number = 2.1 - 0.09 - 0.09;
        const fade: number = 0.09;
        const dampFactor: number = Math.sin(elapsedTime * 0.00001) * 0.5 + 0.5;
        for (let i: number = 1; i < 6; i++) {
            scale *= factor;
            factor -= fade;

            let modelViewMartrix = Matrix4f.constructYRotationMatrix(elapsedTime * 0.0005 + dampFactor * 0.7 * (4 - i)).multiplyMatrix(Matrix4f.constructScaleMatrix(scale, scale, scale));
            modelViewMartrix = Matrix4f.constructXRotationMatrix(elapsedTime * 0.0006 + dampFactor * 0.7 * (4 - i)).multiplyMatrix(modelViewMartrix);

            let mv = camera.multiplyMatrix(modelViewMartrix);
            let model = this.blenderObj3[0];

            this.renderingPipeline.draw(model, mv, 246, 165, 177);
        }
        let lensflareScreenSpace = framebuffer.project(camera.multiply(new Vector3f(16.0 * 20, 16.0 * 20, 0)));

        //framebuffer.drawLensFlare(lensflareScreenSpace, elapsedTime * 0.3, texture, dirt);
    }

}
