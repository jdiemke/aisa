import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Matrix4f } from '../../math';
import { TexturedMesh } from '../../rendering-pipelines/TexturedMesh';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { MD2Loader } from './md2/MD2Loader';
import { Color } from '../../core/Color';
import { MD2Model } from './md2/MD2Model';

/**
 * http://tfc.duke.free.fr/coding/md2-specs-en.html
 * https://github.com/mrdoob/three.js/tree/dev/examples/models/md2/ogro
 * http://tfc.duke.free.fr/old/models/md2.htm
 */

export class MetalHeadzScene extends AbstractScene {

    private ogroTexture: Texture;
    private md2: MD2Model;
    private startTime: number;

    private accumulationBuffer: Uint32Array = new Uint32Array(320 * 200);

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.texturedRenderingPipeline.setCullFace(CullFace.FRONT);
        this.startTime = Date.now();
        return Promise.all([
            TextureUtils.load(require('../../assets/md2/texture2.jpg'), false).then(
                (texture: Texture) => this.ogroTexture = texture
            ),
           /* MD2Loader.load(require('../../assets/md2/ogro.md2')).then(
                (mesh: MD2Model) => this.md2 = mesh
            ),*/
            MD2Loader.load(require('../../assets/md2/drfreak.md2')).then(
                (mesh: MD2Model) => this.md2 = mesh
            )
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now() - this.startTime;

        framebuffer.clearColorBuffer(Color.SLATE_GRAY.toPackedFormat());
        framebuffer.clearDepthBuffer();

        const camera: Matrix4f = this.computeCameraMovement(time * 0.6);
        framebuffer.setTexture(this.ogroTexture);
        // TODO: optimize getMesh()
        framebuffer.texturedRenderingPipeline.draw(this.md2.getMesh(), camera);

        const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
        framebuffer.drawTexture(0, 0, texture3, 0.75);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);
    }

    private computeCameraMovement(elapsedTime: number): Matrix4f {
        return Matrix4f.constructTranslationMatrix(0, 0, -120 + (Math.sin(elapsedTime * 0.0007) * 0.5 + 0.5) * 87)
            .multiplyMatrix(Matrix4f.constructYRotationMatrix(-elapsedTime * 0.006).multiplyMatrix(
                Matrix4f.constructXRotationMatrix(Math.PI * 2 / 360 * -90)
            ));
    }

}
