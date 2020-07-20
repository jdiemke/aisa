import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Cube } from '../../geometrical-objects/Cube';
import { Matrix4f } from '../../math';
import { FlatShadingRenderingPipeline } from '../../rendering-pipelines/FlatShadingRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';
import { TextureUtils, Texture } from '../../texture/index';

/**
 * TODO: use cube mesh and draw using drawObject2
 */
export class CubeScene extends AbstractScene {

    private static BACKGROUND_COLOR: number = Color.YELLOW.toPackedFormat();
    private renderingPipeline: FlatShadingRenderingPipeline;
    private cubeMesh: Cube = new Cube();
    private blurred: Texture;
    private accumulationBuffer: Uint32Array = new Uint32Array(320 * 200);

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.setCullFace(CullFace.BACK);
        this.renderingPipeline = new FlatShadingRenderingPipeline(framebuffer);
        return Promise.all([
            TextureUtils.load(require('../../assets/blurredBackground.png'), false).then(
                (texture: Texture) => this.blurred = texture
            )
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);
        const elapsedTime: number = Date.now() * 0.02;

        //  framebuffer.clearColorBuffer(CubeScene.BACKGROUND_COLOR);
        framebuffer.clearDepthBuffer();

        const xSteps = 5;
        const xsteps = 5;
        const zsteps = 5;
        for (let x = 0; x < xSteps; x++) {
            for (let y = 0; y < xsteps; y++) {
                for (let z = 0; z < zsteps; z++) {
                    let scale = (Math.sin(x * 0.3 + Date.now() * 0.0009) + 1.0) * 0.5 *
                        (Math.sin(y * 0.4 + Date.now() * 0.002) + 1.0) * 0.5 *
                        (Math.sin(z * 0.3 + Date.now() * 0.001) + 1.0) * 0.5;
                    if (scale < 0.3) {
                        // continue;
                    }
                    scale = 0.8;
                    const mat =
                        Matrix4f.constructTranslationMatrix(0, 0, -11).multiplyMatrix(
                            Matrix4f.constructYRotationMatrix(Date.now() * 0.0003).multiplyMatrix(
                                Matrix4f.constructXRotationMatrix(Date.now() * 0.0005).multiplyMatrix(
                                    Matrix4f.constructZRotationMatrix(Date.now() * 0.0004).multiplyMatrix(
                                        Matrix4f.constructTranslationMatrix(x - xSteps / 2 + 0.5, y - xsteps / 2 + 0.5, z - zsteps / 2 + 0.5)
                                            .multiplyMatrix(
                                                Matrix4f.constructScaleMatrix(scale, scale, scale)))))); // .multiplyMatrix(
                    //       Matrix4f.constructYRotationMatrix(elapsedTime * 0.05)).multiplyMatrix(
                    //           Matrix4f.constructXRotationMatrix(elapsedTime * 0.08)));

                    this.renderingPipeline.draw(this.cubeMesh.getMesh(), mat);
                }
            }
        }

        const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
        framebuffer.drawTextureFullscreen(texture3, 0.75);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);

    }



}
