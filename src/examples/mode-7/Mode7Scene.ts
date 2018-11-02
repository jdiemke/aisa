import { Framebuffer } from '../../Framebuffer';
import { Vector3f } from '../../math/index';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture/index';
import { Keyboard } from './Keyboard';
import { KartAnimator } from './KartAnimator';

/**
 * TODO:
 * - optimize rendering scene
 * - draw sorted sprites
 * - add enemies following splines
 * - add collision
 * - add control keyboard and touch
 *
 * - physics:
 *      - http://rmgi.blog./pygame-2d-car-tutorial.html
 *      - http://engineeringdotnet.blogspot.com/2010/04/simple-2d-car-physics-in-games.html
 *      - https://github.com/leonardo-ono/Java2DRacingPhysicsTest
 *      - https://www.gamedev.net/articles/programming/math-and-physics/2d-car-physics-r2443/
 *
 * - maps
 *      - http://www.mariouniverse.com/maps-snes-smk/
 */
export class Mode7Scene extends AbstractScene {

    private map: Texture;
    private back: Texture;
    private mario: Texture;
    private grass: Texture;
    private pipe: Texture; private metrics: Texture;
    private kartPosition: Vector3f = new Vector3f(273.79803081006753, 2565.460311653938 - 1024, 0);
    private pipePositions: Array<Vector3f>;
    private angle: number = 270;
    private startTime: number = Date.now();
    private keyboard: Keyboard = new Keyboard();
    private pipeTextures: Array<Texture> = new Array<Texture>();
    private marioTextures: Array<Texture> = new Array<Texture>();
    private npc: Vector3f = new Vector3f(0, 0, 0);

    private npcTrack: Array<Vector3f> = [
        new Vector3f(920, 580, 0),
        new Vector3f(940, 476, 0),
        new Vector3f(922, 415, 0),
        new Vector3f(850, 370, 0),
        new Vector3f(766, 323, 0),
        new Vector3f(684, 277, 0),
        new Vector3f(615, 250, 0),
        new Vector3f(524, 209, 0),
        new Vector3f(449, 165, 0),
        new Vector3f(371, 123, 0),
        new Vector3f(295, 91, 0),
        new Vector3f(229, 70, 0),
        new Vector3f(165, 68, 0),
        new Vector3f(119, 89, 0),
        new Vector3f(85, 133, 0),
        new Vector3f(64, 190, 0),
        new Vector3f(56, 247, 0),
        new Vector3f(72, 293, 0),
        new Vector3f(87, 348, 0),
        new Vector3f(81, 408, 0),
        new Vector3f(71, 477, 0),
        new Vector3f(64, 572, 0),
        new Vector3f(67, 637, 0),
        new Vector3f(78, 718, 0),
        new Vector3f(134, 750, 0),
        new Vector3f(226, 727, 0),
        new Vector3f(286, 669, 0),
        new Vector3f(344, 629, 0),
        new Vector3f(447, 586, 0),
        new Vector3f(535, 588, 0),
        new Vector3f(583, 645, 0),
        new Vector3f(612, 712, 0),
        new Vector3f(641, 786, 0),
        new Vector3f(681, 849, 0),
        new Vector3f(744, 895, 0),
        new Vector3f(820, 912, 0),
        new Vector3f(880, 915, 0),
        new Vector3f(930, 880, 0),
        new Vector3f(955, 804, 0),
        new Vector3f(944, 717, 0),
        new Vector3f(921, 643, 0)
    ];

    private animator: KartAnimator = new KartAnimator();
    public init(framebuffer: Framebuffer): Promise<any> {
        this.animator.setKeyFrames(this.npcTrack);
        this.pipePositions = new Array<Vector3f>();
        for (let i: number = 0; i < 100; i++) {
            this.pipePositions.push(
                new Vector3f(Math.random() * 1024, Math.random() * 1024, 0)
            );
        }

        return Promise.all([
            TextureUtils.load(require('./assets/map.png'), false).then(
                (texture: Texture) => this.map = texture
            ),
            TextureUtils.load(require('./assets/background.png'), false).then(
                (texture: Texture) => this.back = texture
            ),
            TextureUtils.load(require('./assets/grass.png'), false).then(
                (texture: Texture) => this.grass = texture
            ),
            TextureUtils.load(require('./assets/mario.png'), true).then(
                (texture: Texture) => this.mario = texture
            ),
            TextureUtils.load(require('./assets/pipe.png'), true).then(
                (texture: Texture) => this.pipe = texture
            ),
            TextureUtils.load(require('./assets/sprites/pipe01.png'), true).then(
                (texture: Texture) => this.pipeTextures[0] = texture
            ),
            TextureUtils.load(require('./assets/sprites/pipe02.png'), true).then(
                (texture: Texture) => this.pipeTextures[1] = texture
            ),
            TextureUtils.load(require('./assets/sprites/pipe03.png'), true).then(
                (texture: Texture) => this.pipeTextures[2] = texture
            ),
            TextureUtils.load(require('./assets/sprites/pipe04.png'), true).then(
                (texture: Texture) => this.pipeTextures[3] = texture
            ),
            TextureUtils.load(require('./assets/sprites/pipe05.png'), true).then(
                (texture: Texture) => this.pipeTextures[4] = texture
            ),
            TextureUtils.load(require('./assets/sprites/pipe06.png'), true).then(
                (texture: Texture) => this.pipeTextures[5] = texture
            ),
            TextureUtils.load(require('./assets/sprites/pipe07.png'), true).then(
                (texture: Texture) => this.pipeTextures[6] = texture
            ),
            TextureUtils.load(require('./assets/sprites/pipe08.png'), true).then(
                (texture: Texture) => this.pipeTextures[7] = texture
            ),
            TextureUtils.load(require('./assets/sprites/pipe09.png'), true).then(
                (texture: Texture) => this.pipeTextures[8] = texture
            ),
            TextureUtils.load(require('./assets/sprites/pipe10.png'), true).then(
                (texture: Texture) => this.pipeTextures[9] = texture
            ),
            TextureUtils.load(require('./assets/sprites/pipe11.png'), true).then(
                (texture: Texture) => this.pipeTextures[10] = texture
            ),
            TextureUtils.load(require('./assets/sprites/pipe12.png'), true).then(
                (texture: Texture) => this.pipeTextures[11] = texture
            ),
            TextureUtils.load(require('./assets/sprites/mario01.png'), true).then(
                (texture: Texture) => this.marioTextures[0] = texture
            ),
            TextureUtils.load(require('./assets/sprites/mario02.png'), true).then(
                (texture: Texture) => this.marioTextures[1] = texture
            ),
            TextureUtils.load(require('./assets/sprites/mario03.png'), true).then(
                (texture: Texture) => this.marioTextures[2] = texture
            ),
            TextureUtils.load(require('./assets/sprites/mario04.png'), true).then(
                (texture: Texture) => this.marioTextures[3] = texture
            ),
            TextureUtils.load(require('./assets/sprites/mario05.png'), true).then(
                (texture: Texture) => this.marioTextures[4] = texture
            ),
            TextureUtils.load(require('./assets/sprites/mario06.png'), true).then(
                (texture: Texture) => this.marioTextures[5] = texture
            ),
            TextureUtils.load(require('./assets/sprites/mario07.png'), true).then(
                (texture: Texture) => this.marioTextures[6] = texture
            ),
            TextureUtils.load(require('./assets/sprites/mario08.png'), true).then(
                (texture: Texture) => this.marioTextures[7] = texture
            ),
            TextureUtils.load(require('./assets/sprites/mario09.png'), true).then(
                (texture: Texture) => this.marioTextures[8] = texture
            ),
            TextureUtils.load(require('./assets/sprites/mario10.png'), true).then(
                (texture: Texture) => this.marioTextures[9] = texture
            ),
            TextureUtils.load(require('./assets/sprites/mario11.png'), true).then(
                (texture: Texture) => this.marioTextures[10] = texture
            ),
            TextureUtils.load(require('./assets/sprites/mario12.png'), true).then(
                (texture: Texture) => this.marioTextures[11] = texture
            ),
            TextureUtils.load(require('./assets/sprites/mario13.png'), true).then(
                (texture: Texture) => this.marioTextures[12] = texture
            ),
            TextureUtils.load(require('./assets/sprites/mario14.png'), true).then(
                (texture: Texture) => this.marioTextures[13] = texture
            ),
            TextureUtils.load(require('./assets/sprites/mario15.png'), true).then(
                (texture: Texture) => this.marioTextures[14] = texture
            ),
            TextureUtils.load(require('./assets/sprites/mario16.png'), true).then(
                (texture: Texture) => this.marioTextures[15] = texture
            ),
            TextureUtils.load(require('./assets/sprites/mario17.png'), true).then(
                (texture: Texture) => this.marioTextures[16] = texture
            ),
            TextureUtils.load(require('./assets/sprites/mario18.png'), true).then(
                (texture: Texture) => this.marioTextures[17] = texture
            ),
            TextureUtils.load(require('./assets/sprites/mario19.png'), true).then(
                (texture: Texture) => this.marioTextures[18] = texture
            ),
            TextureUtils.load(require('./assets/sprites/mario20.png'), true).then(
                (texture: Texture) => this.marioTextures[19] = texture
            ),
            TextureUtils.load(require('./assets/sprites/mario21.png'), true).then(
                (texture: Texture) => this.marioTextures[20] = texture
            ),
            TextureUtils.load(require('./assets/sprites/mario22.png'), true).then(
                (texture: Texture) => this.marioTextures[21] = texture
            ),
            TextureUtils.load(require('./assets/sprites/metrics.png'), true).then(
                (texture: Texture) => this.metrics = texture
            )
        ]);
    }

    private angleVel: number = 0;
    private velocity: Vector3f = new Vector3f(0, 0, 0);
    private acceleration: number = 0;

    private track: Array<Vector3f> = new Array<Vector3f>();
    private notPushed: boolean = true;
    private handleInput(): void {

        if (this.keyboard.isDown(82) && this.notPushed) {
            this.track.push(this.kartPosition.mul(0.3));
            this.notPushed = false;
            console.warn(JSON.stringify(this.track));
        }

        if (!this.keyboard.isDown(82)) {
            this.notPushed = true;
        }

        if (this.keyboard.isDown(76)) {
            this.acceleration = 0.57;
        }
        /*
        if (this.keyboard.isDown(68)) {
            this.kartPosition.x -= Math.cos(2 * Math.PI / 360 * this.angle) * 7;
            this.kartPosition.y -= Math.sin(2 * Math.PI / 360 * this.angle) * 7;
        }*/
        if (this.keyboard.isDown(65)) {
            this.angleVel = Math.max(-1.0, this.angleVel - 0.2);
        } else
            if (this.keyboard.isDown(68)) {
                this.angleVel = Math.min(1.0, this.angleVel + 0.2);
            } else {
                this.angleVel = 0;
            }

        this.angle = this.angle + this.angleVel;

        this.velocity.x += Math.cos(2 * Math.PI / 360 * this.angle) * this.acceleration;
        this.velocity.y += Math.sin(2 * Math.PI / 360 * this.angle) * this.acceleration;
        if (this.velocity.length() > 7.4) {
            this.velocity = this.velocity.mul(1 / this.velocity.length() * 7.4);
        }

        this.kartPosition = this.kartPosition.add(this.velocity);

        this.velocity = this.velocity.mul(0.95);
        this.acceleration = this.acceleration * 0.99;
        if (this.velocity.length() < 0.5) {
            this.velocity = this.velocity.mul(0);
        }

    }

    public render(framebuffer: Framebuffer): void {
        // TODO: optimize
        // * moving constants outside of loop
        // * use DDA for scanlines
        // * dont use put pixel but use linear offset and increment each pixel!
        // https://www.gamedev.net/forums/topic/51626-making-mario-kart-type-of-gameswhats-involved/
        // https://www.coranac.com/tonc/text/mode7.htm

        this.handleInput();

        const time: number = Date.now() * 0.06;

        const screenDistance: number = 160;
        const cameraHeight: number = 80;
        const horizonHeight: number = 20;
        const cameraDistance: number = 153.4;

        for (let y: number = 21; y < 200; y++) {
            for (let x: number = 0; x < 320; x++) {
                const distance: number = screenDistance * cameraHeight / (y - horizonHeight);

                const step: number = distance / screenDistance;

                const scannlineCenterX: number = Math.cos(2 * Math.PI / 360 * this.angle) *
                    distance + this.kartPosition.x - Math.cos(2 * Math.PI / 360 * this.angle) * cameraDistance;
                const scannlineCenterY: number = Math.sin(2 * Math.PI / 360 * this.angle) *
                    distance + this.kartPosition.y - Math.sin(2 * Math.PI / 360 * this.angle) * cameraDistance;

                const xStep: number = -Math.sin(2 * Math.PI / 360 * this.angle) * step;
                const yStep: number = Math.cos(2 * Math.PI / 360 * this.angle) * step;

                let xSampl: number = scannlineCenterX - (320 / 2 * xStep) + x * xStep;
                let ySampl: number = scannlineCenterY - (320 / 2 * yStep) + x * yStep;
                xSampl *= 0.3;
                ySampl *= 0.3;
                let texel: number;

                if (xSampl >= 0 && xSampl <= 1023 && ySampl >= 0 && ySampl <= 1023) {
                    texel = this.map.getPixel2(
                        this.map,
                        Math.round(xSampl) % 1024,
                        Math.round(ySampl) % 1024);
                } else {
                    texel = this.grass.getPixel2(
                        this.grass,
                        ((Math.round(xSampl) % 8) + 8) % 8,
                        (7 - (((Math.round(ySampl) % 8) + 8) % 8))
                    );
                }
                framebuffer.drawPixel(x, y, texel);
            }
        }

        // TODO: optimize
        for (let x = 0; x < 320; x++) {
            for (let y = 0; y < this.back.height; y++) {
                framebuffer.drawPixel(x, y, this.back.getPixel2(this.back, ((Math.floor(x + this.angle * 2) % this.back.width) + this.back.width) % this.back.width, y));
            }
        }

        framebuffer.drawTexture(320 - this.metrics.width - 16, 2, this.metrics, 1.0);

        /* framebuffer.drawTexture(320 / 2 - 16, 200 - 32 - 32 * 3
             + Math.floor(1 * Math.sin((time - this.startTime))),
             this.mario, 1.0);
        */
        // draw kart and enemies

        // project by scalar product lateron
        // only project for other players and use original size for own player
        // HINT: real mario cart does not scale sprites but uses different versions for different sizes
        const yPos: number = cameraHeight * screenDistance / cameraDistance;
        const marioHeight: number = 32;
        const projectionHeightScale: number = 1;// yPos / cameraHeight;
        let marioTex: Texture;
        if (this.keyboard.isDown(68)) {
            marioTex = this.marioTextures[1];
        } else if (this.keyboard.isDown(65)) {
            marioTex = this.marioTextures[this.marioTextures.length-1];
        } else {
            marioTex = this.marioTextures[0];
        }
        framebuffer.scaleClipBlitter.drawScaledTextureClip(
            Math.round(320 / 2 - (marioHeight * projectionHeightScale) / 2),
            Math.round(horizonHeight + yPos) - Math.round(marioHeight * projectionHeightScale),
            Math.round(marioHeight * projectionHeightScale),
            Math.round(marioHeight * projectionHeightScale), marioTex, 1.0);


        // draw pipes
        let sortedPipes: Array<Vector3f> = new Array<Vector3f>();

        const camPos: Vector3f = new Vector3f(
            this.kartPosition.x - Math.cos(2 * Math.PI / 360 * this.angle) * cameraDistance,
            this.kartPosition.y - Math.sin(2 * Math.PI / 360 * this.angle) * cameraDistance, 0);

        const camDir: Vector3f = new Vector3f(
            Math.cos(2 * Math.PI / 360 * this.angle),
            Math.sin(2 * Math.PI / 360 * this.angle), 0);

        const camDirX: Vector3f = new Vector3f(
            -Math.sin(2 * Math.PI / 360 * this.angle),
            Math.cos(2 * Math.PI / 360 * this.angle), 0);


        const tim = Date.now() - this.startTime;
        this.npc = this.animator.getPos(tim);
        this.npc = this.npc.mul(1 / 0.3); // scaling is important to fit cam pos
        const npcDir = this.animator.getPos(tim + 10).mul(1 / 0.3).sub(this.npc).normalize();

        //
        // https://www.gamedev.net/forums/topic/679371-3d-8-directional-sprite-rotation-based-on-facing-direction-relative-to-camera-direction/
        //https://stackoverflow.com/questions/22623013/doom-like-angle-based-sprite-changing
        const objVec: Vector3f = this.npc.sub(camPos);
        const cameraAngle: number = ((this.angle % 360) + 360) % 360;
        const objectAngle: number = (((Date.now() * 0.002) % 360) + 360) % 360;
        let spIndex = -Math.atan2(objVec.y, objVec.x) + Math.atan2(npcDir.y, npcDir.x);
        // let spIndex = -Math.atan2(camDir.y, camDir.x) + Math.atan2(npcDir.y, npcDir.x);
        spIndex = (((spIndex / (Math.PI * 2) * 360) % 360) + 360) % 360;
        //console.warn('index:', spIndex);


        this.npc.z = this.npc.sub(camPos).dot(camDir);
        if (this.npc.z > 0) {
            const pipeDistX: number = this.npc.sub(camPos).dot(camDirX);

            let tex: Texture = this.marioTextures[Math.floor(spIndex / 360 * this.marioTextures.length) % this.marioTextures.length];
            const pipeH: number = tex.height;
            const pipeW: number = tex.width;
            const projectionHeightScale2: number = screenDistance / this.npc.z;
            const yPos2: number = cameraHeight * projectionHeightScale2;
            framebuffer.scaleClipBlitter.drawScaledTextureClip(
                Math.round(320 / 2 + pipeDistX * projectionHeightScale2 - (pipeW * projectionHeightScale2) / 2),
                Math.round(horizonHeight + yPos2) - Math.round(pipeH * projectionHeightScale2),
                Math.round(pipeW * projectionHeightScale2),
                Math.round(pipeH * projectionHeightScale2), tex, 1.0);
        }
        for (let i: number = 0; i < 100; i++) {
            const pipe: Vector3f = this.pipePositions[i].mul(1 / 0.3);

            const pipeDist: number = pipe.sub(camPos).dot(camDir);
            pipe.z = pipeDist;
            sortedPipes.push(pipe);

        }

        sortedPipes.sort((a: Vector3f, b: Vector3f) => b.z - a.z);

        // TODO: create sprite object with z for all sprites and sort them.


        for (let i: number = 0; i < 100; i++) {
            const pipe: Vector3f = sortedPipes[i];
            let pipeDist: number = pipe.z;
            if (pipeDist > 0) {
                const pipeDistX: number = pipe.sub(camPos).dot(camDirX);

                const projectionHeightScale: number = screenDistance / pipeDist;
                //  if (projectionHeightScale * 32 < 3) continue;
                const yPos: number = cameraHeight * projectionHeightScale;

                /*
                const myHeight = projectionHeightScale * this.pipeTextures[0].height;
                if (myHeight < this.pipeTextures[this.pipeTextures.length-1].height) {
                    continue;
                }*/
                let tex: Texture;
                /*
                for (let i = 0; i < this.pipeTextures.length; i++) {
                    if (this.pipeTextures[this.pipeTextures.length-1 - i].height < myHeight) {
                        tex = this.pipeTextures[this.pipeTextures.length-1 - i];
                    }
                }*/
                tex = this.pipe;
                const pipeH: number = tex.height;
                const pipeW: number = tex.width;
                /*
                framebuffer.scaleClipBlitter.drawScaledTextureClip(
                    Math.round(320 / 2 + pipeDistX * projectionHeightScale - (pipeW) / 2),
                    Math.round(horizonHeight + yPos) - Math.round(pipeH ),
                    Math.round(pipeW ),
                    Math.round(pipeH ), tex, 1.0);
                    */

                framebuffer.scaleClipBlitter.drawScaledTextureClip(
                    Math.round(320 / 2 + pipeDistX * projectionHeightScale - (pipeW * projectionHeightScale) / 2),
                    Math.round(horizonHeight + yPos) - Math.round(pipeH * projectionHeightScale),
                    Math.round(pipeW * projectionHeightScale),
                    Math.round(pipeH * projectionHeightScale), tex, 1.0);

            }
        }
    }

}
