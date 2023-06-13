import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Vector4f } from '../../math/index';
import { TexturedMesh } from '../../rendering-pipelines/TexturedMesh';
import { TexturingRenderingPipeline } from '../../rendering-pipelines/TexturingRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { TextureCoordinate } from '../../TextureCoordinate';
import { ModelViewMatrix } from '../md2/ModelViewMatrix';

export class ThirdPersonCameraScene extends AbstractScene {

    private static readonly CLEAR_COLOR: number = Color.SLATE_GRAY.toPackedFormat();

    private ground: Texture;
    private modelViewMatrix: ModelViewMatrix = new ModelViewMatrix();
    private floor: TexturedMesh;
    private texturedRenderingPipeline: TexturingRenderingPipeline;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.texturedRenderingPipeline = new TexturingRenderingPipeline(framebuffer);

        this.texturedRenderingPipeline.setCullFace(CullFace.BACK);

        return Promise.all([
            TextureUtils.load(require('../../assets/starwars.png'), true).then(
                (texture: Texture) => this.ground = texture)
        ]);
    }

    public onInit(): void {


        const mesh: TexturedMesh = new TexturedMesh();
        const size = 40;
        const height = 3;
        mesh.points = [
            new Vector4f(-size, -height, size),
            new Vector4f(size, -height, size),
            new Vector4f(size, -height, -size),
            new Vector4f(-size, -height, -size),

            new Vector4f(-size, height, size),
            new Vector4f(size, height, size),
            new Vector4f(size, height, -size),
            new Vector4f(-size, height, -size),
        ];
        mesh.uv = [
            new TextureCoordinate(0, 0),
            new TextureCoordinate(4.0, 0),
            new TextureCoordinate(4.0, 4.0),
            new TextureCoordinate(0, 4.0)
        ];
        mesh.points2 = mesh.points.map(() => new Vector4f(0, 0, 0, 0));
        mesh.faces = [
            {
                uv: [0, 1, 2],
                vertices: [0, 1, 2]
            },
            {
                uv: [2, 3, 0],
                vertices: [2, 3, 0]
            },
            {
                uv: [0, 3, 2],
                vertices: [4, 7, 6]
            },
            {
                uv: [2, 1, 0],
                vertices: [6, 5, 4]
            },

        ];
        this.floor = mesh;
    }

    public render(framebuffer: Framebuffer, time: number): void {
        framebuffer.clearColorBuffer(ThirdPersonCameraScene.CLEAR_COLOR);
        framebuffer.clearDepthBuffer();

        this.computeModelViewTransformation(time);
        this.displaceTextureCoordinates(time);

        this.texturedRenderingPipeline.setModelViewMatrix(this.modelViewMatrix.getMatrix());
        framebuffer.setTexture(this.ground);
        this.texturedRenderingPipeline.draw(framebuffer, this.floor);
        framebuffer.drawFog(new Color(20,20,20,45),0.04, 0.15);
    }

    private computeModelViewTransformation(time: number): void {
        this.modelViewMatrix.setIdentity();
        this.modelViewMatrix.rotate(0, 0, 1, time*0.0003);
        this.modelViewMatrix.rotate(1, 0, 0, time*0.0004);
        this.modelViewMatrix.rotate(0, 1, 0, time*0.00035);
        this.modelViewMatrix.translate(0, Math.cos(time * 0.001)*0.5,0);
    }

    private displaceTextureCoordinates(time: number): void {
        const disp = Math.cos(time * 0.0001)*4;
        const dispu = Math.sin(time * 0.0001)*4;
        this.floor.uv = [
            new TextureCoordinate(0+dispu, 0+disp),
            new TextureCoordinate(8.0+dispu, 0+disp),
            new TextureCoordinate(8.0+dispu, 8.0+disp),
            new TextureCoordinate(0+dispu, 8.0+disp)
        ];
    }

}
