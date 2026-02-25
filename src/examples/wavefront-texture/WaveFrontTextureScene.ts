import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Matrix4f } from '../../math';
import { WavefrontLoader } from '../../model/wavefront-obj/WavefrontLoader';
import { TexturedMesh } from '../../rendering-pipelines/TexturedMesh';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { TexturingRenderingPipeline } from '../../rendering-pipelines/TexturingRenderingPipeline';

/**
 * TODO: extract lens into effect class
 */
export class WaveFrontTextureScene extends AbstractScene {

    private platonian: Texture;
    private flood: Texture;
    private platonianMesh: Array<TexturedMesh>;
    private texturedRenderingPipeline: TexturingRenderingPipeline;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.texturedRenderingPipeline = new TexturingRenderingPipeline(framebuffer);
        this.texturedRenderingPipeline.setCullFace(CullFace.BACK);

        return Promise.all([
            TextureUtils.load(require('@assets/wavefront/baked_susanna.png'), false).then(
                (texture: Texture) => this.platonian = texture
            ),
            WavefrontLoader.loadWithTexture(require('@assets/wavefront/susanna.obj')).then(
                (x: Array<TexturedMesh>) => this.platonianMesh = x
            ),
   
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        const elapsedTime: number = time;

        framebuffer.clearColorBuffer(Color.BLACK.toPackedFormat());
        framebuffer.clearDepthBuffer();
        

        framebuffer.setTexture(this.platonian);
        this.texturedRenderingPipeline.setFramebuffer(framebuffer);
        this.texturedRenderingPipeline.setModelViewMatrix(this.getModelViewMatrix(elapsedTime));
        this.texturedRenderingPipeline.drawMeshArray(framebuffer, this.platonianMesh);
    }

    private getModelViewMatrix(elapsedTime: number): Matrix4f {
        const camera: Matrix4f = Matrix4f.constructTranslationMatrix(18, 2, -64).multiplyMatrix(
            Matrix4f.constructYRotationMatrix(-elapsedTime * 0.0006)
        );

   

        return camera.multiplyMatrix(Matrix4f.constructScaleMatrix(8, 8, 8));
        
    }

}
