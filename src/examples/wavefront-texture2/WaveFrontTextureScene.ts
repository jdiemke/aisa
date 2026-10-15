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
            TextureUtils.load(require('@assets/wavefront/spikes/texture.png'), false).then(
                (texture: Texture) => this.platonian = texture
            ),
            WavefrontLoader.loadWithTexture(require('@assets/wavefront/spikes/spike-ball-tex.obj')).then(
                (x: Array<TexturedMesh>) => this.platonianMesh = x
            ),
            TextureUtils.load(require('@assets/flood2.png'), false).then(
                texture => this.flood = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        const elapsedTime: number = time;

        framebuffer.clearColorBuffer(Color.BLACK.toPackedFormat());
        framebuffer.clearColorBuffer(Color.LIME.toPackedFormat());
        framebuffer.clearDepthBuffer();
        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.flood.texture)

        framebuffer.setTexture(this.platonian);
        this.texturedRenderingPipeline.setFramebuffer(framebuffer);
        this.texturedRenderingPipeline.setModelViewMatrix(this.getModelViewMatrix(elapsedTime));
        this.texturedRenderingPipeline.drawMeshArray(framebuffer, this.platonianMesh);
    }

    private getModelViewMatrix(elapsedTime: number): Matrix4f {
        /*const camera: Matrix4f = Matrix4f.constructTranslationMatrix(18, 2, -74).multiplyMatrix(
            Matrix4f.constructYRotationMatrix(-elapsedTime * 0.0006)
        );*/

        const camera: Matrix4f = Matrix4f.constructTranslationMatrix(Math.sin(elapsedTime*0.001)*30, Math.cos(elapsedTime*0.0018)*18, -70).multiplyMatrix(
            Matrix4f.constructYRotationMatrix(-elapsedTime * 0.002)
        ).multiplyMatrix(
            Matrix4f.constructXRotationMatrix(-elapsedTime * 0.0018)
        ).multiplyMatrix(
            Matrix4f.constructZRotationMatrix(-elapsedTime * 0.0023)
        ).multiplyMatrix(Matrix4f.constructTranslationMatrix(0, 20, 0));

        //return camera.multiplyMatrix(Matrix4f.constructScaleMatrix(8, 8, 8));
        const scale = (Math.sin(elapsedTime*0.003)*0.5+0.5)*0.24+1;
        return camera.multiplyMatrix(Matrix4f.constructScaleMatrix(8*scale, 8*scale, 8*scale));
    }

}
