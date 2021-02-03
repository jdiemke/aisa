import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';
import { Vector4f } from '../../math';
import { WavefrontLoader } from '../../model/wavefront-obj/WavefrontLoader';
import { AbstractScene } from '../../scenes/AbstractScene';
import { PointLight } from '../../shading/light/PointLight';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { ModelViewMatrix } from '../md2/ModelViewMatrix';

export class WavefrontScene extends AbstractScene {

    private static readonly CLEAR_COLOR: number = Color.SLATE_GRAY.toPackedFormat();

    private texture4: Texture;
    private startTime: number;

    private modelViewMatrix: ModelViewMatrix = new ModelViewMatrix();

    private fpsStartTime: number = Date.now();
    private fpsCount: number = 0;
    private fps: number = 0;

    private meshes: Array<FlatshadedMesh>;

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.renderingPipeline.setCullFace(CullFace.BACK);

        const light1: PointLight = new PointLight();
        light1.ambientIntensity = new Vector4f(1, 1, 1, 1);
        light1.diffuseIntensity = new Vector4f(1, 0.5, 1, 1);
        light1.specularIntensity = new Vector4f(0.5, 0.5, 0.7, 1);
        light1.position = new Vector4f(0, -10, -1, 1);

        const light2: PointLight = new PointLight();
        light2.ambientIntensity = new Vector4f(0, 0, 1, 1);
        light2.diffuseIntensity = new Vector4f(0, 0.6, 0, 1);
        light2.specularIntensity = new Vector4f(0.8, 0.8, 0.8, 1);
        light2.position = new Vector4f(3, 0, -2, 1);

        framebuffer.renderingPipeline.setLights([light1, light2]);

        this.startTime = Date.now();
        return Promise.all([
            WavefrontLoader.load(require('../../assets/dragon.obj')).then(
                (value: Array<FlatshadedMesh>) => this.meshes = value
            ),
            TextureUtils.load(require('../../assets/font.png'), true).then(
                (texture: Texture) => this.texture4 = texture),
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const currentTime: number = Date.now();

        if (currentTime > this.fpsStartTime + 1000) {
            this.fpsStartTime = currentTime;
            this.fps = this.fpsCount;
            this.fpsCount = 0;
        }
        this.fpsCount++;

        const time: number = Date.now() - this.startTime;

        framebuffer.clearColorBuffer(WavefrontScene.CLEAR_COLOR);
        framebuffer.clearDepthBuffer();

        this.computeCameraMovement(time * 0.6);

        framebuffer.renderingPipeline.draw(framebuffer, this.meshes[0], this.modelViewMatrix.getMatrix());

        framebuffer.drawText(8, 8, 'FPS: ' + this.fps.toString(), this.texture4);
        framebuffer.drawText(8, 16, 'FACES: ' + this.meshes[0].faces.length, this.texture4);
    }

    private computeCameraMovement(elapsedTime: number): void {
        this.modelViewMatrix.setIdentity();
        this.modelViewMatrix.trans(0, 0, -5);
        this.modelViewMatrix.yRotate(-elapsedTime * 0.002);
        this.modelViewMatrix.xRotate(-elapsedTime * 0.002);
    }

}
