import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Matrix4f } from '../../math/Matrix4f';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { MD2Loader } from './md2/MD2Loader';
import { MD2Model } from './md2/MD2Model';
import { ModelViewMatrix } from './ModelViewMatrix';

/**
 * http://tfc.duke.free.fr/coding/md2-specs-en.html
 * https://github.com/mrdoob/three.js/tree/dev/examples/models/md2/ogro
 * http://tfc.duke.free.fr/old/models/md2.htm
 */

export class MetalHeadzScene extends AbstractScene {

    private static readonly CLEAR_COLOR: number = Color.SLATE_GRAY.toPackedFormat();

    private ogroTexture: Texture;
    private texture4: Texture;
    private md2: MD2Model;
    private startTime: number;

    private modelViewMatrix: ModelViewMatrix = new ModelViewMatrix();

    private fpsStartTime: number = Date.now();
    private fpsCount: number = 0;
    private fps: number = 0;

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.texturedRenderingPipeline.setCullFace(CullFace.FRONT);
        this.startTime = Date.now();
        return Promise.all([
         TextureUtils.load(require('../../assets/md2/texture2.jpg'), false).then(
                (texture: Texture) => this.ogroTexture = texture
            ),
            MD2Loader.load(require('../../assets/md2/drfreak.md2')).then(
                (mesh: MD2Model) => this.md2 = mesh
            ), /*
            TextureUtils.load(require('../../assets/md2/Samourai.jpg'), false).then(
                (texture: Texture) => this.ogroTexture = texture
            ),
            MD2Loader.load(require('../../assets/md2/Samourai.md2')).then(
                (mesh: MD2Model) => this.md2 = mesh
            )
            TextureUtils.load(require('../../assets/md2/dead.png'), false).then(
                (texture: Texture) => this.ogroTexture = texture
            ),
            MD2Loader.load(require('../../assets/md2/ratamahatta.md2')).then(
                (mesh: MD2Model) => this.md2 = mesh
            ),,*/
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

        framebuffer.clearColorBuffer(MetalHeadzScene.CLEAR_COLOR);
        framebuffer.clearDepthBuffer();

        const camera: Matrix4f = this.computeCameraMovement(time * 0.6);

        framebuffer.setTexture(this.ogroTexture);
        framebuffer.texturedRenderingPipeline.draw(this.md2.getMesh(), camera);
        framebuffer.drawText(8,  8, 'FPS: ' + this.fps.toString(), this.texture4);
        framebuffer.drawText(8, 16, 'TRIANGELS: ' + this.md2.header.numberOfTriangles, this.texture4);
    }

    private computeCameraMovement(elapsedTime: number): Matrix4f {
        this.modelViewMatrix.setIdentity();
        this.modelViewMatrix.trans(0, 0, -120 + (Math.sin(elapsedTime * 0.0007) * 0.5 + 0.5) * 87);
        this.modelViewMatrix.yRotate(-elapsedTime * 0.006);
        this.modelViewMatrix.xRotate(Math.PI * 2 / 360 * -90);
        return this.modelViewMatrix.getMatrix();
    }

}
