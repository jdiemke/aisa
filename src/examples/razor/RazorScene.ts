import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Cube } from '../../geometrical-objects/Cube';
import { Dodecahedron } from '../../geometrical-objects/Dodecahedron';
import { Pyramid } from '../../geometrical-objects/Pyramid';
import { Sphere } from '../../geometrical-objects/Sphere';
import { Matrix4f, Vector3f } from '../../math';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { Color } from '../../core/Color';
import { GouraudShadingRenderingPipeline } from '../../rendering-pipelines/GouraudShadingRenderingPipeline';
import { LensFlare } from '../../special-effects/LensFlare';

/**
 * TODO: extract lens into effect class
 */
export class RazorScene extends AbstractScene {

    private texture10: Texture;
    private texture11: Texture;
    private texture13: Texture;
    private dirt: Texture;
    private noise: Texture;

    private cube: Cube;
    private dodecahedron: Dodecahedron;
    private pyramid: Pyramid;
    private icosahedron: Sphere; // Icosahedron;

    private accumulationBuffer: Uint32Array;
    private renderingPipeline: GouraudShadingRenderingPipeline;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.renderingPipeline = new GouraudShadingRenderingPipeline(framebuffer);
        this.accumulationBuffer = new Uint32Array(framebuffer.width * framebuffer.height);
        this.renderingPipeline.setCullFace(CullFace.BACK);

        this.cube = new Cube();
        this.dodecahedron = new Dodecahedron();
        this.pyramid = new Pyramid();
        this.icosahedron = new Sphere(6, 10);

        return Promise.all([
            TextureUtils.load(require('@assets/spark.png'), true).then(texture => this.texture10 = texture),
            TextureUtils.load(require('@assets/ring.png'), true).then(texture => this.texture11 = texture),
            TextureUtils.load(require('@assets/bokeh.png'), true).then(texture => this.texture13 = texture),
            TextureUtils.load(require('@assets/dirt.png'), true).then(texture => this.dirt = texture),
            TextureUtils.generateProceduralNoise().then(texture => this.noise = texture),
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {

        this.reproduceRazorScene(framebuffer, time * 0.0025, [
            { tex: this.texture10, scale: 0.0, alpha: 1.0 },
            { tex: this.texture11, scale: 2.3, alpha: 0.5 },
            { tex: this.texture13, scale: 1.6, alpha: 0.25 },
            { tex: this.texture13, scale: 0.7, alpha: 0.22 },
            { tex: this.texture13, scale: -0.4, alpha: 0.22 },
        ], this.dirt);

        const texture3: Texture = new Texture(this.accumulationBuffer, framebuffer.width, framebuffer.height);
        // framebuffer.drawTexture(0, 0, texture3, 0.75);
        framebuffer.drawScaledTextureClipBi(0, 0, framebuffer.width, framebuffer.height, texture3, .75);

        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);
        framebuffer.noise(time, this.noise, 0.04);
    }

    public reproduceRazorScene(framebuffer: Framebuffer, elapsedTime: number, texture: Array<{ tex: Texture, scale: number, alpha: number }>, dirt: Texture): void {
        // camerea:
        // http://graphicsrunner.blogspot.de/search/label/Water
        framebuffer.clearColorBuffer(72 | 56 << 8 | 48 << 16 | 255 << 24);
        framebuffer.clearDepthBuffer();

        let modelViewMartrix: Matrix4f;

        const camera = Matrix4f.constructTranslationMatrix(0, 0, -6.4 - 5 * (Math.sin(elapsedTime * 0.06) * 0.5 + 0.5)).multiplyMatrix(
            Matrix4f.constructXRotationMatrix((Math.sin(elapsedTime * 0.08) * 0.5 + 0.5) * 0.5).multiplyMatrix(
                Matrix4f.constructYRotationMatrix(elapsedTime * 0.1)));

        let scale = 2.0;
        modelViewMartrix = Matrix4f.constructYRotationMatrix(elapsedTime * 0.2).multiplyMatrix(Matrix4f.constructScaleMatrix(scale, scale, scale));
        modelViewMartrix = Matrix4f.constructTranslationMatrix(0, 1.0, 0).multiplyMatrix(modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(-elapsedTime * 0.2)));
        modelViewMartrix = camera.multiplyMatrix(
            modelViewMartrix);


        let model = this.dodecahedron.getMesh();
        this.renderingPipeline.draw(framebuffer, model, modelViewMartrix);

        const yDisplacement = -1.5;
        const distance = 2.8;
        scale = 1.0;
        modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale);
        modelViewMartrix = Matrix4f.constructTranslationMatrix(distance, yDisplacement + 1.0, distance).multiplyMatrix(modelViewMartrix);
        modelViewMartrix = camera.multiplyMatrix(modelViewMartrix);

        model = this.icosahedron.getMesh();
        this.renderingPipeline.draw(framebuffer, model, modelViewMartrix);

        scale = 1.0;
        modelViewMartrix = Matrix4f.constructScaleMatrix(scale * 0.5, scale * 2, scale * 0.5);
        modelViewMartrix = Matrix4f.constructTranslationMatrix(-distance, yDisplacement + 1, distance).multiplyMatrix(modelViewMartrix);
        modelViewMartrix = camera.multiplyMatrix(modelViewMartrix);

        // TODO:  store Mesh inside cube instance and use cube.draw(framebuffer);
        model = this.cube.getMesh();
        this.renderingPipeline.draw(framebuffer, model, modelViewMartrix);

        scale = 1.0;
        modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale);
        modelViewMartrix = Matrix4f.constructTranslationMatrix(distance, yDisplacement + 0.5, -distance).multiplyMatrix(modelViewMartrix);
        modelViewMartrix = camera.multiplyMatrix(modelViewMartrix);

        model = this.cube.getMesh();
        this.renderingPipeline.draw(framebuffer, model, modelViewMartrix);

        scale = 1.0;
        modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale);
        modelViewMartrix = Matrix4f.constructTranslationMatrix(-distance, yDisplacement + 0.5, -distance).multiplyMatrix(modelViewMartrix);
        modelViewMartrix = camera.multiplyMatrix(modelViewMartrix);

        model = this.pyramid.getMesh();
        this.renderingPipeline.draw(framebuffer, model, modelViewMartrix);

        /**
         * SHADOWS
         */
        this.renderingPipeline.enableLighting(false);
        this.renderingPipeline.setColor(Color.DARK_GRAY);

        scale = 2.0;
        modelViewMartrix = Matrix4f.constructYRotationMatrix(elapsedTime * 0.2).multiplyMatrix(Matrix4f.constructScaleMatrix(scale, scale, scale));
        modelViewMartrix = Matrix4f.constructTranslationMatrix(0, 1.0, 0).multiplyMatrix(modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(-elapsedTime * 0.2)));
        modelViewMartrix = camera.multiplyMatrix(
            Matrix4f.constructShadowMatrix().multiplyMatrix(modelViewMartrix));

            this.renderingPipeline.draw(framebuffer, this.dodecahedron.getMesh(), modelViewMartrix);

        scale = 1.0;
        modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale);
        modelViewMartrix = Matrix4f.constructTranslationMatrix(-distance, yDisplacement + 0.5, -distance).multiplyMatrix(modelViewMartrix);
        modelViewMartrix = camera.multiplyMatrix(
            Matrix4f.constructShadowMatrix().multiplyMatrix(modelViewMartrix));

            this.renderingPipeline.draw(framebuffer, this.pyramid.getMesh(), modelViewMartrix);

        scale = 1.0;
        modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale);
        modelViewMartrix = Matrix4f.constructTranslationMatrix(distance, yDisplacement + 0.5, -distance).multiplyMatrix(modelViewMartrix);
        modelViewMartrix = camera.multiplyMatrix(
            Matrix4f.constructShadowMatrix().multiplyMatrix(modelViewMartrix));

            this.renderingPipeline.draw(framebuffer, this.cube.getMesh(), modelViewMartrix);

        scale = 1.0;
        modelViewMartrix = Matrix4f.constructScaleMatrix(scale * 0.5, scale * 2, scale * 0.5);
        modelViewMartrix = Matrix4f.constructTranslationMatrix(-distance, yDisplacement + 1, distance).multiplyMatrix(modelViewMartrix);
        modelViewMartrix = camera.multiplyMatrix(
            Matrix4f.constructShadowMatrix().multiplyMatrix(modelViewMartrix));

            this.renderingPipeline.draw(framebuffer, this.cube.getMesh(), modelViewMartrix);

        scale = 1.0;
        modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale);
        modelViewMartrix = Matrix4f.constructTranslationMatrix(distance, yDisplacement + 1.0, distance).multiplyMatrix(modelViewMartrix);
        modelViewMartrix = camera.multiplyMatrix(
            Matrix4f.constructShadowMatrix().multiplyMatrix(modelViewMartrix));

            this.renderingPipeline.draw(framebuffer, this.icosahedron.getMesh(), modelViewMartrix);

        this.renderingPipeline.enableLighting(true);

        const lensflareScreenSpace = framebuffer.project(camera.multiply(new Vector3f(12.0, 4.0, 0)));

        LensFlare.drawLensFlare(framebuffer, lensflareScreenSpace, elapsedTime * 100, texture, dirt);
    }

}
