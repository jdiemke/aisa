import { Canvas } from '../../Canvas';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Torus } from '../../geometrical-objects/Torus';
import { Matrix4f, Vector3f } from '../../math';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';

export class MovingTorusScene extends AbstractScene {

    private background: Texture;
    private torus: Torus = new Torus();

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.setCullFace(CullFace.BACK);

        return Promise.all([
            TextureUtils.load(require('../../assets/atlantis.png'), true).then(
                (texture: Texture) => this.background = texture
            )
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();

        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.background.texture);
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

        framebuffer.renderingPipeline.draw(this.torus.getMesh(), modelViewMartrix, 190, 100, 100);
    }

}
