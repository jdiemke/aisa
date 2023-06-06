import { Framebuffer } from '../../Framebuffer';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { Matrix4f } from '../../math/Matrix4f';
import { Vector3f } from '../../math/Vector3f';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { FontRenderer } from '../sine-scroller/FontRenderer';

export class DofBallsScene extends AbstractScene {

    private blurred: Texture;
    private particleTexture2: Texture;
    private noise: Texture; private cocoon: Texture;

    private accumulationBuffer: Uint32Array;
    fontRenderer: FontRenderer;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.accumulationBuffer = new Uint32Array(framebuffer.width * framebuffer.height);
        const fonts: string =
        ' !\'><C+\'()@+,-./0123456789:; = ? ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.fontRenderer = new FontRenderer(
        framebuffer,
        8, 8, fonts,
        require('../../assets/font.png')
    );
        return Promise.all([
            this.fontRenderer.init(),
            TextureUtils.load(require('../../assets/blurredBackground.png'), false).then(
                (texture: Texture) => this.blurred = texture
            ),
            TextureUtils.load(require('../../assets/spriteBlur.png'), true).then(
                (texture: Texture) => this.particleTexture2 = texture
            ),
            TextureUtils.generateProceduralNoise().then(
                (texture: Texture) => this.noise = texture
            ),
            TextureUtils.load(require('../../assets/cocoon.png'), false).then(
                (texture: Texture) => this.cocoon = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        // framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);
        framebuffer.drawScaledTextureClipBi(0,0,framebuffer.width, framebuffer.height, this.blurred, 1.0);
        this.drawParticleTorus(framebuffer, time, this.particleTexture2, true);

        const texture3: Texture = new Texture(this.accumulationBuffer, framebuffer.width, framebuffer.height);
        framebuffer.drawTexture(0, 0, texture3, 0.50);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);

        framebuffer.noise(time, this.noise);
    }

    public computeDepthBlur(
        nearPlane: number,
        focalPlane: number,
        farPlane: number, depth: number): number {

        let f: number;

        if (depth > focalPlane) {
            f = (depth - focalPlane) / (nearPlane - focalPlane);
        } else {
            f = (depth - focalPlane) / (farPlane - focalPlane);
        }
        return Math.min(f, 1.0);
    }

    public drawParticleTorus(framebuffer: Framebuffer, elapsedTime: number, texture: Texture, noClear: boolean = false) {
        if (!noClear) { framebuffer.clearColorBuffer(72 | 56 << 8 | 48 << 16 | 255 << 24); }
        framebuffer.clearDepthBuffer();

        const points: Array<Vector3f> = new Array<Vector3f>();



        this.fontRenderer.drawText3(framebuffer,0,200-16-4,"                  OH MY GOSH!!! HOODLUM IS BACK TO ROCK THE SCENE!!! WTF...", elapsedTime*0.23, false,points);


        const modelViewMartrix: Matrix4f = Matrix4f.constructTranslationMatrix(0, 0, -18)
            .multiplyMatrix(Matrix4f.constructYRotationMatrix(Math.sin(elapsedTime * 0.0006)*0.7)
            .multiplyMatrix(Matrix4f.constructZRotationMatrix(Math.sin(elapsedTime * 0.001)*0.2)
                .multiplyMatrix(Matrix4f.constructXRotationMatrix(-1.3+elapsedTime * 0.000))));

        const points2: Array<Vector3f> = new Array<Vector3f>(points.length);

        points.forEach((element: Vector3f) => {
            points2.push(framebuffer.project(modelViewMartrix.multiply(element)));
        });

        points2.sort((a: Vector3f, b: Vector3f) => a.z - b.z);

        points2.forEach((element: Vector3f) => {
            const size: number = -(1.5 * 292 / (element.z));
            const spriteNum: number = Math.round(this.computeDepthBlur(-15, -22, -29, element.z) * 13);

            framebuffer.drawParticle2Sub(
                element.x - size / 2,
                element.y - size / 2,
                size, size, texture, 1 / element.z, 1.0, spriteNum, 128,1,1,1
            );
        });
    }

}
