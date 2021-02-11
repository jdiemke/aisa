import { CameraKeyFrame } from '../../animation/CameraKeyFrame';
import { CameraLoader } from '../../camera/CameraLoader';
import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';
import { Matrix4f, Vector4f } from '../../math';
import { WavefrontLoader } from '../../model/wavefront-obj/WavefrontLoader';
import { AbstractScene } from '../../scenes/AbstractScene';
import { PointLight } from '../../shading/light/PointLight';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { ModelViewMatrix } from '../md2/ModelViewMatrix';

import CameraPathFile from '../../assets/camera-path.jsx';
import { BlenderCameraAnimator } from '../../animation/BlenderCameraAnimator';
import { SkyBox } from '../../SkyBox';

export class BlenderCameraScene extends AbstractScene {

    private static readonly CLEAR_COLOR: number = Color.ORANGE.toPackedFormat();

    private texture4: Texture;
    private startTime: number;

    private modelViewMatrix: ModelViewMatrix = new ModelViewMatrix();

    private fpsStartTime: number = Date.now();
    private fpsCount: number = 0;
    private fps: number = 0;

    private meshes: Array<FlatshadedMesh>;
    private path: Array<CameraKeyFrame>;
    private skyBox: SkyBox;

    private light1: PointLight;
    private light2: PointLight;

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.renderingPipeline.setCullFace(CullFace.BACK);

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

        framebuffer.renderingPipeline.setLights([this.light1, this.light2]);

        console.log(CameraPathFile);
        this.skyBox = new SkyBox();
        this.startTime = Date.now();
        return Promise.all([
            this.skyBox.init(),
            WavefrontLoader.load(require('../../assets/monkey.obj')).then(
                (value: Array<FlatshadedMesh>) => this.meshes = value
            ),
            CameraLoader.load(CameraPathFile).then(
                (value: Array<CameraKeyFrame>) => this.path = value
            ),
            TextureUtils.load(require('../../assets/font.png'), true).then(
                (texture: Texture) => this.texture4 = texture),
        ]);
    }

    public render(framebuffer: Framebuffer, timeInput: number): void {
        const currentTime: number = Date.now();
        framebuffer.renderingPipeline.setCullFace(CullFace.BACK);
        framebuffer.renderingPipeline.setLights([this.light1, this.light2]);


        if (currentTime > this.fpsStartTime + 1000) {
            this.fpsStartTime = currentTime;
            this.fps = this.fpsCount;
            this.fpsCount = 0;
        }
        this.fpsCount++;

        const time: number = Date.now() - this.startTime;
        const cameraAnimator = new BlenderCameraAnimator();
        cameraAnimator.setKeyFrames(this.path);

        const modelViewMartrix: Matrix4f = cameraAnimator.getViewMatrix(timeInput);

        // framebuffer.clearColorBuffer(WavefrontScene.CLEAR_COLOR);
        this.skyBox.draw(framebuffer, modelViewMartrix);
        framebuffer.clearDepthBuffer();

        this.computeCameraMovement(time * 0.6);



        // TODO: move loop into render pipeline
        // TODO: use frame position for interpolation speed
        let faces: number = 0;
        for (let j = 0; j < this.meshes.length; j++) {
            framebuffer.renderingPipeline.draw(framebuffer, this.meshes[j], modelViewMartrix);
            faces += this.meshes[j].faces.length;
        }


        framebuffer.drawText(8, 8, 'FPS: ' + this.fps.toString(), this.texture4);
        framebuffer.drawText(8, 16, 'FACES: ' + faces, this.texture4);
    }

    private computeCameraMovement(elapsedTime: number): void {
        this.modelViewMatrix.setIdentity();
        this.modelViewMatrix.trans(0, 0, -15);

    }

}
