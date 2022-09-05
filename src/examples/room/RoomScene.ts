import { Framebuffer } from '../../Framebuffer';
import { Matrix4f, Vector3f, Vector4f } from '../../math';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { Material } from '../../shading/material/Material';
import { BlenderLoader } from './../../model/blender/BlenderLoader';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';
import { GouraudShadingRenderingPipeline } from '../../rendering-pipelines/GouraudShadingRenderingPipeline';

export class RoomScene extends AbstractScene {

    private noise: Texture;
    private accumulationBuffer: Uint32Array;
    private texture10: Texture;
    private texture11: Texture;
    private texture13: Texture;
    private dirt: Texture;
    private blenderObj4: Array<FlatshadedMesh>;
    private blenderObj5: Array<FlatshadedMesh>;
    private renderingPipeline: GouraudShadingRenderingPipeline;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.renderingPipeline = new GouraudShadingRenderingPipeline(framebuffer);
        this.renderingPipeline.setFramebuffer(framebuffer);
        this.accumulationBuffer = new Uint32Array(framebuffer.width * framebuffer.height);

        return Promise.all([
            BlenderLoader.load(require('../../assets/jsx/room.jsx')).then(
                (mesh: Array<FlatshadedMesh>) => this.blenderObj4 = mesh
            ),
            BlenderLoader.load(require('../../assets/jsx/hoodlum.jsx')).then(
                (mesh: Array<FlatshadedMesh>) => this.blenderObj5 = mesh
            ),
            TextureUtils.generateProceduralNoise().then(texture => this.noise = texture),
            TextureUtils.load(require('../../assets/spark.png'), true).then(texture => this.texture10 = texture),
            TextureUtils.load(require('../../assets/ring.png'), true).then(texture => this.texture11 = texture),
            TextureUtils.load(require('../../assets/bokeh.png'), true).then(texture => this.texture13 = texture),
            TextureUtils.load(require('../../assets/dirt.png'), true).then(texture => this.dirt = texture)
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();

        this.drawBlenderScene5(framebuffer, time * 2, [
            { tex: this.texture11, scale: 2.3, alpha: 0.5 * 1.9 },
            { tex: this.texture13, scale: 1.6, alpha: 0.25 * 1.9 },
            { tex: this.texture13, scale: 1.15, alpha: 0.25 * 1.9 },
            { tex: this.texture13, scale: 0.7, alpha: 0.22 * 1.9 },
            { tex: this.texture13, scale: -0.4, alpha: 0.22 * 1.9 },
        ], this.dirt, this.texture10);

        // Motion Blur
        const texture3 = new Texture(this.accumulationBuffer, 320, 200);
        framebuffer.drawTexture(0, 0, texture3, 0.80);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);
        framebuffer.noise(time, this.noise);
    }

    public drawBlenderScene5(framebuffer: Framebuffer, elapsedTime: number, texture: Array<{ tex: Texture, scale: number, alpha: number }>, dirt: Texture,
        spark: Texture): void {

        framebuffer.clearDepthBuffer();

        const camera: Matrix4f =
            Matrix4f.constructTranslationMatrix(0, 0, -40 + (Math.sin(elapsedTime * 0.0006) * 0.5 + 0.5) * 2).multiplyMatrix(
                Matrix4f.constructXRotationMatrix((Math.sin(elapsedTime * 0.00014) * 0.5 + 0.5) * 0.5 - 0.2).multiplyMatrix(
                    Matrix4f.constructYRotationMatrix(-elapsedTime * 0.0002).multiplyMatrix(

                        Matrix4f.constructTranslationMatrix(0, -10, 0)
                    )));

        let mv: Matrix4f = camera.multiplyMatrix(Matrix4f.constructScaleMatrix(17, 17, 17));

        const mat1: Material = new Material();
        mat1.ambientColor = new Vector4f(0.12, 0.12, 0.12, 0);
        mat1.diffuseColor = new Vector4f(0.4, 0.4, 0.4, 1);
        mat1.specularColor = new Vector4f(0.8, 0.5, 0.5, 0);
        mat1.shininess = 2;

        const mat2: Material = new Material();
        mat2.ambientColor = new Vector4f(0.12, 0.24, 0.1, 0);
        mat2.diffuseColor = new Vector4f(0.38, 0.4, 0.4, 1);
        mat2.specularColor = new Vector4f(1.0, 1.0, 1.0, 0);
        mat2.shininess = 3;

        const mat3: Material = new Material();
        mat3.ambientColor = new Vector4f(0.03, 0.02, 0.02, 0);
        mat3.diffuseColor = new Vector4f(0.38, 0.4, 0.4, 1);
        mat3.specularColor = new Vector4f(1.0, 1.0, 1.0, 0);
        mat3.shininess = 100;


        for (let j = 0; j < this.blenderObj4.length; j++) {
            const model = this.blenderObj4[j];
            if (j !== 0 && j !== 2) {
                this.renderingPipeline.setMaterial(mat1);
                this.renderingPipeline.draw(framebuffer, model, mv);
            }

            if (j === 0) {
                this.renderingPipeline.setMaterial(mat2);
                this.renderingPipeline.draw(framebuffer, model, mv);
            }
            if (j === 2) {
                this.renderingPipeline.setMaterial(mat3);
                this.renderingPipeline.draw(framebuffer, model, mv);
            }

        }

        mv = camera.multiplyMatrix(
            Matrix4f.constructTranslationMatrix(0, 14.2, -4).multiplyMatrix(Matrix4f.constructScaleMatrix(10, 10, 10).multiplyMatrix(
                Matrix4f.constructXRotationMatrix(
                    Math.PI * 2 * framebuffer.cosineInterpolate(0, 1300, Math.floor(elapsedTime * 0.7) % 4000)))
            ));


        const mat4: Material = new Material();
        mat4.ambientColor = new Vector4f(0.0, 0.0, 0.0, 0);
        mat4.diffuseColor = new Vector4f(1.0, 0.7, 0.5, 1);
        mat4.specularColor = new Vector4f(0.6, 0.6, 0.6, 0);
        mat4.shininess = 80;
        const model2 = this.blenderObj5[0];
        this.renderingPipeline.setMaterial(mat4);
        this.renderingPipeline.draw(framebuffer, model2, mv);

        const scale: number = 8 * 3;
        mv = camera.multiplyMatrix(
            Matrix4f.constructTranslationMatrix(0, 19, 0).multiplyMatrix(
                Matrix4f.constructScaleMatrix(scale, scale, scale)));

        const light = camera.multiply(new Vector3f(20, 19, -90));
        const lensflareScreenSpace = framebuffer.project(light);

        framebuffer.drawParticleStreams(framebuffer, elapsedTime, spark, false, light,

        );

        framebuffer.drawLensFlare(lensflareScreenSpace, elapsedTime * 0.15, texture, dirt);
    }

}
