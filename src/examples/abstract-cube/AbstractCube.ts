import { BlenderJsonParser } from '../../blender/BlenderJsonParser';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';
import { Matrix4f } from '../../math/Matrix4f';
import { FlatShadingRenderingPipeline } from '../../rendering-pipelines/FlatShadingRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';

/**
 * TODO: use cube mesh and draw using drawObject2
 */
export class AbstractCube extends AbstractScene {

    private blurred: Texture;
    private noise: Texture;

    private accumulationBuffer: Uint32Array = new Uint32Array(320 * 200);
    private renderingPipeline: FlatShadingRenderingPipeline;

    private scene: Array<FlatshadedMesh>;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.renderingPipeline = new FlatShadingRenderingPipeline(framebuffer);
        this.renderingPipeline.setCullFace(CullFace.BACK);

        this.scene = BlenderJsonParser.parse(require('../../assets/stravaganza.json'), false);

        return Promise.all([
            TextureUtils.load(require('../../assets/blurredBackground.png'), false).then(
                (texture: Texture) => this.blurred = texture
            ),
            TextureUtils.generateProceduralNoise().then(
                (texture: Texture) => this.noise = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {

        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);
        this.drawBlenderScene2(framebuffer, time);
        /*
            [
                { tex: this.texture10, scale: 0.0, alpha: 1.0 },
                { tex: this.texture11, scale: 2.3, alpha: 0.5 },
                { tex: this.texture13, scale: 1.6, alpha: 0.25 },
                { tex: this.texture13, scale: 0.7, alpha: 0.22 },
                { tex: this.texture13, scale: -0.4, alpha: 0.22 },
            ], this.dirt);
            */
        const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
        framebuffer.drawTexture(0, 0, texture3, 0.75);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);

        framebuffer.noise(time, this.noise);
    }

    public drawBlenderScene2(framebuffer: Framebuffer, elapsedTime: number): void {
        framebuffer.clearDepthBuffer();

        const camera: Matrix4f = Matrix4f.constructTranslationMatrix(0, 0, -12).multiplyMatrix(
            Matrix4f.constructYRotationMatrix(elapsedTime * 0.0002)
                .multiplyMatrix(
                    Matrix4f.constructXRotationMatrix(elapsedTime * 0.0002)
                )
        );

        let mv: Matrix4f = camera.multiplyMatrix(Matrix4f.constructScaleMatrix(5, 16, 5));
        let model: FlatshadedMesh = this.scene[0];
        this.renderingPipeline.draw(model, mv);

        mv = camera.multiplyMatrix(Matrix4f.constructZRotationMatrix(
            Math.PI * 0.5 * framebuffer.cosineInterpolate(0, 600, Math.floor(elapsedTime * 0.7) % 4000))
            .multiplyMatrix(Matrix4f.constructXRotationMatrix(
                Math.PI * 0.5 * framebuffer.cosineInterpolate(2000, 2600, Math.floor(elapsedTime * 0.7) % 4000)))
        );
        model = this.scene[1];
        this.renderingPipeline.draw(model, mv);

        // let lensflareScreenSpace = framebuffer.project(camera.multiply(new Vector3f(16.0 * 20, 16.0 * 20, 0)));
        // framebuffer.drawLensFlare(lensflareScreenSpace, elapsedTime * 0.3, texture, dirt);
    }

}
