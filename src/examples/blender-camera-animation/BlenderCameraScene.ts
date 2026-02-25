import { CameraKeyFrame } from '../../animation/CameraKeyFrame';
import { CameraLoader } from '../../camera/CameraLoader';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';
import { Matrix4f, Vector4f } from '../../math';
import { WavefrontLoader } from '../../model/wavefront-obj/WavefrontLoader';
import { AbstractScene } from '../../scenes/AbstractScene';
import { PointLight } from '../../shading/light/PointLight';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';

import { BlenderCameraAnimator } from '../../animation/BlenderCameraAnimator';
import { SkyBox } from '../../SkyBox';
import { GouraudShadingRenderingPipeline } from '../../rendering-pipelines/GouraudShadingRenderingPipeline';

export class BlenderCameraScene extends AbstractScene {

    private texture4: Texture;
    private fpsStartTime: number = Date.now();
    private fpsCount: number = 0;
    private fps: number = 0;

    private meshes: Array<FlatshadedMesh>;
    private path: Array<CameraKeyFrame>;
    private skyBox: SkyBox;

    private light1: PointLight;
    private light2: PointLight;

    private cameraAnimator: BlenderCameraAnimator;

    private renderingPipeline: GouraudShadingRenderingPipeline;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.renderingPipeline = new GouraudShadingRenderingPipeline(framebuffer);
        this.renderingPipeline.setCullFace(CullFace.BACK);

        this.light1 = new PointLight();
        this.light1.ambientIntensity = new Vector4f(1, 1, 1, 1);
        this.light1.diffuseIntensity = new Vector4f(1, 0.0, 1, 1);
        this.light1.specularIntensity = new Vector4f(0.5, 0.5, 0.7, 1);
        this.light1.position = new Vector4f(0, -10, -1, 1);

        this.light2 = new PointLight();
        this.light2.ambientIntensity = new Vector4f(0.5, 0.5, 1, 1);
        this.light2.diffuseIntensity = new Vector4f(0.3, 0.3, 1, 1);
        this.light2.specularIntensity = new Vector4f(0.8, 0.8, 0.8, 1);
        this.light2.position = new Vector4f(3, 0, -2, 1);

        this.renderingPipeline.setLights([this.light1, this.light2]);

        this.skyBox = new SkyBox();
        return Promise.all([
            this.skyBox.init(),
            WavefrontLoader.load(require('@assets/wavefront/monkey.obj')).then(
                (value: Array<FlatshadedMesh>) => this.meshes = value
            ),
            CameraLoader.load(require('@assets/camera-path.jsx')).then(
                (value: Array<CameraKeyFrame>) => this.path = value
            ),
            TextureUtils.load(require('@assets/fonts/font.png'), true).then(
                (texture: Texture) => this.texture4 = texture),
        ]).then(() => {
            this.cameraAnimator = new BlenderCameraAnimator();
            this.cameraAnimator.setKeyFrames(this.path);
        });
    }

    private computeFps(currentTime: number): void {
        if (currentTime > this.fpsStartTime + 1000) {
            this.fpsStartTime = currentTime;
            this.fps = this.fpsCount;
            this.fpsCount = 0;
        }
        this.fpsCount++;
    }

    public render(framebuffer: Framebuffer, timeInput: number): void {
        const currentTime: number = Date.now();
        this.computeFps(currentTime);

        const modelViewMartrix: Matrix4f = this.cameraAnimator.getViewMatrix(timeInput);

        this.skyBox.draw(framebuffer, modelViewMartrix);

        framebuffer.clearDepthBuffer();
        this.renderingPipeline.drawMeshArray(framebuffer, this.meshes, modelViewMartrix);

        framebuffer.drawText(8, 8, 'FPS: ' + this.fps.toString(), this.texture4);
    }

}
