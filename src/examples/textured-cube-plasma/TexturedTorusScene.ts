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

        const framebuffer2 = new Framebuffer(128,128);
        this.drawOldSchoolPlasma(framebuffer2, Date.now() * 0.8);
        framebuffer.setTexture(this.texture);
        const tex2 = new Texture(framebuffer2.framebuffer, 128,128);
        tex2.setClamp(true);
        framebuffer.setTexture(tex2);
        this.shadingTorus4(framebuffer, time * 0.004);
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

    public drawOldSchoolPlasma(framebuffer: Framebuffer, elapsedTime: number) {
        const time = elapsedTime * 0.0007 * 1.0;
        const lineDirection = new Vector3f(Math.sin(time), Math.cos(time), 0);
        const radialWaveCenter = new Vector3f(470.0 / 2.0, 230.0 / 2.0, 0).add(new Vector3f(470.0 / 2.0 *
            Math.sin(-time), 230.0 / 2.0 * Math.cos(-time), 0));

        const difference = new Vector3f(0, 0, 0);
        let index = 0;
        for (let y = 0; y < framebuffer.height; y++) {
            for (let x = 0; x < framebuffer.width; x++) {
                const directionalWave = Math.sin(((x * lineDirection.x + y * lineDirection.y) * 0.04 + time) + 1.0) * 0.5;
                difference.x = x - radialWaveCenter.x;
                difference.y = y - radialWaveCenter.y;
                const radialWave = (Math.cos(difference.length() * 0.06) + 1.0) * 0.5;
                const waveSum: number = (radialWave + directionalWave) * 0.5;

                const red = (Math.cos(Math.PI * waveSum / 0.5 + time) + 1.0) * 0.5 * 255;
                const green = (Math.sin(Math.PI * waveSum / 0.5 + time) + 1.0) * 0.5 * 255;
                const blue = (Math.sin(time) + 1.0) * 0.5 * 255;

                framebuffer.framebuffer[index++] = 255 << 24 | blue << 16 | green << 8 | red;
            }
        }
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
