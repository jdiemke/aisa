import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Vector3f, Matrix4f, Matrix3f } from '../../math';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture';

/**
 * TODO: extract lens into effect class
 */
export class ParticleStreamsScene extends AbstractScene {

    private blurred: Texture;
    private particleTexture2: Texture;
    private noise: Texture;

    private accumulationBuffer: Uint32Array;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.accumulationBuffer = new Uint32Array(framebuffer.width * framebuffer.height);
        return Promise.all([
            TextureUtils.load(require('../../assets/blurredBackground.png'), false).then(
                (texture: Texture) => this.blurred = texture
            ),
            TextureUtils.generateProceduralParticleTexture().then(
                (texture: Texture) => this.particleTexture2 = texture
            ),
            TextureUtils.generateProceduralNoise().then(
                (texture: Texture) => this.noise = texture
            )
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        // framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);
        framebuffer.drawScaledTextureClipBi(0,0,framebuffer.width, framebuffer.height, this.blurred, 1.0);
        this.drawParticleStreams(framebuffer, time, this.particleTexture2, true);
        const texture3: Texture = new Texture(this.accumulationBuffer, framebuffer.width, framebuffer.height);
        framebuffer.drawTexture(0, 0, texture3, 0.55);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);
        framebuffer.noise(time, this.noise);
    }

    public drawParticleStreams(framebuffer: Framebuffer, elapsedTime: number, texture: Texture, noClear: boolean = false) {

        const points: Array<Vector3f> = new Array<Vector3f>();
        const num = 50;
        const num2 = 10;
        const scale = 2.1;

        for (let i = 0; i < num; i++) {
            const radius = 2.8;
            const radius2 = 2.9 + 3 * Math.sin(Math.PI * 2 * i / num - elapsedTime * 0.002);

            for (let j = 0; j < num2; j++) {

                const x = ((i - num / 2) * scale - elapsedTime * 0.008) % (num * scale) + (num * scale * 0.5);
                const y = Math.cos(Math.PI * 2 / num2 * j + i * 0.02 + elapsedTime * 0.0005) * radius + 8 + radius2;
                const z = Math.sin(Math.PI * 2 / num2 * j + i * 0.02 + elapsedTime * 0.0005) * radius;

                points.push(Matrix3f.constructXRotationMatrix(Math.PI * 2 * i / num - Math.sin(elapsedTime * 0.0003 + Math.PI * 2 * i / num)).multiply(new Vector3f(x, y, z)));
            }
        }

        for (let i = 0; i < 3; i++) {
            const modelViewMartrix = Matrix4f.constructTranslationMatrix(0, -0.0, -49).multiplyMatrix(

                Matrix4f.constructZRotationMatrix(Math.PI * 0.17).multiplyMatrix(
                    Matrix4f.constructYRotationMatrix(elapsedTime * 0.00015).multiplyMatrix(
                        Matrix4f.constructXRotationMatrix(Math.PI * 2 / 3 * i + elapsedTime * 0.0006)))
            );

            const points2: Array<Vector3f> = new Array<Vector3f>(points.length);
            points.forEach(element => {


                const transformed = framebuffer.project(modelViewMartrix.multiply(element));

                points2.push(transformed);
            });

            points2.sort((a, b) => {
                return a.z - b.z;
            });

            points2.forEach(element => {
                // let size = -(2.0 * 192 / (element.z));
                const size = -(1.3 * 192 / (element.z));
                if (element.z < -4)
                    framebuffer.drawParticleNoDepth(
                        Math.round(element.x - size / 2),
                        Math.round(element.y - size / 2),
                        Math.round(size), Math.round(size), texture, framebuffer.interpolate(-90, -55, element.z));
            });
        }
    }




}
