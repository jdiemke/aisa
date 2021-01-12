import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';
import { Matrix4f } from '../../math/Matrix4f';
import { FlatShadingRenderingPipeline } from '../../rendering-pipelines/FlatShadingRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { BlenderLoader } from '../../model/blender/BlenderLoader';

/**
 * wireframe font 3d logo.. multiple lines drawn with damping
 * sinus checker
 * checker floor
 * dot tunnel
 * 3d starfield
 * 3d bobs
 * http://sol.gfxile.net/gp/ch17.html
 */
export class Gears2Scene extends AbstractScene {

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

    public render(framebuffer: Framebuffer, time: number): void {
        // framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);
        framebuffer.drawScaledTextureClipBi(0,0,framebuffer.width, framebuffer.height, this.blurred, 1.0);

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

    public drawBlenderScene4(framebuffer: Framebuffer, time: number): void {
        framebuffer.clearDepthBuffer();
        const mat =
            Matrix4f.constructTranslationMatrix(0, 0, -14)
                .multiplyMatrix(Matrix4f.constructXRotationMatrix(time * 0.0007)

                    .multiplyMatrix(Matrix4f.constructZRotationMatrix(-time * 0.0007 + Math.PI * 2 / 360 * 13).
                        multiplyMatrix(Matrix4f.constructXRotationMatrix(Math.PI * 2 / 360 * 90))));
        const mat2 = Matrix4f.constructTranslationMatrix(0 - 4.8, 0, -14)
            .multiplyMatrix(Matrix4f.constructXRotationMatrix(time * 0.0007)

                .multiplyMatrix(Matrix4f.constructZRotationMatrix(time * 0.0007).
                    multiplyMatrix(Matrix4f.constructXRotationMatrix(Math.PI * 2 / 360 * 90))));

        this.renderingPipeline.draw(this.gearsMesh[0], mat);
        this.renderingPipeline.draw(this.gearsMesh[0], mat2);
    }


}
