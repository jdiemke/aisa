import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { TorusKnot } from '../../geometrical-objects/TorusKnot';
import { Matrix4f } from '../../math/Matrix4f';
import { Vector3f, } from '../../math/Vector3f';
import { Vector4f } from '../../math/Vector4f';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Fog } from '../../shading/fog/Fog';
import { LinearFog } from '../../shading/fog/LinearFog';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import RandomNumberGenerator from '../../RandomNumberGenerator';

export class TorusKnotTunnelScene extends AbstractScene {

    private noise: Texture;
    private particleTexture: Texture;
    private cocoon: Texture;
    private torusKnot: TorusKnot = new TorusKnot(true);
    private fog: Fog = new LinearFog(-50, -240, new Vector4f(0.67, 0.4, 0.5, 1.0));

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.renderingPipeline.setCullFace(CullFace.FRONT);
        framebuffer.renderingPipeline.setFog(this.fog);

        return Promise.all([
            TextureUtils.generateProceduralNoise().then((texture: Texture) => this.noise = texture),
            TextureUtils.load(require('../../assets/cocoon.png'), false).then(
                (texture: Texture) => this.cocoon = texture
            ),
            TextureUtils.generateProceduralParticleTexture2().then(
                (texture: Texture) => this.particleTexture = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();
        this.torusTunnel(framebuffer, time * 0.019, this.particleTexture);
        framebuffer.drawScaledTextureClipAdd(
            320 / 2 - this.cocoon.width / 2,
            200 / 2 - this.cocoon.height / 2,
            this.cocoon.width, this.cocoon.height, this.cocoon, 0.67);

        // framebuffer.noise(time, this.noise);
        this.glitchScreen(framebuffer, time * 5, this.noise);
    }

    public glitchScreen(framebuffer: Framebuffer, elapsedTime: number, texture: Texture, noise: boolean = true): void {

        const glitchFactor = (Math.sin(elapsedTime * 0.00002) * 0.9 + 0.1);
        const rng = new RandomNumberGenerator();
        rng.setSeed((elapsedTime / 250) | 0);
        const texture2 = new Texture();
        texture2.height = 200;
        texture2.width = 320;
        texture2.texture = framebuffer.framebuffer;
        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 10; y++) {
                if (rng.getFloat() > 0.25) {
                    continue;
                }

                framebuffer.drawTextureRect(20 * (16 - x), 20 * ((16 * rng.getFloat()) | 0), 20 * x, 20 * y, 20, 20, texture2, 0.03 + 0.35 * glitchFactor);
            }
        }

        if (noise) {
            for (let x = 0; x < 16; x++) {
                for (let y = 0; y < 10; y++) {
                    framebuffer.drawTextureRect(x * 20, y * 20, 20 * (Math.round(elapsedTime / 100 + x + y) % 12), 0, 20, 20, texture, 0.1 + 0.3 * glitchFactor);
                }
            }
        }

        framebuffer.fastFramebufferCopy(framebuffer.tmpGlitch, framebuffer.framebuffer);

        // now distort the tmpGlitch buffer and render to framebuffer again

        const rng2 = new RandomNumberGenerator();

        for (let k = 0; k < 8; k++) {
            let yStart = Math.round(rng.getFloat() * 180);
            const size = 3 + Math.round(rng.getFloat() * 20);
            rng2.setSeed((elapsedTime / 250) | 0);
            const scale = rng2.getFloat() * glitchFactor;
            const off = rng.getFloat() * glitchFactor;
            for (let y = 0; y < size; y++) {
                const offset = Math.abs(Math.round(off * 25) + Math.round(rng2.getFloat() * 3)
                    + Math.round(Math.cos(y * 0.01 + elapsedTime * 0.002 + off) * scale * 5));

                let index = yStart * 320;
                let glIndex = yStart * 320 + 320 - offset;

                for (let i = 0; i < Math.max(0, offset); i++) {
                    framebuffer.framebuffer[index++] = framebuffer.tmpGlitch[glIndex++];
                }

                glIndex = yStart * 320;
                const count = 320 - offset;

                for (let i = 0; i < count; i++) {
                    framebuffer.framebuffer[index++] = framebuffer.tmpGlitch[glIndex++];
                }
                yStart++;
            }
        }
    }

    public torusTunnel(framebuffer: Framebuffer, elapsedTime: number, texture: Texture): void {
        framebuffer.clearDepthBuffer();

        const scale = 1.0;
        const lookAhead: number = 0.4;

        const frame = this.torusFunction3(elapsedTime * 0.02);
        const frame2 = this.torusFunction3(elapsedTime * 0.02 + lookAhead);

        const tangent = frame2.sub(frame).normalize();
        let up = frame.add(frame2).normalize();
        const right = tangent.cross(up).normalize();
        up = right.cross(tangent).normalize();

        const translation = Matrix4f.constructIdentityMatrix();
        // translation vector
        translation.m14 = -frame.x;
        translation.m24 = -frame.y;
        translation.m34 = -frame.z;

        const rotation = Matrix4f.constructIdentityMatrix();
        // x vector
        rotation.m11 = right.x;
        rotation.m21 = right.y;
        rotation.m31 = right.z;

        // y vector
        rotation.m12 = up.x;
        rotation.m22 = up.y;
        rotation.m32 = up.z;

        // z vector
        rotation.m13 = -tangent.x;
        rotation.m23 = -tangent.y;
        rotation.m33 = -tangent.z;

        const finalMatrix = rotation.transpose().multiplyMatrix(translation);

        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.035));
        modelViewMartrix = Matrix4f.constructTranslationMatrix(0, 0, -10).multiplyMatrix(modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.04)));
        modelViewMartrix = Matrix4f.constructZRotationMatrix(elapsedTime * 0.01).multiplyMatrix(finalMatrix);

        framebuffer.renderingPipeline.draw(this.torusKnot.getMesh(), modelViewMartrix);
    }

    private torusFunction3(alpha: number): Vector4f {
        const p = 2;
        const q = 3;
        const r = 0.5 * (2 + Math.sin(q * alpha));
        return new Vector4f(r * Math.cos(p * alpha),
            r * Math.cos(q * alpha),
            r * Math.sin(p * alpha)).mul(70);
    }

}
