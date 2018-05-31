import { Canvas } from '../../Canvas';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { Vector3f, Matrix4f } from '../../math';
import { Torus } from '../../geometrical-objects/Torus';
import { TorusKnot } from '../../geometrical-objects/TorusKnot';

export class TorusKnotScene extends AbstractScene {

    private razorLogo: Texture;
    private torus: TorusKnot = new TorusKnot();

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.setCullFace(CullFace.BACK);

        return Promise.all([]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();
        const elapsedTime: number = 0.02 * time;

        framebuffer.clearColorBuffer(0);
        framebuffer.clearDepthBuffer();


        let scale = 1.0;

        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.035));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.04));


        let ukBasslineBpm = 130 / 2;
        let ukBasslineClapMs = 60000 / ukBasslineBpm;
        let smashTime = time % ukBasslineClapMs;
        let smash = (framebuffer.cosineInterpolate(0, 15, smashTime) - framebuffer.cosineInterpolate(15, 200, smashTime) +
            0.4 * framebuffer.cosineInterpolate(200, 300, smashTime) - 0.4 * framebuffer.cosineInterpolate(300, 400, smashTime)
        )
            * 12;
        modelViewMartrix = Matrix4f.constructTranslationMatrix(Math.sin(elapsedTime * 0.04) * 20,
            Math.sin(elapsedTime * 0.05) * 8 - smash, -28).multiplyMatrix(modelViewMartrix);

            framebuffer.flatShadingRenderingPipeline.drawObject2(this.torus.getMesh(),modelViewMartrix, 200,100,100);
    }

}
