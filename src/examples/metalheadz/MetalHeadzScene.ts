import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Matrix4f, Vector3f } from '../../math';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { AbstractScene } from '../../scenes/AbstractScene';
import { SkyBox } from '../../SkyBox';
import { Texture, TextureUtils } from '../../texture';

const metalJson = require('../../assets/metalheadz.json');

export class MetalHeadzScene extends AbstractScene {

    private metalheadz: Texture;
    private texture11: Texture;
    private texture13: Texture;
    private noise: Texture;
    private dirt: Texture;
    private skyBox: SkyBox;

    private blenderObjMetal: any;

    private accumulationBuffer: Uint32Array = new Uint32Array(320 * 200);

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.setCullFace(CullFace.BACK);
        this.blenderObjMetal = framebuffer.getBlenderScene(metalJson, false);
        this.skyBox = new SkyBox();
        // TODO:
        // make classes for assets
        // skybox, lens flare, 3d modell

        return Promise.all([
            this.skyBox.init(),
            TextureUtils.load(require('../../assets/metalheadz.png'), false).then(
                (texture: Texture) => this.metalheadz = texture
            ),
            TextureUtils.load(require('../../assets/ring.png'), true).then(
                (texture: Texture) => this.texture11 = texture
            ),
            TextureUtils.load(require('../../assets/bokeh.png'), true).then(
                (texture: Texture) => this.texture13 = texture
            ),
            TextureUtils.generateProceduralNoise().then(
                (texture: Texture) => this.noise = texture
            ),
            TextureUtils.load(require('../../assets/dirt.png'), true).then(
                (texture: Texture) => this.dirt = texture
            ),
        ]);
    }

    public render(framebuffer: any): void {
        const time: number = Date.now();
        let elapsedTime = 0.2 * time;

        framebuffer.clearDepthBuffer();

        const camera: Matrix4f = this.computeCameraMovement(elapsedTime);
        const mv: Matrix4f = camera.multiplyMatrix(Matrix4f.constructScaleMatrix(7, 7, 7));

        // put skybox here
        this.skyBox.draw(framebuffer, mv);

        framebuffer.clearDepthBuffer();
        framebuffer.setBob(this.metalheadz);
        const scal: number = 1.0;
        for (let j: number = 0; j < this.blenderObjMetal.length; j++) {
            let model: any = this.blenderObjMetal[j];
            framebuffer.drawObjectTexture(model, mv, 244 * scal, 225 * scal, 216 * scal);
        }

        let scale = 20;
        let lensflareScreenSpace = framebuffer.project(camera.getRotation().multiply(new Vector3f(1.1 * scale, 2 * scale, -0.9 * scale)));

        framebuffer.drawLensFlare(lensflareScreenSpace, elapsedTime * 1.2, [
            { tex: this.texture11, scale: 2.3, alpha: 0.5 },
            { tex: this.texture13, scale: 1.6, alpha: 0.25 },
            { tex: this.texture13, scale: 0.7, alpha: 0.22 },
            { tex: this.texture13, scale: -0.4, alpha: 0.22 },
        ], this.dirt);

        const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
        framebuffer.drawTexture(0, 0, texture3, 0.75);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);
        framebuffer.noise(time, this.noise);
    }

    private computeCameraMovement(elapsedTime: number): Matrix4f {
        return Matrix4f.constructTranslationMatrix(0, 0, -134 + (Math.sin(elapsedTime * 0.00007) * 0.5 + 0.5) * 17)
            .multiplyMatrix(
                Matrix4f.constructXRotationMatrix(elapsedTime * 0.0008).multiplyMatrix(
                    Matrix4f.constructYRotationMatrix(-elapsedTime * 0.0009).multiplyMatrix(
                        Matrix4f.constructTranslationMatrix(0, 0, 0)
                    )
                )
            );
    }

}
