import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { MDLLoader } from '../../model/mdl/MDLLoader';
import { MDLModel } from '../../model/mdl/MDLModel';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { ModelViewMatrix } from './ModelViewMatrix';
import { WavefrontLoader } from '../../model/wavefront-obj/WavefrontLoader';
import { ThirdPersonCamera } from '../../camera/ThirdPersonCamera';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';

/**
 * http://tfc.duke.free.fr/coding/mdl-specs-en.html
 * http://tfc.duke.free.fr/coding/md2-specs-en.html
 * https://github.com/mrdoob/three.js/tree/dev/examples/models/md2/ogro
 * http://tfc.duke.free.fr/old/models/md2.htm
 */
export class Md2ModelScene extends AbstractScene {

    private static readonly CLEAR_COLOR: number = Color.SLATE_GRAY.toPackedFormat();

    private ogroTexture: Texture;
    private texture4: Texture;
    private mdl: MDLModel;
    private startTime: number;

    private modelViewMatrix: ModelViewMatrix = new ModelViewMatrix();

    private fpsStartTime: number = Date.now();
    private fpsCount: number = 0;
    private fps: number = 0;

    private meshes: Array<FlatshadedMesh>;

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.texturedRenderingPipeline.setCullFace(CullFace.FRONT);
        this.startTime = Date.now();
        return Promise.all([
            TextureUtils.load(require('../../assets/md2/texture2.jpg'), false).then(
                (texture: Texture) => this.ogroTexture = texture
            ),
            MDLLoader.load(require('../../assets/mdl/gijoe.mdl')).then(
                (mesh: MDLModel) => this.mdl = mesh
            ),
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

        framebuffer.clearColorBuffer(Md2ModelScene.CLEAR_COLOR);
        framebuffer.clearDepthBuffer();

        this.computeCameraMovement(time * 0.6);

        framebuffer.setTexture(this.ogroTexture);
        framebuffer.renderingPipeline.draw(this.meshes[0], this.modelViewMatrix.getMatrix());

        framebuffer.drawText(8, 8, 'FPS: ' + this.fps.toString(), this.texture4);
        framebuffer.drawText(8, 16, 'FACES: ' + this.meshes[0].faces.length, this.texture4);
    }

    private computeCameraMovement(elapsedTime: number): void {
        this.modelViewMatrix.setIdentity();
        this.modelViewMatrix.trans(0, 0, -5);
        this.modelViewMatrix.yRotate(-elapsedTime * 0.002);
    }

}
