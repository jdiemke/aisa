import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Cube } from '../../geometrical-objects/Cube';
import { Matrix4f } from '../../math';
import { FlatShadingRenderingPipeline } from '../../rendering-pipelines/FlatShadingRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';
import { TextureUtils, Texture } from '../../texture/index';
import RandomNumberGenerator from '../../RandomNumberGenerator';

/**
 * TODO: use cube mesh and draw using drawObject2
 */
export class CubeScene extends AbstractScene {

    private static BACKGROUND_COLOR: number = Color.DARK_GRAY.toPackedFormat();
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
        //   framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);
        const elapsedTime: number = Date.now() * 0.02;

        framebuffer.clearColorBuffer(CubeScene.BACKGROUND_COLOR);
        framebuffer.clearDepthBuffer();

        let xSteps = 40;
        let xsteps = 5;
        let rot = 25;
        let rand = new RandomNumberGenerator();
        rand.setSeed(22);

        for (let x = 0; x < xSteps; x++) {
            let rotSpeed = rand.getFloat() * 0.3 + 0.2;
            for (let z = 0; z < rot; z++) {

                let scale = rand.getFloat() * 2.3 + 0.7 + 0.2*(Math.sin(Date.now() * 0.0044 + rand.getFloat() * 3));
                let size = (xSteps - 1) * 0.7;
                const mat =
                    Matrix4f.constructXRotationMatrix(0.2 * Math.sin(Date.now() * 0.00044)).multiplyMatrix(
                        Matrix4f.constructYRotationMatrix(0.2 * Math.sin(Date.now() * 0.0004)).multiplyMatrix(
                            Matrix4f.constructTranslationMatrix(0, 0,
                                -20 - ((x * 0.7 + Date.now() * 0.002) % size) + size
                            ).multiplyMatrix(

                                Matrix4f.constructZRotationMatrix(Math.PI * 2 / rot * z + Date.now() * rotSpeed * 0.002 + x * 0.2).multiplyMatrix(
                                    Matrix4f.constructTranslationMatrix(+ 3, 0, 0)
                                        .multiplyMatrix(
                                            Matrix4f.constructScaleMatrix(scale, 0.5, 0.5)))))); //.multiplyMatrix(
                //       Matrix4f.constructYRotationMatrix(elapsedTime * 0.05)).multiplyMatrix(
                //           Matrix4f.constructXRotationMatrix(elapsedTime * 0.08)));

                this.renderingPipeline.draw(this.cubeMesh.getMesh(), mat, 190, 190, 200);
            }

        }


        const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
        framebuffer.drawTextureFullscreen(texture3, 0.75);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);

    }



}
