import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Cube } from '../../geometrical-objects/Cube';
import { Matrix4f } from '../../math';
import { GouraudShadingRenderingPipeline } from '../../rendering-pipelines/GouraudShadingRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';
import { TextureUtils, Texture } from '../../texture/index';

/**
 * TODO: use cube mesh and draw using drawObject2
 */
export class VoxelBallsScene extends AbstractScene {

    private static BACKGROUND_COLOR: number = Color.YELLOW.toPackedFormat();
    private renderingPipeline: GouraudShadingRenderingPipeline;
    private cubeMesh: Cube = new Cube();
    private blurred: Texture;
    private accumulationBuffer: Uint32Array;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.accumulationBuffer = new Uint32Array(framebuffer.width * framebuffer.height);
        framebuffer.setCullFace(CullFace.BACK);
        this.renderingPipeline = new GouraudShadingRenderingPipeline(framebuffer);
        return Promise.all([
            TextureUtils.load(require('../../assets/blurredBackground.png'), false).then(
                (texture: Texture) => this.blurred = texture
            )
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);
        this.renderTransparent(framebuffer, time);
        const texture3: Texture = new Texture(this.accumulationBuffer, framebuffer.width, framebuffer.height);
        framebuffer.drawTextureFullscreen(texture3, 0.75);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);
    }

    public renderTransparent(framebuffer: Framebuffer, time: number): void {

        framebuffer.clearDepthBuffer();

        const xSteps = 5;
        const xsteps = 5;
        const zsteps = 5;
        for (let x = 0; x < xSteps; x++) {
            for (let y = 0; y < xsteps; y++) {
                for (let z = 0; z < zsteps; z++) {
                    let scale = (Math.sin(x * 0.3 + time * 0.0009) + 1.0) * 0.5 *
                        (Math.sin(y * 0.4 + time * 0.002) + 1.0) * 0.5 *
                        (Math.sin(z * 0.3 + time * 0.001) + 1.0) * 0.5;
                    if (scale < 0.3) {
                        // continue;
                    }
                    scale = 0.8;
                    const mat =
                        Matrix4f.constructTranslationMatrix(0, 0, -11).multiplyMatrix(
                            Matrix4f.constructYRotationMatrix(time * 0.0003).multiplyMatrix(
                                Matrix4f.constructXRotationMatrix(time * 0.0005).multiplyMatrix(
                                    Matrix4f.constructZRotationMatrix(time * 0.0004).multiplyMatrix(
                                        Matrix4f.constructTranslationMatrix(x - xSteps / 2 + 0.5, y - xsteps / 2 + 0.5, z - zsteps / 2 + 0.5)
                                            .multiplyMatrix(
                                                Matrix4f.constructScaleMatrix(scale, scale, scale)))))); // .multiplyMatrix(
                    //       Matrix4f.constructYRotationMatrix(elapsedTime * 0.05)).multiplyMatrix(
                    //           Matrix4f.constructXRotationMatrix(elapsedTime * 0.08)));

                    this.renderingPipeline.draw(framebuffer, this.cubeMesh.getMesh(), mat);
                }
            }
        }
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);
    }



}
