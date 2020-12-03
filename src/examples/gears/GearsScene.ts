import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';
import { Matrix4f } from '../../math/Matrix4f';
import { FlatShadingRenderingPipeline } from '../../rendering-pipelines/FlatShadingRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { BlenderLoader } from '../../model/blender/BlenderLoader';

export class GearsScene extends AbstractScene {

    private blurred: Texture;
    private noise: Texture;
    private gearsMesh: Array<FlatshadedMesh>;

    private accumulationBuffer: Uint32Array;
    private renderingPipeline: FlatShadingRenderingPipeline;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.accumulationBuffer = new Uint32Array(framebuffer.width * framebuffer.height);
        this.renderingPipeline = new FlatShadingRenderingPipeline(framebuffer);
        this.renderingPipeline.setCullFace(CullFace.FRONT);

        return Promise.all([
            BlenderLoader.load(require('../../assets/jsx/gear.jsx')).then(
                (mesh: Array<FlatshadedMesh>) => this.gearsMesh = mesh
            ),
            TextureUtils.load(require('../../assets/blurredBackground.png'), false).then(
                (texture: Texture) => this.blurred = texture
            ),
            TextureUtils.generateProceduralNoise().then(
                (texture: Texture) => this.noise = texture
            )
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();
        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);

        this.drawBlenderScene4(framebuffer, time);
        /*  [
              { tex: this.texture10, scale: 0.0, alpha: 1.0 },
              { tex: this.texture11, scale: 2.3, alpha: 0.5 },
              { tex: this.texture13, scale: 1.6, alpha: 0.25 },
              { tex: this.texture13, scale: 0.7, alpha: 0.22 },
              { tex: this.texture13, scale: -0.4, alpha: 0.22 },
          ], this.dirt);*/

        const texture3: Texture = new Texture(this.accumulationBuffer, framebuffer.width, framebuffer.height);
        framebuffer.drawTexture(0, 0, texture3, 0.75);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);
        framebuffer.noise(time, this.noise);
    }

    public drawBlenderScene4(framebuffer: Framebuffer, elapsedTime: number): void {
        framebuffer.clearDepthBuffer();

        const camera: Matrix4f = Matrix4f.constructTranslationMatrix(0, 0, -21).multiplyMatrix(
            Matrix4f.constructYRotationMatrix(elapsedTime * 0.0002)
                .multiplyMatrix(
                    Matrix4f.constructXRotationMatrix(elapsedTime * 0.0002)
                )
        );

        let scale: number = 0.1 * 2.1 * 2.1;
        let factor: number = 2.1 - 0.09 - 0.09;
        const fade: number = 0.09;
        const dampFactor: number = Math.sin(elapsedTime * 0.00001) * 0.5 + 0.5;
        for (let i: number = 1; i < 6; i++) {
            scale *= factor;
            factor -= fade;

            const mv: Matrix4f = this.getModelViewMatrix(camera, dampFactor, scale, i, elapsedTime);

            this.renderingPipeline.draw(this.gearsMesh[0], mv);
        }
        // let lensflareScreenSpace = framebuffer.project(camera.multiply(new Vector3f(16.0 * 20, 16.0 * 20, 0)));
        // framebuffer.drawLensFlare(lensflareScreenSpace, elapsedTime * 0.3, texture, dirt);
    }

    private getModelViewMatrix(camera: Matrix4f, dampFactor: number, scale: number, i: number,
        elapsedTime: number): Matrix4f {
        const modelViewMartrix: Matrix4f =
            Matrix4f.constructXRotationMatrix(elapsedTime * 0.0006 + dampFactor * 0.7 * (4 - i)).multiplyMatrix(
                Matrix4f.constructYRotationMatrix(elapsedTime * 0.0005 + dampFactor * 0.7 * (4 - i)).multiplyMatrix(
                    Matrix4f.constructScaleMatrix(scale, scale, scale)));

        return camera.multiplyMatrix(modelViewMartrix);
    }

}
