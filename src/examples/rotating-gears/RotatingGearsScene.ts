import { BlenderJsonParser } from '../../blender/BlenderJsonParser';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';
import { Matrix4f } from '../../math';
import { FlatShadingRenderingPipeline } from '../../rendering-pipelines/FlatShadingRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';
import { SoundManager } from '../../sound/SoundManager';
import { Texture, TextureUtils } from '../../texture';

export class RotatingGearsScene extends AbstractScene {

    private blurred: Texture;
    private noise: Texture;
    private hoodlumLogo: Texture;

    private gearsMesh: FlatshadedMesh;

    private accumulationBuffer: Uint32Array = new Uint32Array(320 * 200);
    private renderingPipeline: FlatShadingRenderingPipeline;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.renderingPipeline = new FlatShadingRenderingPipeline(framebuffer);
        this.renderingPipeline.setCullFace(CullFace.FRONT);

        const sm: SoundManager = new SoundManager();
        sm.playExtendedModule(require('./starchip.xm'));

        this.gearsMesh = BlenderJsonParser.parse(require('../../assets/gear.json'), true)[0];

        return Promise.all([
            TextureUtils.load(require('../../assets/blurredBackground.png'), false).then(
                (texture: Texture) => this.blurred = texture
            ),
            TextureUtils.generateProceduralNoise().then(
                (texture: Texture) => this.noise = texture
            ),
            TextureUtils.load(require('../../assets/hoodlumLogo.png'), true).then(
                (texture: Texture) => this.hoodlumLogo = texture
            )
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();

        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);
        this.drawBlenderScene3(framebuffer, time);
        /*
            [
                { tex: this.texture10, scale: 0.0, alpha: 1.0 },
                { tex: this.texture11, scale: 2.3, alpha: 0.5 },
                { tex: this.texture13, scale: 1.6, alpha: 0.25 },
                { tex: this.texture13, scale: 0.7, alpha: 0.22 },
                { tex: this.texture13, scale: -0.4, alpha: 0.22 },
            ], this.dirt);
            */
        framebuffer.drawTexture(0, 75, this.hoodlumLogo, 0.6);

        const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
        framebuffer.drawTexture(0, 0, texture3, 0.75);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);

        framebuffer.noise(time, this.noise);
    }

    public drawBlenderScene3(framebuffer: Framebuffer, elapsedTime: number): void {

        framebuffer.clearDepthBuffer();

        let camera: Matrix4f = Matrix4f.constructTranslationMatrix(0, 0, -5).multiplyMatrix(
            Matrix4f.constructYRotationMatrix(elapsedTime * 0.0002)
                .multiplyMatrix(
                    Matrix4f.constructXRotationMatrix(elapsedTime * 0.0002)
                )
        );

        for (let i: number = 0; i < 10; i++) {
            const scale = Math.sin(Math.PI * 2 / 10 * i + elapsedTime * 0.002) * 0.2 + 0.2 + 0.3;
            let mv: Matrix4f = camera.multiplyMatrix(
                Matrix4f.constructTranslationMatrix(0, ((i + elapsedTime * 0.0008) % 10) - 5, 0).multiplyMatrix(
                    Matrix4f.constructYRotationMatrix((i * 0.36 + elapsedTime * 0.0016)).multiplyMatrix(
                        Matrix4f.constructScaleMatrix(scale, 1, scale)
                    )
                )
            );
            this.renderingPipeline.draw(this.gearsMesh, mv, 246, 165, 177);
        }
        // let lensflareScreenSpace = framebuffer.project(camera.multiply(new Vector3f(16.0 * 20, 16.0 * 20, 0)));
        // framebuffer.drawLensFlare(lensflareScreenSpace, elapsedTime * 0.3, texture, dirt);
    }

}
