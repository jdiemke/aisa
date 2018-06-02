import { Canvas } from '../../Canvas';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Matrix4f, Vector3f } from '../../math';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { AbstractScene } from '../../scenes/AbstractScene';
import { SkyBox } from '../../SkyBox';
import { Texture, TextureUtils } from '../../texture';

/**
 * TODO:
 * - Move procedural texture generation into dedicated class
 * - create Mesh / Textured Mesh class
 * - Create Lens Flare class
 * - Create Pipeline class
 */
export class BakedLighting extends AbstractScene {

    private skyBox: SkyBox;

    private baked: Texture;
    private noise: Texture;
    private dirt: Texture;

    private blenderObj8: any;

    private accumulationBuffer: Uint32Array = new Uint32Array(320 * 200);

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.setCullFace(CullFace.BACK);
        this.blenderObj8 = framebuffer.getBlenderScene(require('../../assets/abstract.json'), false);
        this.skyBox = new SkyBox();

        return Promise.all([
            this.skyBox.init(),
            TextureUtils.load(require('../../assets/Backed.png'), false).then(
                (texture: Texture) => this.baked = texture
            ),
            TextureUtils.load(require('../../assets/dirt.png'), true).then(
                (texture: Texture) => this.dirt = texture
            ),
            TextureUtils.generateProceduralNoise().then(
                (texture: Texture) => this.noise = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();

        this.drawBlenderScene7(framebuffer, time - 1100000, null, null);
        /*
            [
                //   { tex: this.texture10, scale: 0.0, alpha: 1.0 },
                { tex: this.texture11, scale: 2.3, alpha: 0.5 },
                { tex: this.texture13, scale: 1.6, alpha: 0.25 },
                { tex: this.texture13, scale: 0.7, alpha: 0.22 },
                { tex: this.texture13, scale: -0.4, alpha: 0.22 },
            ], this.dirt, this.skybox);*/

        const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
        framebuffer.drawTexture(0, 0, texture3, 0.75);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);
        framebuffer.noise(time, this.noise);
    }

    public drawBlenderScene7(framebuffer: Framebuffer, elapsedTime: number,
                             texture: { tex: Texture, scale: number, alpha: number }[], dirt: Texture): void {
        elapsedTime *= 0.2;
        framebuffer.clearDepthBuffer();

        let camera: Matrix4f =
            Matrix4f.constructTranslationMatrix(0, 0, -134 + (Math.sin(elapsedTime * 0.00007) * 0.5 + 0.5) * 17).multiplyMatrix(
                Matrix4f.constructXRotationMatrix(elapsedTime * 0.0006).multiplyMatrix(
                    Matrix4f.constructYRotationMatrix(-elapsedTime * 0.0005).multiplyMatrix(
                        Matrix4f.constructTranslationMatrix(0, -25, 0)
                    )));


        let mv: Matrix4f = camera.multiplyMatrix(Matrix4f.constructScaleMatrix(13, 13, 13));

        this.skyBox.draw(framebuffer, mv);
        framebuffer.clearDepthBuffer();

        framebuffer.setTexture(this.baked);

        for (let j = 0; j < this.blenderObj8.length; j++) {
            let model = this.blenderObj8[j];
            framebuffer.texturedRenderingPipeline.draw(model, mv);
        }

        let scale = 20;
        let lensflareScreenSpace = framebuffer.project(camera.getRotation().multiply(new Vector3f(1.1 * scale, 2 * scale, -0.9 * scale)));

        // framebuffer.drawLensFlare(lensflareScreenSpace, elapsedTime * 1.2, texture, dirt);
    }

}
