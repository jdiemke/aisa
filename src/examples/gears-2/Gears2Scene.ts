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
    private gearsMesh: FlatshadedMesh;
    private accumulationBuffer: Uint32Array = new Uint32Array(320 * 200);
    private renderingPipeline: FlatShadingRenderingPipeline;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.renderingPipeline = new FlatShadingRenderingPipeline(framebuffer);
        this.renderingPipeline.setCullFace(CullFace.FRONT);

        this.gearsMesh = BlenderJsonParser.parse(require('../../assets/gear.json'), false)[0];

        return Promise.all([
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

        this.drawBlenderScene4(framebuffer);
        /*  [
              { tex: this.texture10, scale: 0.0, alpha: 1.0 },
              { tex: this.texture11, scale: 2.3, alpha: 0.5 },
              { tex: this.texture13, scale: 1.6, alpha: 0.25 },
              { tex: this.texture13, scale: 0.7, alpha: 0.22 },
              { tex: this.texture13, scale: -0.4, alpha: 0.22 },
          ], this.dirt);*/

        const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
        framebuffer.drawTexture(0, 0, texture3, 0.75);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);
        framebuffer.noise(time, this.noise);
    }

    public drawBlenderScene4(framebuffer: Framebuffer): void {
        framebuffer.clearDepthBuffer();
        const mat =
            Matrix4f.constructTranslationMatrix(0, 0, -14)
                .multiplyMatrix(Matrix4f.constructXRotationMatrix(Date.now() * 0.0007)

                    .multiplyMatrix(Matrix4f.constructZRotationMatrix(-Date.now() * 0.0007 + Math.PI * 2 / 360 * 13).
                        multiplyMatrix(Matrix4f.constructXRotationMatrix(Math.PI * 2 / 360 * 90))));
        const mat2 = Matrix4f.constructTranslationMatrix(0 - 4.8, 0, -14)
            .multiplyMatrix(Matrix4f.constructXRotationMatrix(Date.now() * 0.0007)

                .multiplyMatrix(Matrix4f.constructZRotationMatrix(Date.now() * 0.0007).
                    multiplyMatrix(Matrix4f.constructXRotationMatrix(Math.PI * 2 / 360 * 90))));

        this.renderingPipeline.draw(this.gearsMesh, mat);
        this.renderingPipeline.draw(this.gearsMesh, mat2);
    }


}
