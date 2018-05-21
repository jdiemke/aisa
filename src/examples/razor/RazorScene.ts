import { Canvas } from '../../Canvas';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { Matrix4f, Vector3f } from '../../math';

/**
 * TODO: extract lens into effect class
 */
export class RazorScene extends AbstractScene {

    private texture10: Texture;
    private texture11: Texture;
    private texture13: Texture;
    private dirt: Texture;
    private noise: Texture;

    private accumulationBuffer: Uint32Array = new Uint32Array(320 * 200);

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.setCullFace(CullFace.BACK);

        return Promise.all([
            TextureUtils.load(require('./assets/spark.png'), true).then(texture => this.texture10 = texture),
            TextureUtils.load(require('./assets/ring.png'), true).then(texture => this.texture11 = texture),
            TextureUtils.load(require('./assets/bokeh.png'), true).then(texture => this.texture13 = texture),
            TextureUtils.load(require('./assets/dirt.png'), true).then(texture => this.dirt = texture),
            this.createProceduralTexture4().then(texture => this.noise = texture),
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();

        this.reproduceRazorScene(framebuffer, time * 0.0018, [
            { tex: this.texture10, scale: 0.0, alpha: 1.0 },
            { tex: this.texture11, scale: 2.3, alpha: 0.5 },
            { tex: this.texture13, scale: 1.6, alpha: 0.25 },
            { tex: this.texture13, scale: 0.7, alpha: 0.22 },
            { tex: this.texture13, scale: -0.4, alpha: 0.22 },
        ], this.dirt);

        const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
        framebuffer.drawTexture(0, 0, texture3, 0.75);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);
        framebuffer.noise(time, this.noise, 0.04);
    }

    public reproduceRazorScene(framebuffer: Framebuffer, elapsedTime: number, texture: { tex: Texture, scale: number, alpha: number }[], dirt: Texture): void {
        // camerea:
        // http://graphicsrunner.blogspot.de/search/label/Water
        framebuffer.clearColorBuffer(72 | 56 << 8 | 48 << 16 | 255 << 24);
        framebuffer.clearDepthBuffer();

        let modelViewMartrix: Matrix4f;

        let camera = Matrix4f.constructTranslationMatrix(0, 0, -6.4 - 5 * (Math.sin(elapsedTime * 0.06) * 0.5 + 0.5)).multiplyMatrix(
            Matrix4f.constructXRotationMatrix((Math.sin(elapsedTime * 0.08) * 0.5 + 0.5) * 0.5).multiplyMatrix(
                Matrix4f.constructYRotationMatrix(elapsedTime * 0.1)));

        let scale = 2.0;
        modelViewMartrix = Matrix4f.constructYRotationMatrix(elapsedTime * 0.2).multiplyMatrix(Matrix4f.constructScaleMatrix(scale, scale, scale));
        modelViewMartrix = Matrix4f.constructTranslationMatrix(0, 1.0, 0).multiplyMatrix(modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(-elapsedTime * 0.2)));
        modelViewMartrix = camera.multiplyMatrix(
            modelViewMartrix);

        let colLine = 255 << 24 | 255 << 8;

        let model = framebuffer.getDodecahedronMesh();
        framebuffer.drawObject(model, modelViewMartrix, 221, 96, 48);

        let yDisplacement = -1.5;
        let distance = 2.8;
        scale = 1.0;
        modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale);
        modelViewMartrix = Matrix4f.constructTranslationMatrix(distance, yDisplacement + 1.0, distance).multiplyMatrix(modelViewMartrix);
        modelViewMartrix = camera.multiplyMatrix(modelViewMartrix);

        model = framebuffer.getIcosahedronMesh();
        framebuffer.drawObject(model, modelViewMartrix, 239, 187, 115);

        scale = 1.0;
        modelViewMartrix = Matrix4f.constructScaleMatrix(scale * 0.5, scale * 2, scale * 0.5);
        modelViewMartrix = Matrix4f.constructTranslationMatrix(-distance, yDisplacement + 1, distance).multiplyMatrix(modelViewMartrix);
        modelViewMartrix = camera.multiplyMatrix(modelViewMartrix);

        model = framebuffer.getCubeMesh()
        framebuffer.drawObject(model, modelViewMartrix, 144, 165, 116);

        scale = 1.0;
        modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale);
        modelViewMartrix = Matrix4f.constructTranslationMatrix(distance, yDisplacement + 0.5, -distance).multiplyMatrix(modelViewMartrix);
        modelViewMartrix = camera.multiplyMatrix(modelViewMartrix);

        model = framebuffer.getCubeMesh();
        framebuffer.drawObject(model, modelViewMartrix, 191, 166, 154);

        scale = 1.0;
        modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale);
        modelViewMartrix = Matrix4f.constructTranslationMatrix(-distance, yDisplacement + 0.5, -distance).multiplyMatrix(modelViewMartrix);
        modelViewMartrix = camera.multiplyMatrix(modelViewMartrix);

        model = framebuffer.getPyramidMesh();
        framebuffer.drawObject(model, modelViewMartrix, 125, 128, 146);

        /**
         * SHADOWS
         */

        scale = 2.0;
        modelViewMartrix = Matrix4f.constructYRotationMatrix(elapsedTime * 0.2).multiplyMatrix(Matrix4f.constructScaleMatrix(scale, scale, scale));
        modelViewMartrix = Matrix4f.constructTranslationMatrix(0, 1.0, 0).multiplyMatrix(modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(-elapsedTime * 0.2)));
        modelViewMartrix = camera.multiplyMatrix(
            Matrix4f.constructShadowMatrix(modelViewMartrix).multiplyMatrix(modelViewMartrix));

        framebuffer.drawObject(framebuffer.getDodecahedronMesh(), modelViewMartrix, 48, 32, 24, true);

        scale = 1.0;
        modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale);
        modelViewMartrix = Matrix4f.constructTranslationMatrix(-distance, yDisplacement + 0.5, -distance).multiplyMatrix(modelViewMartrix);
        modelViewMartrix = camera.multiplyMatrix(
            Matrix4f.constructShadowMatrix(modelViewMartrix).multiplyMatrix(modelViewMartrix));

        framebuffer.drawObject(framebuffer.getPyramidMesh(), modelViewMartrix, 48, 32, 24, true, true);

        scale = 1.0;
        modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale);
        modelViewMartrix = Matrix4f.constructTranslationMatrix(distance, yDisplacement + 0.5, -distance).multiplyMatrix(modelViewMartrix);
        modelViewMartrix = camera.multiplyMatrix(
            Matrix4f.constructShadowMatrix(modelViewMartrix).multiplyMatrix(modelViewMartrix))

        framebuffer.drawObject(framebuffer.getCubeMesh(), modelViewMartrix, 48, 32, 24, true);

        scale = 1.0;
        modelViewMartrix = Matrix4f.constructScaleMatrix(scale * 0.5, scale * 2, scale * 0.5);
        modelViewMartrix = Matrix4f.constructTranslationMatrix(-distance, yDisplacement + 1, distance).multiplyMatrix(modelViewMartrix);
        modelViewMartrix = camera.multiplyMatrix(
            Matrix4f.constructShadowMatrix(modelViewMartrix).multiplyMatrix(modelViewMartrix))

        framebuffer.drawObject(framebuffer.getCubeMesh(), modelViewMartrix, 48, 32, 24, true);

        scale = 1.0;
        modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale);
        modelViewMartrix = Matrix4f.constructTranslationMatrix(distance, yDisplacement + 1.0, distance).multiplyMatrix(modelViewMartrix);
        modelViewMartrix = camera.multiplyMatrix(
            Matrix4f.constructShadowMatrix(modelViewMartrix).multiplyMatrix(modelViewMartrix));


        framebuffer.drawObject(framebuffer.getIcosahedronMesh(), modelViewMartrix, 48, 32, 24, true);

        let lensflareScreenSpace = framebuffer.project(camera.multiply(new Vector3f(12.0, 4.0, 0)));

        framebuffer.drawLensFlare(lensflareScreenSpace, elapsedTime * 100, texture, dirt);
    }

    public createProceduralTexture4(): Promise<Texture> {
        return new Promise((resolve) => {
            const texture = new Texture();
            texture.texture = new Uint32Array(256 * 256);

            const rng: RandomNumberGenerator = new RandomNumberGenerator();
            rng.setSeed(100);

            for (let i: number = 0; i < 256 * 256; i++) {
                const scale: number = rng.getFloat();
                texture.texture[i] = 200 * scale | 255 * scale << 8 | 205 * scale << 16 | 255 << 24;
            }

            texture.width = 256;
            texture.height = 256;
            resolve(texture);
        });
    }

}