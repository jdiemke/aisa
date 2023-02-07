import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Matrix4f, Vector3f, Vector4f } from '../../math';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { TextureCoordinate } from '../../TextureCoordinate';
import { TexturingRenderingPipeline } from '../../rendering-pipelines/TexturingRenderingPipeline';
import { TexturedMesh } from '../../rendering-pipelines/TexturedMesh';
import { Color } from '../../core/Color';

export class TexturedTorusScene extends AbstractScene {

    private texture: Texture;
    private blurred: Texture;
    private texturedRenderingPipleine: TexturingRenderingPipeline;
    private cubeMesh: TexturedMesh;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.texturedRenderingPipleine = new TexturingRenderingPipeline(framebuffer);
        this.texturedRenderingPipleine.setCullFace(CullFace.BACK);
        this.texturedRenderingPipleine.setFramebuffer(framebuffer);

        this.cubeMesh = this.computeTexturedCubeMesh();

        return Promise.all([
            TextureUtils.load(require('../../assets/robot2.png'), false).then(texture => this.texture = texture),
            TextureUtils.load(require('../../assets/blurredBackground.png'), false).then(
                (texture: Texture) => this.blurred = texture
            )
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();

        framebuffer.setTexture(this.texture);
        this.shadingTorus4(framebuffer, time * 0.002);
    }

    public shadingTorus4(framebuffer: Framebuffer, elapsedTime: number): void {

        framebuffer.clearDepthBuffer();
        //framebuffer.clearColorBuffer(Color.BLACK.toPackedFormat());
       // framebuffer.fastFramebufferCopy(this.blurred.texture, framebuffer.framebuffer);
        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);

        const scale = 1.3;

        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.5));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.5));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f.constructZRotationMatrix(elapsedTime * 0.5));
        modelViewMartrix = Matrix4f.constructTranslationMatrix(0,0, -4.8+Math.sin(elapsedTime)*2)
            .multiplyMatrix(modelViewMartrix);

        this.texturedRenderingPipleine.setModelViewMatrix(modelViewMartrix);
        this.texturedRenderingPipleine.draw(framebuffer, this.cubeMesh);
    }

    private computeTexturedCubeMesh(): TexturedMesh {
        const points: Array<Vector4f> = [];
        const textCoords: Array<TextureCoordinate> = [];

        points.push(new Vector4f(-0.5, -0.5, +0.5, +1.0)); // 0
        points.push(new Vector4f(+0.5, -0.5, +0.5, +1.0)); // 1
        points.push(new Vector4f(+0.5, +0.5, +0.5, +1.0)); // 2
        points.push(new Vector4f(-0.5, +0.5, +0.5, +1.0)); // 3

        points.push(new Vector4f(-0.5, -0.5, -0.5, +1.0)); // 4
        points.push(new Vector4f(+0.5, -0.5, -0.5, +1.0)); // 5
        points.push(new Vector4f(+0.5, +0.5, -0.5, +1.0)); // 6
        points.push(new Vector4f(-0.5, +0.5, -0.5, +1.0)); // 7

        textCoords.push(new TextureCoordinate(0, 0));
        textCoords.push(new TextureCoordinate(1, 0));
        textCoords.push(new TextureCoordinate(1, 1));
        textCoords.push(new TextureCoordinate(0, 1));

        const faces: Array<{
            vertices: Array<number>;
            uv: Array<number>
        }> = [];

        faces.push({ uv: [0,1,2], vertices: [1, 0, 4] });
        faces.push({ uv: [2,3,0], vertices: [4, 5, 1] });

        faces.push({ uv: [0,1,2], vertices: [3, 2, 6] });
        faces.push({ uv: [2,3,0], vertices: [6, 7, 3] });

        faces.push({ uv: [0,1,2], vertices: [0, 1, 2] });
        faces.push({ uv: [2,3,0], vertices: [2, 3, 0] });

        faces.push({ uv: [0,1,2], vertices: [1, 5, 6] });
        faces.push({ uv: [2,3,0], vertices: [6, 2, 1] });

        faces.push({ uv: [0,1,2], vertices: [5, 4, 7] });
        faces.push({ uv: [2,3,0], vertices: [7, 6, 5] });

        faces.push({ uv: [0,1,2], vertices: [4, 0, 3] });
        faces.push({ uv: [2,3,0], vertices: [3, 7, 4] });

        const torus: TexturedMesh = {
            points,
            points2: points.map(() => new Vector4f(0, 0, 0)),
            uv: textCoords,
            faces
        };

        return torus;
    }

}
