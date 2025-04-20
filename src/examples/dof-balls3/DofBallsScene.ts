import { Framebuffer } from '../../Framebuffer';
import { Interpolator } from '../../math/Interpolator';
import { Matrix4f } from '../../math/Matrix4f';
import { Vector3f } from '../../math/Vector3f';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';

export class DofBallsScene extends AbstractScene {

    private blurred: Texture;
    private particleTexture2: Texture;
    private noise: Texture;
    private hoodlumLogo: Texture;
    private perlin: Texture;

    private accumulationBuffer: Uint32Array;
    private dist: Uint32Array;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.accumulationBuffer = new Uint32Array(framebuffer.width * framebuffer.height);
        this.dist = new Uint32Array(framebuffer.width * framebuffer.height);
        return Promise.all([
            TextureUtils.load(require('@assets/blurredBackground.png'), false).then(
                (texture: Texture) => this.blurred = texture
            ),
            TextureUtils.load(require('@assets/spriteBlur.png'), true).then(
                (texture: Texture) => this.particleTexture2 = texture
            ),
            TextureUtils.generateProceduralNoise().then(
                (texture: Texture) => this.noise = texture
            ),
            TextureUtils.load(require('@assets/hoodlumLogo.png'), true).then(
                (texture: Texture) => this.hoodlumLogo = texture
            ),
            TextureUtils.load(require('@assets/perlin.png'), true).then(
                (texture: Texture) => this.perlin = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        // framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);
        framebuffer.drawScaledTextureClipBi(0,0,framebuffer.width, framebuffer.height, this.blurred, 1.0);
        this.drawParticleTorus(framebuffer, time*0.7, this.particleTexture2, true);


        time = time *0.2;
        for (let i: number = 0; i < this.hoodlumLogo.width; i++) {
            let elapsedTime = time*0.001+Math.sin(time*0.002+i*0.002)*10;
            this.drawVerticalSpan(framebuffer, this.hoodlumLogo, i,
                Math.round(Math.sin(i * 0.009 + elapsedTime * 0.9 + Math.PI * 2 / 4) * 60 + 100),
                Math.round(Math.sin(i * 0.009 + elapsedTime * 0.9 + Math.PI * 2 / 4 * 2) * 60 + 100),
                Math.max(0, Math.sin(i * 0.009 + elapsedTime * 0.9 + Math.PI * 2 / 4 * 2.5)) * 0.85 + 0.15,
                Interpolator.cosineInterpolate(0.0, 1.0, time*0.003-2)
            );
        }

        this.perlin.setClamp(false);
        const distort: Texture = new Texture(this.dist, framebuffer.width, framebuffer.height);
        distort.setClamp(true)
        framebuffer.fastFramebufferCopy(distort.texture,framebuffer.framebuffer);
        let i = 0;
        let offset= time*0.1;
        const scale2 = (Math.sin(time*0.0008)*0.5+0.5)*20;
        for (let y = 0; y < framebuffer.height; y++) {
            for (let x = 0; x < framebuffer.width; x++) {


                // FIXME: scale by 256
                const disp = this.perlin.getBilinearFilteredPixel2(x+offset,y+offset);
                const disp2 = this.perlin.getBilinearFilteredPixel2(x+40+offset,y+30+offset);
                const color1 = distort.getBilinearFilteredPixel2(
                    x+((disp&  0xff)/255*scale2-scale2/2),
                    y+(((disp2>>8)&  0xff)/255*scale2-scale2/2));


                framebuffer.framebuffer[i++] = color1;
            }
        }



        const texture3: Texture = new Texture(this.accumulationBuffer, framebuffer.width, framebuffer.height);
        framebuffer.drawTexture(0, 0, texture3, 0.60);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);

        framebuffer.noise(time, this.noise);
    }


    public drawVerticalSpan(framebuffer: Framebuffer, texture: Texture, x: number, y1: number,
        y2: number, scale: number = 1.0, transparency: number): void {
        const delta: number = Math.abs(y2 - y1);
        const textureStep: number = texture.height / delta;
        let texpos: number = 0;
        const pixelStep: number = y2 > y1 ? framebuffer.width : -framebuffer.width;
        let index: number = x + y1 * framebuffer.width;
        const shiny: number = Math.pow(scale, 20);
        for (let i: number = 0; i < delta; i++) {
            const texel: number = texture.texture[x + Math.round(texpos) * texture.width];
            let alpha: number = ((texel >> 24) & 0xff) / 255 * transparency;
            const inverseAlpha: number = 1 - alpha;
            alpha *= scale;
            const fbColor: number = framebuffer.framebuffer[index];

            const r: number = (((fbColor >> 0) & 0xff) * (inverseAlpha) +
                ((Math.min(255, ((texel >> 0) & 0xff) + shiny * 180))) * (alpha)) | 0;
            const g: number = (((fbColor >> 8) & 0xff) * (inverseAlpha) +
                ((Math.min(255, ((texel >> 8) & 0xff) + shiny * 100))) * (alpha)) | 0;
            const b: number = (((fbColor >> 16) & 0xff) * (inverseAlpha) +
                ((Math.min(255, ((texel >> 16) & 0xff) + shiny * 100))) * (alpha)) | 0;

            framebuffer.framebuffer[index] = r | (g << 8) | (b << 16) | (255 << 24);

            texpos += textureStep;
            index += pixelStep;
        }
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
        const r = new RandomNumberGenerator();
        r.setSeed(115)

        for (let i = 0; i < num; i++) {
            let s = 6+(Math.sin(elapsedTime*0.004+i*0.1)*0.5+0.5)*6;
            const x = (r.getFloat()-0.5)  *s*3;
            const y = (r.getFloat()-0.5)  *s*3;
            const z = (r.getFloat()-0.5)  *s*3;

            points.push(new Vector3f(x, y, z));
        }

        const modelViewMartrix: Matrix4f = Matrix4f.constructTranslationMatrix(0, 0, -22)
            .multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.003)
                .multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.0024)));

        const points2: Array<Vector3f> = new Array<Vector3f>(points.length);

        points.forEach((element: Vector3f) => {
            points2.push(framebuffer.project(modelViewMartrix.multiply(element)));
        });

        points2.sort((a: Vector3f, b: Vector3f) => a.z - b.z);

        points2.forEach((element: Vector3f) => {
            const size: number = -(2.9 * 202 / (element.z));
            const spriteNum: number = Math.round(this.computeDepthBlur(0, -15, -70, element.z) * 13);

            framebuffer.drawParticle2Sub(
                element.x - size / 2,
                element.y - size / 2,
                size, size, texture, 1 / element.z, 1.0, spriteNum, 128
            );
        });
    }

}
