import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Cube } from '../../geometrical-objects/Cube';
import { Matrix4f } from '../../math/Matrix4f';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { FlatShadingRenderingPipeline } from '../../rendering-pipelines/FlatShadingRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture/index';
import { Vector4f } from '../../math';
import { Material } from '../../shading/material/Material';
import { PointLight } from '../../shading/light/PointLight';

/**
 * TODO: use cube mesh and draw using drawObject2
 */
export class CubeTunnelScene extends AbstractScene {

    private static BACKGROUND_COLOR: number = Color.DARK_GRAY.toPackedFormat();
    private renderingPipeline: FlatShadingRenderingPipeline;
    private cubeMesh: Cube = new Cube();
    private accumulationBuffer: Uint32Array;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.accumulationBuffer = new Uint32Array(framebuffer.width * framebuffer.height);
        framebuffer.setCullFace(CullFace.BACK);
        this.renderingPipeline = new FlatShadingRenderingPipeline(framebuffer);

        const light1: PointLight = new PointLight();
        light1.ambientIntensity = new Vector4f(1, 1, 1, 1);
        light1.diffuseIntensity = new Vector4f(1, 1, 1, 1);
        light1.specularIntensity = new Vector4f(1, 1, 1, 1);
        light1.position = new Vector4f(0, 0, -10, 1);

        this.renderingPipeline.setLights([light1]);

        const mat: Material = new Material();
        mat.ambientColor = new Vector4f(0.12, 0.14, 0.1, 0);
        mat.diffuseColor = new Vector4f(0.38, 0.4, 0.4, 1);
        mat.specularColor = new Vector4f(0.8, 0.5, 0.5, 0);
        mat.shininess = 2;

        this.renderingPipeline.setMaterial(mat);

        return Promise.all([]);
    }

    public render(framebuffer: Framebuffer): void {
        //   framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);
        const elapsedTime: number = Date.now() * 0.02;

        framebuffer.clearColorBuffer(CubeTunnelScene.BACKGROUND_COLOR);
        framebuffer.clearDepthBuffer();

        const xSteps = 40;
        const xsteps = 5;
        const rot = 25;
        const rand = new RandomNumberGenerator();
        rand.setSeed(22);

        for (let x = 0; x < xSteps; x++) {
            const rotSpeed = rand.getFloat() * 0.3 + 0.2;
            for (let z = 0; z < rot; z++) {

                const scale = rand.getFloat() * 2.3 + 0.7 + 0.2 * (Math.sin(Date.now() * 0.0044 + rand.getFloat() * 3));
                const size = (xSteps - 1) * 0.7;
                const mat =
                    Matrix4f.constructXRotationMatrix(0.2 * Math.sin(Date.now() * 0.00044)).multiplyMatrix(
                        Matrix4f.constructYRotationMatrix(0.2 * Math.sin(Date.now() * 0.0004)).multiplyMatrix(
                            Matrix4f.constructTranslationMatrix(0, 0,
                                -20 - ((x * 0.7 + Date.now() * 0.002) % size) + size
                            ).multiplyMatrix(

                                Matrix4f.constructZRotationMatrix(Math.PI * 2 / rot * z + Date.now() * rotSpeed * 0.002 + x * 0.2).multiplyMatrix(
                                    Matrix4f.constructTranslationMatrix(+ 3, 0, 0)
                                        .multiplyMatrix(
                                            Matrix4f.constructScaleMatrix(scale, 0.5, 0.5)))))); // .multiplyMatrix(
                //       Matrix4f.constructYRotationMatrix(elapsedTime * 0.05)).multiplyMatrix(
                //           Matrix4f.constructXRotationMatrix(elapsedTime * 0.08)));

                this.renderingPipeline.draw(this.cubeMesh.getMesh(), mat);
            }

        }


        // const texture3: Texture = new Texture(this.accumulationBuffer, framebuffer.width, framebuffer.height);
        //  framebuffer.drawTextureFullscreen(texture3, 0.75);
        //  framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);

    }



}
