import { Color, AbstractScene } from '@core';
import { CullFace } from '@engine/geometry/primitives';
import { Framebuffer } from '@engine/rendering/Framebuffer';
import { Matrix4f } from '@engine/math';
import { WavefrontLoader } from '@engine/model/formats/wavefront-obj';
import { TexturedMesh, TexturingRenderingPipeline } from '@engine/rendering/pipelines';
import { Texture, TextureUtils } from '@engine/texture';

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
