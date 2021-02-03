import { Color } from '../../core/Color';
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
export class WaveFrontTextureScene extends AbstractScene {

    private platonian: Texture;
    private platonianMesh: Array<TexturedMesh>;

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.setCullFace(CullFace.FRONT);

        return Promise.all([
            TextureUtils.load(require('../../assets/baked_susanna.png'), false).then(
                (texture: Texture) => this.platonian = texture
            ),
            WavefrontLoader.loadWithTexture(require('../../assets/susanna.obj')).then(
                (x: Array<TexturedMesh>) => this.platonianMesh = x
            )
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const elapsedTime: number = Date.now();

        framebuffer.clearColorBuffer(Color.BLACK.toPackedFormat());
        framebuffer.clearDepthBuffer();

        framebuffer.setTexture(this.platonian);
        framebuffer.texturedRenderingPipeline.setModelViewMatrix(this.getModelViewMatrix(elapsedTime));
        framebuffer.texturedRenderingPipeline.drawMeshArray(framebuffer, this.platonianMesh);
    }

    private getModelViewMatrix(elapsedTime: number): Matrix4f {
        const camera: Matrix4f = Matrix4f.constructTranslationMatrix(18, 2, -74).multiplyMatrix(
            Matrix4f.constructYRotationMatrix(-elapsedTime * 0.0006)
        );

        return camera.multiplyMatrix(Matrix4f.constructScaleMatrix(8, 8, 8));
    }

}
