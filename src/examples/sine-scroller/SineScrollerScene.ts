import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Cube } from '../../geometrical-objects/Cube';
import { Vector3f, Matrix4f } from '../../math';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { FlatShadingRenderingPipeline } from '../../rendering-pipelines/FlatShadingRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { FontRenderer } from './FontRenderer';
import { CubeScene } from '../cube/CubeScene';

export class SineScrollerScene extends AbstractScene {
    private static BACKGROUND_COLOR: number = Color.BLACK.toPackedFormat();

    private atlantisBackground: Texture;
    private startTime: number;
    private fontRenderer: FontRenderer;
    private renderingPipeline: FlatShadingRenderingPipeline;
    private cubeMesh: Cube = new Cube();

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.setCullFace(CullFace.BACK);
        this.renderingPipeline = new FlatShadingRenderingPipeline(framebuffer);
        this.startTime = Date.now();
        this.fontRenderer = new FontRenderer(framebuffer, require('./assets/fraxionFont.png'));
        return Promise.all([
            TextureUtils.load(require('./assets/atlantis.png'), false).then(
                (texture: Texture) => this.atlantisBackground = texture
            ),
            this.fontRenderer.init()
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now() - this.startTime;
        const elapsedTime: number = time;

        //framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.atlantisBackground.texture);
        this.drawStarField(framebuffer, elapsedTime);

        framebuffer.clearDepthBuffer();

      //  this.renderingPipeline.draw(this.cubeMesh.getMesh(), this.getModelViewMatrix(elapsedTime * 0.007), 100, 200, 100);

        this.fontRenderer.drawText(0, 80, '   TEAM GENESIS IS BACK IN 2018 WITH A NEW PC FIRST! \'STAR WARS - EMPIRE AT WAR\' DO YOU LIKE THIS?    ', elapsedTime);
    }

    private getModelViewMatrix(elapsedTime: number): Matrix4f {
        const scale: number = 3.2;

        return Matrix4f.constructTranslationMatrix(0, 0, -9).multiplyMatrix(
            Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(
                Matrix4f.constructYRotationMatrix(elapsedTime * 0.05)).multiplyMatrix(
                    Matrix4f.constructXRotationMatrix(elapsedTime * 0.08)));
    }

    public drawStarField(frambuffer: Framebuffer, elapsedTime: number): void {
        let darkStarColor = 255 << 24 | 128 << 16 | 128 << 8 | 128;
        let lightStarColor = 255 << 24 | 255 << 16 | 255 << 8 | 255;
        let backgroundColor = 255 << 24 | 87 << 16 | 62 << 8 | 47;

        let rng = new RandomNumberGenerator();
        rng.setSeed(666);
        let stars = new Array<Vector3f>();
        let stars2 = new Array<Vector3f>();

        for (let i = 0; i < 100; i++) {
            stars.push(new Vector3f(rng.getFloat() * 320, Math.round(rng.getFloat() * 200), 0));
        }

        for (let i = 0; i < 60; i++) {
            stars2.push(new Vector3f(rng.getFloat() * 320, Math.round(rng.getFloat() * 200), 0));
        }

        frambuffer.clearColorBuffer(backgroundColor);

        for (let i = 0; i < 100; i++) {
            frambuffer.drawPixel(((stars[i].x + elapsedTime * 0.02) | 0) % 320, stars[i].y, darkStarColor);
        }

        for (let i = 0; i < 60; i++) {
            frambuffer.drawPixel(((stars2[i].x + elapsedTime * 0.04) | 0) % 320, stars2[i].y, lightStarColor);
        }
    }

}
