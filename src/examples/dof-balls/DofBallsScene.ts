import { LineRenderingPipeline } from '@engine/rendering/pipelines';
import { Noise } from '@effects/noise/Noise';
import { ParticleSpriteSubpixel } from '@effects/particle-sprite-subpixel/ParticleSpriteSubpixel';
import { Framebuffer } from '@engine/rendering/Framebuffer';
import { Matrix4f, Vector3f } from '@engine/math';
import { AbstractScene } from '@core';
import { Texture, TextureUtils } from '@engine/texture';

export class DofBallsScene extends AbstractScene {

    private blurred: Texture;
    private particleTexture2: Texture;
    private noise: Texture;

    private accumulationBuffer: Uint32Array;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.accumulationBuffer = new Uint32Array(framebuffer.width * framebuffer.height);
        return Promise.all([
            TextureUtils.load(require('@assets/blurredBackground.png'), false).then(
                (texture: Texture) => this.blurred = texture
            ),
            TextureUtils.load(require('@assets/spriteBlur.png'), true).then(
                (texture: Texture) => this.particleTexture2 = texture
            ),
            TextureUtils.generateProceduralNoise().then(
                (texture: Texture) => this.noise = texture
            )
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        // framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);
        framebuffer.scaleClipBlitter.drawScaledTextureClipBi(0,0,framebuffer.width, framebuffer.height, this.blurred, 1.0);
        this.drawParticleTorus(framebuffer, time, this.particleTexture2, true);

        const texture3: Texture = new Texture(this.accumulationBuffer, framebuffer.width, framebuffer.height);
        framebuffer.drawTexture(0, 0, texture3, 0.60);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);

        Noise.noise(framebuffer, time, this.noise);
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
        const num = 50;
        const radi = 5.2;

        for (let i = 0; i < num; i++) {
            const x = radi * Math.cos(((i) * Math.PI * 2 / (num)) * 3.7 + elapsedTime * 0.0016);
            const y = (i - num * 0.5) * 0.4;
            const z = radi * Math.sin(((i) * Math.PI * 2 / (num)) * 3.7 + elapsedTime * 0.0016);

            points.push(new Vector3f(x, y, z));
        }

        const modelViewMartrix: Matrix4f = Matrix4f.constructTranslationMatrix(0, 0, -12)
            .multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.0004)
                .multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.0004)));

        const points2: Array<Vector3f> = new Array<Vector3f>(points.length);

        points.forEach((element: Vector3f) => {
            points2.push(LineRenderingPipeline.project(framebuffer, modelViewMartrix.multiply(element)));
        });

        points2.sort((a: Vector3f, b: Vector3f) => a.z - b.z);

        points2.forEach((element: Vector3f) => {
            const size: number = -(2.9 * 292 / (element.z));
            const spriteNum: number = Math.round(this.computeDepthBlur(0, -15, -70, element.z) * 13);

            ParticleSpriteSubpixel.drawParticle2Sub(framebuffer,
                element.x - size / 2,
                element.y - size / 2,
                size, size, texture, 1 / element.z, 1.0, spriteNum, 128
            );
        });
    }

}
