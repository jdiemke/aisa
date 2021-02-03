import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Matrix4f } from '../../math';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { BlenderLoader } from '../../model/blender/BlenderLoader';
import { TexturedMesh } from '../../rendering-pipelines/TexturedMesh';

/**
 * TODO: extract lens into effect class
 */
export class PlatonianScene extends AbstractScene {

    private blurred: Texture;
    private platonian: Texture;
    private noise: Texture;
    private platonianMesh: any;
    private accumulationBuffer: Uint32Array;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.accumulationBuffer = new Uint32Array(framebuffer.width * framebuffer.height);
        framebuffer.setCullFace(CullFace.BACK);

        return Promise.all([
            BlenderLoader.loadWithTexture(require('../../assets/jsx/platonian_backed.jsx')).then(
                (mesh: Array<TexturedMesh>) => this.platonianMesh = mesh
            ),
            TextureUtils.load(require('../../assets/blurredBackground.png'), false).then(
                (texture: Texture) => this.blurred = texture
            ),
            TextureUtils.load(require('../../assets/platonian_baked.png'), false).then(
                (texture: Texture) => this.platonian = texture
            ),
            TextureUtils.generateProceduralNoise().then(
                (texture: Texture) => this.noise = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        framebuffer.setCullFace(CullFace.BACK);

        // framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);
        framebuffer.drawScaledTextureClipBi(0,0,framebuffer.width, framebuffer.height, this.blurred, 1.0);

        this.drawBlenderScene8(framebuffer, time);

        const texture3: Texture = new Texture(this.accumulationBuffer, framebuffer.width, framebuffer.height);
        framebuffer.drawTexture(0, 0, texture3, 0.75);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);
        framebuffer.noise(time, this.noise);
    }

    public drawBlenderScene8(framebuffer: Framebuffer, elapsedTime: number): void {
        framebuffer.clearDepthBuffer();

        const camera: Matrix4f =
            Matrix4f.constructTranslationMatrix(0, 0, -64 + (Math.sin(elapsedTime * 0.00007) * 0.5 + 0.5) * 17)
                .multiplyMatrix(
                    Matrix4f.constructXRotationMatrix(elapsedTime * 0.00035).multiplyMatrix(
                        Matrix4f.constructYRotationMatrix(-elapsedTime * 0.0003)));

        const mv: Matrix4f = camera.multiplyMatrix(Matrix4f.constructScaleMatrix(13, 13, 13));

        framebuffer.setTexture(this.platonian);
        framebuffer.texturedRenderingPipeline.setModelViewMatrix(mv);
        framebuffer.texturedRenderingPipeline.drawMeshArray(framebuffer, this.platonianMesh);
    }

}
