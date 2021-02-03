import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';
import { Matrix4f } from '../../math/Matrix4f';
import { FlatShadingRenderingPipeline } from '../../rendering-pipelines/FlatShadingRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { BlenderLoader } from './../../model/blender/BlenderLoader';

/**
 * TODO: use cube mesh and draw using drawObject2
 */
export class AbstractCube extends AbstractScene {

    private blurred: Texture;
    private noise: Texture;

    private accumulationBuffer: Uint32Array;
    private renderingPipeline: FlatShadingRenderingPipeline;

    private scene: Array<FlatshadedMesh>;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.accumulationBuffer = new Uint32Array(framebuffer.width * framebuffer.height);
        this.renderingPipeline = new FlatShadingRenderingPipeline(framebuffer);
        this.renderingPipeline.setCullFace(CullFace.BACK);

        return Promise.all([
            BlenderLoader.load(require('../../assets/jsx/stravaganza.jsx')).then(
                (mesh: Array<FlatshadedMesh>) => this.scene = mesh
            ),
            TextureUtils.load(require('../../assets/blurredBackground.png'), false).then(
                (texture: Texture) => this.blurred = texture
            ),
            TextureUtils.generateProceduralNoise().then(
                (texture: Texture) => this.noise = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        // framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);
        framebuffer.drawScaledTextureClipBi(0,0,framebuffer.width, framebuffer.height, this.blurred, 1.0);

        this.drawBlenderScene2(framebuffer, time);

        const texture3: Texture = new Texture(this.accumulationBuffer, framebuffer.width, framebuffer.height);
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
        this.renderingPipeline.draw(framebuffer, model, mv);

        mv = camera.multiplyMatrix(Matrix4f.constructZRotationMatrix(
            Math.PI * 0.5 * framebuffer.cosineInterpolate(0, 600, Math.floor(elapsedTime * 0.7) % 4000))
            .multiplyMatrix(Matrix4f.constructXRotationMatrix(
                Math.PI * 0.5 * framebuffer.cosineInterpolate(2000, 2600, Math.floor(elapsedTime * 0.7) % 4000)))
        );
        model = this.scene[1];
        this.renderingPipeline.draw(framebuffer, model, mv);
    }

}
