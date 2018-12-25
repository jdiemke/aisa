import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Matrix4f } from '../../math';
import { TexturedMesh } from '../../rendering-pipelines/TexturedMesh';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { MD2Loader } from './md2/MD2Loader';
import { Color } from '../../core/Color';

/**
 * http://tfc.duke.free.fr/coding/md2-specs-en.html
 * https://github.com/mrdoob/three.js/tree/dev/examples/models/md2/ogro
 * http://tfc.duke.free.fr/old/models/md2.htm
 */

export class MetalHeadzScene extends AbstractScene {

    private metalheadz: Texture;
    private md2: TexturedMesh;
    private startTime: number;

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.texturedRenderingPipeline.setCullFace(CullFace.FRONT);
        this.startTime = Date.now();
        return Promise.all([
            TextureUtils.load(require('../../assets/md2/texture.png'), false).then(
                (texture: Texture) => this.metalheadz = texture
            ),
            MD2Loader.load(require('../../assets/md2/ogro.md2')).then(
                (mesh: TexturedMesh) => this.md2 = mesh
            )
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now() - this.startTime;

        framebuffer.clearColorBuffer(Color.SLATE_GRAY.toPackedFormat());
        framebuffer.clearDepthBuffer();

        const camera: Matrix4f = this.computeCameraMovement(time * 0.6);
        framebuffer.setTexture(this.metalheadz);
        framebuffer.texturedRenderingPipeline.draw(this.md2, camera);
    }

    private computeCameraMovement(elapsedTime: number): Matrix4f {
        return Matrix4f.constructTranslationMatrix(0, 0, -80 + (Math.sin(elapsedTime * 0.0007) * 0.5 + 0.5) * 67)
            .multiplyMatrix(
                Matrix4f.constructXRotationMatrix(elapsedTime * 0.0008).multiplyMatrix(
                    Matrix4f.constructYRotationMatrix(-elapsedTime * 0.0009).multiplyMatrix(
                        Matrix4f.constructTranslationMatrix(0, 0, 0)
                    )
                )
            );
    }

}
