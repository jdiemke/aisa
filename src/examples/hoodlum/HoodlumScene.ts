import { Canvas } from '../../Canvas';
import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Matrix4f, Vector3f } from '../../math';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';

export class HoodlumScene extends AbstractScene {

    private blurred: Texture;
    private lab2: Texture;
    private noise: Texture;
    private particleTexture2: Texture;

    private spaceLabMesh: any; // Create Type for Modells!
    private hoodlumLogoMesh: any;

    private accumulationBuffer: Uint32Array = new Uint32Array(320 * 200);

    public init(framebuffer: Framebuffer): Promise<any> {
        this.spaceLabMesh = framebuffer.getBlenderScene(require('../../assets/lab2.json'), false);
        this.hoodlumLogoMesh = framebuffer.getBlenderScene2(require('../../assets/hoodlum2018.json'), false);
        return Promise.all([
            TextureUtils.load(require('../../assets/blurredBackground.png'), false).then(texture => this.blurred = texture),
            TextureUtils.load(require('../../assets/lab2.png'), false).then(texture => this.lab2 = texture),
            TextureUtils.generateProceduralNoise().then(texture => this.noise = texture),
            this.createProceduralTexture3().then(texture => this.particleTexture2 = texture),
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();

        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);
        framebuffer.setCullFace(CullFace.BACK);
        framebuffer.setTexture(this.lab2);

        this.drawBlenderScene9(framebuffer, time, this.particleTexture2);

        const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
        framebuffer.drawTexture(0, 0, texture3, 0.75);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);

        framebuffer.noise(time, this.noise);
    }

    public drawBlenderScene9(framebuffer: Framebuffer, elapsedTime: number, texture3: Texture): void {
        framebuffer.clearDepthBuffer();

        let scal = Math.sin(elapsedTime * 0.003) * 0.5 + 0.5;
        let camera: Matrix4f =
            Matrix4f.constructTranslationMatrix(0, 0, -34 + (Math.sin(elapsedTime * 0.00007) * 0.5 + 0.5) * 7).multiplyMatrix(
                Matrix4f.constructXRotationMatrix((Math.sin(elapsedTime * 0.00014) * 0.5 + 0.5) * 0.5 - 0.2).multiplyMatrix(
                    Matrix4f.constructYRotationMatrix(-elapsedTime * 0.0002).multiplyMatrix(
                        Matrix4f.constructTranslationMatrix(0, 1.9, 0)
                    )));

        let mv: Matrix4f = camera.multiplyMatrix(Matrix4f.constructScaleMatrix(13, 13, 13));

        for (let j = 0; j < this.spaceLabMesh.length; j++) {
            let model = this.spaceLabMesh[j];
            framebuffer.drawObjectTexture2(model, mv, 244 * scal, 225 * scal, 216 * scal);
        }

        mv = camera.multiplyMatrix(
            Matrix4f.constructTranslationMatrix(0, -5.5, 0).multiplyMatrix(
                Matrix4f.constructScaleMatrix(413, 413, 413).multiplyMatrix(
                    Matrix4f.constructXRotationMatrix(Math.PI * 0.5)
                )
            ));

        let model = this.hoodlumLogoMesh[0];
        framebuffer.flatShadingRenderingPipeline.drawObject2(model, mv, 244, 100, 116, false, true);

        let points: Array<Vector3f> = new Array<Vector3f>();
        const num = 10;
        const num2 = 6;

        for (let i = 0; i < num; i++) {

            for (let j = 0; j < num2; j++) {
                let y = ((i + elapsedTime * 0.001) % 10) * 2.5 - 12;
                let scale2 = (1 + 4 * framebuffer.interpolate(-10, 10, y)) *

                    ((Math.sin(elapsedTime * 0.0012 + Math.PI * 2 / num * i * 2) * 0.5 + 0.5) * 0.5 + 0.5);
                let x = scale2 * Math.sin(Math.PI * 2 / num2 * j + elapsedTime * 0.0008);

                let z = scale2 * Math.cos(Math.PI * 2 / num2 * j + elapsedTime * 0.0008);

                points.push(new Vector3f(x, y, z));
            }
        }

        let modelViewMartrix = camera.multiplyMatrix(Matrix4f.constructTranslationMatrix(0, -0.0, 0));

        let points2: Array<Vector3f> = new Array<Vector3f>(points.length);

        points.forEach(element => {
            let transformed = framebuffer.project(modelViewMartrix.multiply(element));
            points2.push(transformed);
        });

        points2.sort(function (a, b) {
            return a.z - b.z;
        });

        points2.forEach(element => {
            let size = -(4.3 * 192 / (element.z));
            framebuffer.drawSoftParticle(
                Math.round(element.x - size / 2),
                Math.round(element.y - size / 2),
                Math.round(size), Math.round(size), texture3, 1 / element.z, 0.7);
        });
    }

    public createProceduralTexture3(): Promise<Texture> {
        return new Promise((resolve) => {
            const texture = new Texture();
            texture.texture = new Uint32Array(256 * 256);

            let rng = new RandomNumberGenerator();
            rng.setSeed(100);

            for (let y = 0; y < 256; y++) {
                for (let x = 0; x < 256; x++) {
                    let dx = 127 - x
                    let dy = 127 - y
                    let r = Math.sqrt(dx * dx + dy * dy) / 127;
                    let c = 1 - r;
                    c = c * c * c;
                    if (r > 1) c = 0;
                    c = Math.min(1, c * 2.9);

                    texture.texture[x + y * 256] = 235 | 255 << 8 | 235 << 16 | (c * 255) << 24;
                }
            }

            texture.width = 256;
            texture.height = 256;
            resolve(texture);
        });
    }

}
