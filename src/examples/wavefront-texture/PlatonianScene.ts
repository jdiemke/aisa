import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Matrix4f } from '../../math';
import { WavefrontLoader } from '../../model/wavefront-obj/WavefrontLoader';
import { TexturedMesh } from '../../rendering-pipelines/TexturedMesh';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';

/**
 * TODO: extract lens into effect class
 */
export class PlatonianScene extends AbstractScene {

    private blurred: Texture;
    private platonian: Texture;
    private noise: Texture;

    private platonianMesh: Array<TexturedMesh>;

    private accumulationBuffer: Uint32Array = new Uint32Array(320 * 200);

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.setCullFace(CullFace.FRONT);

        return Promise.all([
            TextureUtils.load(require('../../assets/blurredBackground.png'), false).then(
                (texture: Texture) => this.blurred = texture
            ),
            TextureUtils.load(require('../../assets/texture.png'), false).then(
                (texture: Texture) => this.platonian = texture
            ),
            TextureUtils.generateProceduralNoise().then(
                (texture: Texture) => this.noise = texture
            ),
            WavefrontLoader.loadWithTexture(require('../../assets/spike-ball-tex.obj')).then(
                (x: Array<TexturedMesh>) => this.platonianMesh = x
            )
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();

        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);

        this.drawBlenderScene8(framebuffer, time * 2);

        const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
        framebuffer.drawTexture(0, 0, texture3, 0.75);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);
        framebuffer.noise(time, this.noise);
    }

    public drawBlenderScene8(framebuffer: Framebuffer, elapsedTime: number): void {
        framebuffer.clearDepthBuffer();

        const camera: Matrix4f =
            Matrix4f.constructTranslationMatrix(0, 0, -64 + (Math.sin(elapsedTime * 0.00007) * 0.5 + 0.5) * 17)
                .multiplyMatrix(
                    Matrix4f.constructXRotationMatrix(elapsedTime * 0.00035).multiplyMatrix(
                        Matrix4f.constructYRotationMatrix(-elapsedTime * 0.0003)));

        const mv: Matrix4f = camera.multiplyMatrix(Matrix4f.constructScaleMatrix(8, 8, 8));

        framebuffer.setTexture(this.platonian);
        // FIXME: move looping code into utils method or helper class!
        for (let j: number = 0; j < this.platonianMesh.length; j++) {
            const model: TexturedMesh = this.platonianMesh[j];
            framebuffer.texturedRenderingPipeline.draw(model, mv);
        }
    }

}
