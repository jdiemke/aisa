import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Vector4f, Vector2f, Vector3f, Matrix4f } from '../../math/index';
import { MD2Animation } from '../../model/md2/MD2AnimationNames';
import { TexturedMesh } from '../../rendering-pipelines/TexturedMesh';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { TextureCoordinate } from '../../Vertex';
import { Keyboard } from '../mode-7/Keyboard';
import { MD2Loader } from './../../model/md2/MD2Loader';
import { MD2Model } from './../../model/md2/MD2Model';
import { ModelViewMatrix } from './../md2/ModelViewMatrix';
import { Player } from './Player';
import { ThirdPersonCamera } from '../../camera/ThirdPersonCamera';

/**
 * http://tfc.duke.free.fr/coding/mdl-specs-en.html
 * http://tfc.duke.free.fr/coding/md2-specs-en.html
 * https://github.com/mrdoob/three.js/tree/dev/examples/models/md2/ogro
 * http://tfc.duke.free.fr/old/models/md2.htm
 */
export class Md2ModelScene extends AbstractScene {

    private static readonly CLEAR_COLOR: number = Color.SLATE_GRAY.toPackedFormat();

    public lastTime: number = 0;

    private keyboard: Keyboard = new Keyboard();

    private ogroTexture: Texture;
    private weaponTexture: Texture;
    private texture4: Texture;
    private ground: Texture;
    private md2: MD2Model;
    private weapon: MD2Model;
    private startTime: number;

    private modelViewMatrix: ModelViewMatrix = new ModelViewMatrix();

    private floor: TexturedMesh;

    private fpsStartTime: number = Date.now();
    private fpsCount: number = 0;
    private fps: number = 0;

    private position: Vector2f = new Vector2f(0, 0);
    private player: Player = new Player();

    private camera: ThirdPersonCamera = new ThirdPersonCamera();

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.texturedRenderingPipeline.setCullFace(CullFace.FRONT);
        this.startTime = Date.now();
        return Promise.all([
            TextureUtils.load(require('../../assets/md2/hueteotl.png'), false).then(
                (texture: Texture) => this.ogroTexture = texture
            ),
            TextureUtils.load(require('../../assets/md2/weapon.png'), false).then(
                (texture: Texture) => this.weaponTexture = texture
            ),
            MD2Loader.load(require('../../assets/md2/tris.md2')).then(
                (mesh: MD2Model) => {
                    this.md2 = mesh;
                }
            ),
            MD2Loader.load(require('../../assets/md2/weapon.md2')).then(
                (mesh: MD2Model) => {
                    this.weapon = mesh;
                }
            ),
            TextureUtils.load(require('../../assets/font.png'), true).then(
                (texture: Texture) => this.texture4 = texture),
            ,
            TextureUtils.load(require('../../assets/ground.png'), true).then(
                (texture: Texture) => this.ground = texture),
        ]);
    }

    public onInit(): void {
        const mesh: TexturedMesh = new TexturedMesh();
        mesh.points = [
            new Vector4f(-20, 0, 20),
            new Vector4f(20, 0, 20),
            new Vector4f(20, 0, -20),
            new Vector4f(-20, 0, -20)
        ];
        mesh.uv = [
            new TextureCoordinate(0, 0),
            new TextureCoordinate(1, 0),
            new TextureCoordinate(1, 1),
            new TextureCoordinate(0, 1)
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
            }
        ];
        this.floor = mesh;
    }

    public processInput(deltaTime: number): void {
        const speed: number = 3.1;
        const Angspeed: number = 110.0;
        if (this.keyboard.isDown(Keyboard.UP)) {
            this.player.moveForward(speed, deltaTime);
        }

        if (this.keyboard.isDown(Keyboard.DOWN)) {
            this.player.moveBackward(speed, deltaTime);
        }

        if (this.keyboard.isDown(Keyboard.LEFT)) {
            this.player.turnLeft(Angspeed, deltaTime);
        }

        if (this.keyboard.isDown(Keyboard.RIGHT)) {
            this.player.turnRight(Angspeed, deltaTime);
        }
    }

    public render(framebuffer: Framebuffer): void {

        const currentTime: number = Date.now();
        const delta: number = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        if (currentTime > this.fpsStartTime + 1000) {
            this.fpsStartTime = currentTime;
            this.fps = this.fpsCount;
            this.fpsCount = 0;
        }
        this.fpsCount++;

        const time: number = Date.now() - this.startTime;

        this.processInput(delta);

        framebuffer.clearColorBuffer(Md2ModelScene.CLEAR_COLOR);
        framebuffer.clearDepthBuffer();

        //
        framebuffer.setTexture(this.ground);

        framebuffer.texturedRenderingPipeline.setCullFace(CullFace.BACK);
        this.computeFloorMovement(time * 0.6);
        framebuffer.texturedRenderingPipeline.draw(this.floor, this.modelViewMatrix.getMatrix());

        framebuffer.texturedRenderingPipeline.setCullFace(CullFace.FRONT);

        this.renderPlayer(framebuffer, time);
        const fog: Color = Color.RED;
        framebuffer.drawFog(fog.r, fog.g, fog.b);
        framebuffer.drawText(8, 8, 'FPS: ' + this.fps.toString(), this.texture4);
        framebuffer.drawText(8, 16, 'TRIANGELS: ' +
            (this.md2.header.numberOfTriangles + this.weapon.header.numberOfTriangles), this.texture4);
    }

    private renderPlayer(framebuffer: Framebuffer, time: number): void {
        this.computePlayerMovement(time * 0.6);
        let anim: MD2Animation = MD2Animation.STAND;
        if (this.keyboard.isDown(Keyboard.UP) || this.keyboard.isDown(Keyboard.DOWN)) {
            anim = MD2Animation.RUN;
        }

        framebuffer.setTexture(this.ogroTexture);
        framebuffer.texturedRenderingPipeline.draw(
            this.md2.getMesh2(anim), this.modelViewMatrix.getMatrix()
        );
        framebuffer.setTexture(this.weaponTexture);
        framebuffer.texturedRenderingPipeline.draw(
            this.weapon.getMesh2(anim), this.modelViewMatrix.getMatrix()
        );
    }

    private computeFloorMovement(elapsedTime: number): void {
        this.modelViewMatrix.setIdentity();
        this.modelViewMatrix.multMatrix(this.getCamMatrix());
        this.modelViewMatrix.trans(0, 0, 0);
        this.modelViewMatrix.yRotate(Math.PI * 2 / 360 * 90);
        //  this.modelViewMatrix.xRotate(Math.PI * 2 / 360 * -90);
    }

    private getCamMatrix(): Matrix4f {
        return this.camera.computeMatrix(new Vector3f(
            this.player.position.x,
            3.0,
            this.player.position.y + 4
        ), new Vector3f(this.player.position.x, 1.0, -1 + this.player.position.y), new Vector3f(0, 1, 0));
    }

    private computePlayerMovement(elapsedTime: number): void {
        // http://cubeengine.com/wiki/Importing_md2_and_md3_files
        this.modelViewMatrix.setIdentity();
        this.modelViewMatrix.multMatrix(this.getCamMatrix());
        this.modelViewMatrix.trans(this.player.position.x, 24 * 0.05, this.player.position.y);
        this.modelViewMatrix.yRotate(Math.PI * 2 / 360 * (90 + this.player.angle));
        this.modelViewMatrix.xRotate(Math.PI * 2 / 360 * -90);
        this.modelViewMatrix.scal(0.05, 0.05, 0.05);
    }

}
