import { BlenderJsonParser } from '../../blender/BlenderJsonParser';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';
import { Vector4f } from '../../math';
import { Matrix4f } from '../../math/Matrix4f';
import { FlatShadingRenderingPipeline } from '../../rendering-pipelines/FlatShadingRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';
import { PointLight } from '../../shading/light/PointLight';
import { Material } from '../../shading/material/Material';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';

/**
 * TODO: use cube mesh and draw using drawObject2
 */
export class AbstractCube extends AbstractScene {

    private blurred: Texture;
    private noise: Texture;
    private renderingPipeline: FlatShadingRenderingPipeline;
    private scene: Array<FlatshadedMesh>;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.renderingPipeline = new FlatShadingRenderingPipeline(framebuffer);
        this.renderingPipeline.setCullFace(CullFace.BACK);
        this.renderingPipeline.setLights(this.constructSceneLights());
        this.renderingPipeline.setMaterial(this.constructSceneMaterial());

        this.scene = BlenderJsonParser.parse(require('../../assets/mybunny.json'), false);

        return Promise.all([
            TextureUtils.load(require('../../assets/blurredBackground.png'), false).then(
                (texture: Texture) => this.blurred = texture
            ),
            TextureUtils.generateProceduralNoise().then(
                (texture: Texture) => this.noise = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();

        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);
        this.drawBlenderScene2(framebuffer, time);
        framebuffer.noise(time, this.noise);
    }

    public drawBlenderScene2(framebuffer: Framebuffer, elapsedTime: number): void {
        framebuffer.clearDepthBuffer();

        const camera: Matrix4f = Matrix4f.constructTranslationMatrix(0, 0, -4).multiplyMatrix(
            Matrix4f.constructYRotationMatrix(elapsedTime * 0.0009)
                .multiplyMatrix(
                    Matrix4f.constructXRotationMatrix(elapsedTime * 0.0009)
                ).multiplyMatrix(Matrix4f.constructTranslationMatrix(0, -2, 0))
        );

        const mv: Matrix4f = camera.multiplyMatrix(Matrix4f.constructScaleMatrix(10, 10, 10));
        const model: FlatshadedMesh = this.scene[0];
        this.renderingPipeline.draw(model, mv);
    }

    private constructSceneLights(): Array<PointLight> {
        const light1: PointLight = new PointLight();
        light1.ambientIntensity = new Vector4f(1, 1, 1, 1);
        light1.diffuseIntensity = new Vector4f(.9, 0.5, 0.6, 1);
        light1.specularIntensity = new Vector4f(0.4, 0.4, 0.4, 1);
        light1.position = new Vector4f(1, 0, -2, 1);

        const light2: PointLight = new PointLight();
        light2.ambientIntensity = new Vector4f(0, 0, 1, 1);
        light2.diffuseIntensity = new Vector4f(0, 0.6, 1, 1);
        light2.specularIntensity = new Vector4f(0.4, 0.4, 0.4, 1);
        light2.position = new Vector4f(4, -4, -1, 1);

        return [light1, light2];
    }

    private constructSceneMaterial(): Material {
        const mat: Material = new Material();
        mat.ambientColor = new Vector4f(0.12, 0.14, 0.1, 0);
        mat.diffuseColor = new Vector4f(0.38, 0.4, 0.4, 1);
        mat.specularColor = new Vector4f(0.8, 0.5, 0.5, 0);
        mat.shininess = 2;

        return mat;
    }

}
