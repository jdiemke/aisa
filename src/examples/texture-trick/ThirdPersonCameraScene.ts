import { ThirdPersonCamera } from '../../camera/ThirdPersonCamera';
import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { AisaGamepad } from '../../input/AisaGamepad';
import { Matrix4f, Vector3f, Vector4f } from '../../math/index';
import { TexturedMesh } from '../../rendering-pipelines/TexturedMesh';
import { TexturingRenderingPipeline } from '../../rendering-pipelines/TexturingRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { TextureCoordinate } from '../../TextureCoordinate';
import { Keyboard } from '../mode-7/Keyboard';
import { MD2Loader } from '../../model/md2/MD2Loader';
import { MD2Model } from '../../model/md2/MD2Model';
import { ModelViewMatrix } from '../md2/ModelViewMatrix';


/**
 * http://tfc.duke.free.fr/coding/mdl-specs-en.html
 * http://tfc.duke.free.fr/coding/md2-specs-en.html
 * https://github.com/mrdoob/three.js/tree/dev/examples/models/md2/ogro
 * http://tfc.duke.free.fr/old/models/md2.htm
 */
export class ThirdPersonCameraScene extends AbstractScene {

    private static readonly CLEAR_COLOR: number = Color.SLATE_GRAY.toPackedFormat();

    public lastTime: number = Date.now();


    private ground: Texture;


    private modelViewMatrix: ModelViewMatrix = new ModelViewMatrix();

    private floor: TexturedMesh;


    private texturedRenderingPipeline: TexturingRenderingPipeline;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.texturedRenderingPipeline = new TexturingRenderingPipeline(framebuffer);
        this.texturedRenderingPipeline.setCullFace(CullFace.FRONT);

        return Promise.all([
            TextureUtils.load(require('../../assets/starwars.png'), true).then(
                (texture: Texture) => this.ground = texture)
        ]).then(
            () => {


                const mesh: TexturedMesh = new TexturedMesh();
                const size = 40;
                const height = 2;
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


            });
    }

    public render(framebuffer: Framebuffer, time: number): void {


        framebuffer.clearColorBuffer(ThirdPersonCameraScene.CLEAR_COLOR);
        framebuffer.clearDepthBuffer();


        framebuffer.setTexture(this.ground);

        this.texturedRenderingPipeline.setCullFace(CullFace.BACK);

        this.modelViewMatrix.setIdentity();
        this.modelViewMatrix.zRotate(time*0.0003);
        this.modelViewMatrix.xRotate(time*0.0004);
        this.modelViewMatrix.yRotate(time*0.00035);
        const disp = time * 0.0003;
        this.floor.uv = [
            new TextureCoordinate(0, 0+disp),
            new TextureCoordinate(8.0, 0+disp),
            new TextureCoordinate(8.0, 8.0+disp),
            new TextureCoordinate(0, 8.0+disp)
        ];

        this.texturedRenderingPipeline.setModelViewMatrix(this.modelViewMatrix.getMatrix());
        this.texturedRenderingPipeline.draw(framebuffer, this.floor);

        framebuffer.drawFog(new Color(20,20,20,45),0.04, 0.15);
    }

}
