import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Matrix4f } from '../../math';
import { WavefrontLoader } from '../../model/wavefront-obj/WavefrontLoader';
import { TexturedMesh } from '../../rendering-pipelines/TexturedMesh';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { Color } from '../../core/Color';

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
            TextureUtils.load(require('../../assets/baked_susanna.png'), false).then(
                (texture: Texture) => this.platonian = texture
            ),
            TextureUtils.generateProceduralNoise().then(
                (texture: Texture) => this.noise = texture
            ),
            WavefrontLoader.loadWithTexture(require('../../assets/susanna.obj')).then(
                (x: Array<TexturedMesh>) => this.platonianMesh = x
            )
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();
        framebuffer.clearColorBuffer(Color.BLACK.toPackedFormat());
        this.drawBlenderScene8(framebuffer, time * 2);
    }

    public drawBlenderScene8(framebuffer: Framebuffer, elapsedTime: number): void {
        framebuffer.clearDepthBuffer();

        const camera: Matrix4f =
        Matrix4f.constructTranslationMatrix(18, 2, -74 )
        .multiplyMatrix(
                Matrix4f.constructYRotationMatrix(-elapsedTime * 0.0003));

        const mv: Matrix4f = camera.multiplyMatrix(Matrix4f.constructScaleMatrix(8, 8, 8));

        framebuffer.setTexture(this.platonian);
        // FIXME: move looping code into utils method or helper class!
        for (let j: number = 0; j < this.platonianMesh.length; j++) {
            const model: TexturedMesh = this.platonianMesh[j];
            framebuffer.texturedRenderingPipeline.draw(model, mv);
        }
    }

}
