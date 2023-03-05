import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';
import { Matrix4f } from '../../math';
import { GouraudShadingRenderingPipeline } from '../../rendering-pipelines/GouraudShadingRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { BlenderLoader } from '../../model/blender/BlenderLoader';
import { FontRenderer } from '../sine-scroller/FontRenderer';

export class RotatingGearsScene extends AbstractScene {

    private blurred: Texture;
    private noise: Texture;
    private hoodlumLogo: Texture;
    private robot: Texture;

    private gearsMesh: Array<FlatshadedMesh>;

    private accumulationBuffer: Uint32Array;
    private renderingPipeline: GouraudShadingRenderingPipeline;
    fontRenderer: FontRenderer;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.accumulationBuffer = new Uint32Array(framebuffer.width * framebuffer.height);
        this.renderingPipeline = new GouraudShadingRenderingPipeline(framebuffer);
        this.renderingPipeline.setCullFace(CullFace.FRONT);

        const fonts: string =
        ' !\'><C+\'()@+,-./0123456789:; = ? ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.fontRenderer = new FontRenderer(
        framebuffer,
        8, 8, fonts,
        require('../../assets/font.png')
    );
        return Promise.all([
            this.fontRenderer.init(),
            BlenderLoader.load(require('../../assets/jsx/gear.jsx')).then(
                (mesh: Array<FlatshadedMesh>) => this.gearsMesh = mesh
            ),
            TextureUtils.load(require('../../assets/blurredBackground.png'), false).then(
                (texture: Texture) => this.blurred = texture
            ),
            TextureUtils.generateProceduralNoise().then(
                (texture: Texture) => this.noise = texture
            ),
            TextureUtils.load(require('../../assets/hoodlumLogo.png'), true).then(
                (texture: Texture) => this.hoodlumLogo = texture
            ),
            TextureUtils.load(require('../../assets/robot.png'), true).then(
                (texture: Texture) => this.robot = texture
            )
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();

        framebuffer.drawScaledTextureClipBi(0,0,framebuffer.width, framebuffer.height, this.blurred, 1.0);
        this.drawBlenderScene3(framebuffer, time);

        framebuffer.noise(time, this.noise);
        framebuffer.drawTexture(320 - this.robot.width +30, -8, this.robot, 1);
        this.fontRenderer.drawText(framebuffer,0,200-16-4,"YOUR ADVERTISEMENT COULD BE HERE +++ ", time, false);
    }

    public drawBlenderScene3(framebuffer: Framebuffer, elapsedTime: number): void {

        framebuffer.clearDepthBuffer();

        const camera: Matrix4f = Matrix4f.constructTranslationMatrix(0, 0, -5).multiplyMatrix(
            Matrix4f.constructYRotationMatrix(elapsedTime * 0.0002)
                .multiplyMatrix(
                    Matrix4f.constructXRotationMatrix(elapsedTime * 0.0002)
                )
        );

        for (let i: number = 0; i < 10; i++) {
            const scale = (Math.sin(Math.PI * 2 / 10 * i + elapsedTime * 0.002) * 0.2 + 0.2 + 0.3) *2;
            const mv: Matrix4f = camera.multiplyMatrix(
                Matrix4f.constructTranslationMatrix(0, ((i + elapsedTime * 0.0008) % 10) - 5, 0).multiplyMatrix(
                    Matrix4f.constructYRotationMatrix((i * 0.36 + elapsedTime * 0.0016)).multiplyMatrix(
                        Matrix4f.constructScaleMatrix(scale, 2, scale)
                    )
                )
            );
            this.renderingPipeline.draw(framebuffer, this.gearsMesh[0], mv);
        }
        // let lensflareScreenSpace = framebuffer.project(camera.multiply(new Vector3f(16.0 * 20, 16.0 * 20, 0)));
        // framebuffer.drawLensFlare(lensflareScreenSpace, elapsedTime * 0.3, texture, dirt);
    }

}
