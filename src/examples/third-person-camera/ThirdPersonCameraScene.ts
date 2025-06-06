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
import { Player } from './Player';
import { PlayerStateMachine } from './state-machine/PlayerStateMachine';

/**
 * http://tfc.duke.free.fr/coding/mdl-specs-en.html
 * http://tfc.duke.free.fr/coding/md2-specs-en.html
 * https://github.com/mrdoob/three.js/tree/dev/examples/models/md2/ogro
 * http://tfc.duke.free.fr/old/models/md2.htm
 */
export class ThirdPersonCameraScene extends AbstractScene {

    private static readonly CLEAR_COLOR: number = Color.SLATE_GRAY.toPackedFormat();

    public lastTime: number = Date.now();

    private keyboard: Keyboard = new Keyboard();
    private gamepad: AisaGamepad = new AisaGamepad();

    private ogroTexture: Texture;
    private freakTexture: Texture;
    private weaponTexture: Texture;
    private texture4: Texture;
    private glow: Texture;
    private fontred: Texture;
    private ground: Texture;
    private md2: MD2Model;
    private weapon: MD2Model;
    private startTime: number;
    private md2Freak: MD2Model;

    private modelViewMatrix: ModelViewMatrix = new ModelViewMatrix();

    private floor: TexturedMesh;
    private shadow: TexturedMesh;

    private fpsStartTime: number = Date.now();
    private fpsCount: number = 0;
    private fps: number = 0;

    private player: Player = new Player();

    private camera: ThirdPersonCamera = new ThirdPersonCamera();

    private oldEye: Vector3f = new Vector3f(0, 0, 0);
    private attack: boolean = false;
    private jump: boolean = false;
    private run: boolean = false;

    private playerStateMachine: PlayerStateMachine;
    private texturedRenderingPipeline: TexturingRenderingPipeline;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.texturedRenderingPipeline = new TexturingRenderingPipeline(framebuffer);
        this.texturedRenderingPipeline.setCullFace(CullFace.FRONT);
        this.startTime = Date.now();
        return Promise.all([
            TextureUtils.load(require('@assets/md2/hueteotl.png'), false).then(
                (texture: Texture) => this.ogroTexture = texture),
            TextureUtils.load(require('@assets/md2/weapon.png'), false).then(
                (texture: Texture) => this.weaponTexture = texture),
            MD2Loader.load(require('@assets/md2/tris.md2')).then(
                (mesh: MD2Model) => this.md2 = mesh),
            MD2Loader.load(require('@assets/md2/weapon.md2')).then(
                (mesh: MD2Model) => this.weapon = mesh),
            TextureUtils.load(require('@assets/fonts/font.png'), true).then(
                (texture: Texture) => this.texture4 = texture),
            TextureUtils.load(require('@assets/fonts/fontred.png'), true).then(
                (texture: Texture) => this.fontred = texture),
            TextureUtils.load(require('@assets/ground.png'), true).then(
                (texture: Texture) => this.ground = texture),
            TextureUtils.load(require('@assets/glow.png'), true).then(
                (texture: Texture) => this.glow = texture),
                TextureUtils.load(require('@assets/md2/texture2.jpg'), false).then(
                    (texture: Texture) => this.freakTexture = texture
                ),
                MD2Loader.load(require('@assets/md2/drfreak.md2')).then(
                    (mesh: MD2Model) => this.md2Freak = mesh
                )
        ]).then(
            () => {
                this.playerStateMachine = new PlayerStateMachine([this.md2, this.weapon], this.player);
                window.addEventListener('gamepadconnected', (e: GamepadEvent) => {
                    console.log('Gamepad connected at index %d: %s. %d buttons, %d axes.',
                        e.gamepad.index, e.gamepad.id,
                        e.gamepad.buttons.length, e.gamepad.axes.length);
                });

                const mesh: TexturedMesh = new TexturedMesh();
                mesh.points = [
                    new Vector4f(-20, 0, 20),
                    new Vector4f(20, 0, 20),
                    new Vector4f(20, 0, -20),
                    new Vector4f(-20, 0, -20)
                ];
                mesh.uv = [
                    new TextureCoordinate(0, 0),
                    new TextureCoordinate(2.0, 0),
                    new TextureCoordinate(2.0, 2.0),
                    new TextureCoordinate(0, 2.0)
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

                const mesh2: TexturedMesh = new TexturedMesh();
                mesh2.points = mesh.points;
                mesh2.points2 = mesh.points2;
                mesh2.faces = mesh.faces;
                mesh2.uv =[
                    new TextureCoordinate(0, 0),
                    new TextureCoordinate(1, 0),
                    new TextureCoordinate(1, 1),
                    new TextureCoordinate(0, 1)
                ];
                this.shadow = mesh2;
            });
    }

    public processInput(deltaTime: number): void {

        if (this.keyboard.isDown(Keyboard.UP)) {
            this.playerStateMachine.upButton();
        }

        if (!this.keyboard.isDown(Keyboard.UP)) {
            this.playerStateMachine.upButtonNot();
        }


        const speed: number = 4.1;
        const Angspeed: number = 110.0;

        if (this.keyboard.isDown(Keyboard.UP) || this.gamepad.isLeft(1, -1)) {
            this.player.moveForward(speed, deltaTime);
        }

        if (this.gamepad.isLeft(1, -1) && !this.run) {
            // this.md2.setAnim( MD2Animation.RUN, Date.now(), true);
            //  this.weapon.setAnim( MD2Animation.RUN, Date.now(), true);
            this.run = true;
        }

        if (!this.gamepad.isLeft(1, -1) && this.run) {
            //   this.md2.setAnim( MD2Animation.STAND, Date.now(), true);
            //  this.weapon.setAnim( MD2Animation.STAND, Date.now(), true);
            this.run = false;
        }

        if (this.keyboard.isDown(Keyboard.DOWN) || this.gamepad.isLeft(1, 1)) {
            this.player.moveBackward(speed, deltaTime);
        }

        if (this.keyboard.isDown(Keyboard.LEFT) || this.gamepad.isLeft(0, -1)) {
            this.player.turnLeft(Angspeed, deltaTime);
        }

        if (this.keyboard.isDown(Keyboard.RIGHT) || this.gamepad.isLeft(0, 1)) {
            this.player.turnRight(Angspeed, deltaTime);
        }

        if (this.gamepad.isButtonPressed(3) && !this.attack) {
            // this.md2.setAnim( MD2Animation.ATTACK, Date.now());
            // this.weapon.setAnim( MD2Animation.ATTACK, Date.now());
            this.attack = true;
        }

        if (!this.gamepad.isButtonPressed(3) && this.attack) {
            this.attack = false;
        }

        if (this.gamepad.isButtonPressed(2) && !this.jump) {
            //     this.md2.setAnim( MD2Animation.JUMP, Date.now());
            //   this.weapon.setAnim( MD2Animation.JUMP, Date.now());
            this.jump = true;
        }

        if (!this.gamepad.isButtonPressed(2) && this.jump) {
            this.jump = false;
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

        this.processInput(delta);

        framebuffer.clearColorBuffer(ThirdPersonCameraScene.CLEAR_COLOR);
        framebuffer.clearDepthBuffer();

        //
        framebuffer.setTexture(this.ground);

        this.texturedRenderingPipeline.setCullFace(CullFace.BACK);
        this.computeFloorMovement(delta);
        this.texturedRenderingPipeline.setModelViewMatrix(this.modelViewMatrix.getMatrix());
        this.texturedRenderingPipeline.draw(framebuffer, this.floor);




        this.modelViewMatrix.translate(0, 0.1, 0);

        this.computeGlowMovement(delta);
        framebuffer.setTexture(this.glow);

        this.texturedRenderingPipeline.enableAlphaBlending();
        this.texturedRenderingPipeline.setModelViewMatrix(this.modelViewMatrix.getMatrix());
        this.texturedRenderingPipeline.draw(framebuffer, this.shadow);
        this.texturedRenderingPipeline.disableAlphaBlending();

        this.texturedRenderingPipeline.setCullFace(CullFace.FRONT);

        this.renderPlayer(framebuffer, delta);

        this.modelViewMatrix.setIdentity();
        this.modelViewMatrix.multMatrix(this.getCamMatrix(delta));
        this.modelViewMatrix.translate(0, 24 * 0.05, 0);
        this.modelViewMatrix.yRotate(Math.PI * 2 / 360 * (90 + 0));
        this.modelViewMatrix.xRotate(Math.PI * 2 / 360 * -90);
        this.modelViewMatrix.scal(0.05, 0.05, 0.05);

        framebuffer.setTexture(this.freakTexture);
        this.texturedRenderingPipeline.setModelViewMatrix(this.modelViewMatrix.getMatrix());
      this.texturedRenderingPipeline.draw(framebuffer, this.md2Freak.getMesh(currentTime));
        framebuffer.drawText(8, 8, 'FPS: ' + this.fps.toString(), this.texture4);
        framebuffer.drawText(8, 16, 'TRIANGELS: ' +
            (this.md2.header.numberOfTriangles + this.weapon.header.numberOfTriangles), this.texture4);
        if ((currentTime % 1000) > 500) {
            framebuffer.drawText(8, 200 - 16,
                this.gamepad.isAvailable() ? 'GAMEPAD DETECTED' : 'NO GAMEPAD DETECTED', this.fontred);
        }
    }

    private renderPlayer(framebuffer: Framebuffer, time: number): void {
        this.computePlayerMovement(time);

        this.texturedRenderingPipeline.setModelViewMatrix(this.modelViewMatrix.getMatrix());

        framebuffer.setTexture(this.ogroTexture);
        this.texturedRenderingPipeline.draw(framebuffer, this.md2.getMesh2(time * 1000));

        framebuffer.setTexture(this.weaponTexture);
        this.texturedRenderingPipeline.draw(framebuffer, this.weapon.getMesh2(time * 1000));
    }

    private computeFloorMovement(elapsedTime: number): void {
        this.modelViewMatrix.setIdentity();
        this.modelViewMatrix.multMatrix(this.getCamMatrix(elapsedTime));
        this.modelViewMatrix.translate(0, 0, 0);
        this.modelViewMatrix.yRotate(Math.PI * 2 / 360 * 90);
        //  this.modelViewMatrix.xRotate(Math.PI * 2 / 360 * -90);
    }
    private getCamMatrix(delta: number): Matrix4f {
        const dampFactor: number = 0.01 * 60 * delta;
        const eyePos: Vector3f = this.oldEye.add(
            new Vector3f(
                this.player.position.x - this.player.getDirection().x * 5,
                2.2, this.player.position.y - this.player.getDirection().y * 5
            ).sub(this.oldEye).mul(dampFactor));
        this.oldEye = eyePos;

        return this.camera.computeMatrix(eyePos, new Vector3f(
            this.player.position.x,
            1.8,
            this.player.position.y), new Vector3f(0, 1, 0));
    }

    private computePlayerMovement(elapsedTime: number): void {
        // http://cubeengine.com/wiki/Importing_md2_and_md3_files
        this.modelViewMatrix.setIdentity();
        this.modelViewMatrix.multMatrix(this.getCamMatrix(elapsedTime));
        this.modelViewMatrix.translate(this.player.position.x, 24 * 0.05, this.player.position.y);
        this.modelViewMatrix.yRotate(Math.PI * 2 / 360 * (90 + this.player.angle));
        this.modelViewMatrix.xRotate(Math.PI * 2 / 360 * -90);
        this.modelViewMatrix.scal(0.05, 0.05, 0.05);
    }

    private computeGlowMovement(delta: number): void {
        // http://cubeengine.com/wiki/Importing_md2_and_md3_files
        this.modelViewMatrix.setIdentity();
        this.modelViewMatrix.multMatrix(this.getCamMatrix(delta));
        this.modelViewMatrix.translate(this.player.position.x, 0.03, this.player.position.y);
        const scale: number = 0.85;
        this.modelViewMatrix.scal(0.06 * scale, 0.06 * scale, 0.06 * scale);
        this.texturedRenderingPipeline.setAlpha(0.70);
    }

}
