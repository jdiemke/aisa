import { Framebuffer } from '@engine/rendering/Framebuffer';
import { Torus } from '@engine/geometry/objects';
import { Matrix4f } from '@engine/math';
import { AbstractScene } from '@core';
import { Texture, TextureUtils } from '@engine/texture';
import { GouraudShadingRenderingPipeline } from '@engine/rendering/pipelines';

export class MovingTorusScene extends AbstractScene {

    private background: Texture;
    private torus: Torus = new Torus();
    private renderingPipeline: GouraudShadingRenderingPipeline;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.renderingPipeline = new GouraudShadingRenderingPipeline(framebuffer);

        return Promise.all([
            TextureUtils.load(require('@assets/atlantis.png'), true).then(
                (texture: Texture) => this.background = texture
            )
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        // framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.background.texture);
        framebuffer.scaleClipBlitter.drawScaledTextureClipBi(0,0,framebuffer.width, framebuffer.height, this.background, 1.0);

        this.shadingTorus2(framebuffer, time * 0.02);
    }

    /**
     * https://www.youtube.com/watch?v=VMD7fsCYO9o
     * http://www.cs.jhu.edu/~misha/Fall16/13.pdf
     * http://www.cubic.org/docs/3dclip.htm
     *
     * @param {number} elapsedTime
     * @memberof Framebuffer
     */
    public shadingTorus2(framebuffer: Framebuffer, elapsedTime: number): void {
        framebuffer.clearDepthBuffer();

        let modelViewMartrix: Matrix4f = Matrix4f.constructYRotationMatrix(elapsedTime * 0.09);
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.08));
        modelViewMartrix = Matrix4f.constructTranslationMatrix(Math.sin(elapsedTime * 0.04) * 25,
            Math.sin(elapsedTime * 0.05) * 9, -24).multiplyMatrix(modelViewMartrix);

        this.renderingPipeline.draw(framebuffer, this.torus.getMesh(), modelViewMartrix);
    }

}
