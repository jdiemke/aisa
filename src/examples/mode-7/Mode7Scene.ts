import { Framebuffer } from '../../Framebuffer';
import { Vector2f, Vector3f } from '../../math/index';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture/index';
import { FontRenderer } from '../sine-scroller/FontRenderer';
import { NpcEntity } from './entities/NpcEntity';
import { Pipe } from './entities/Pipe';
import { KartAnimator } from './KartAnimator';
import { Keyboard } from './Keyboard';
import { Mode7Entity } from './Mode7Entity';
import { Camera, Mode7Renderer } from './Mode7Renderer';
import { Sprite } from './Sprite';
import { SpriteRenderer } from './SpriteRenderer';

/**
 * TODO:
 * - optimize rendering scene
 * - add collision
 * - add control keyboard and touch
 *
 * - physics:
 *      - http://rmgi.blog./pygame-2d-car-tutorial.html
 *      - http://engineeringdotnet.blogspot.com/2010/04/simple-2d-car-physics-in-games.html
 *      - https://github.com/leonardo-ono/Java2DRacingPhysicsTest
 *      - https://www.gamedev.net/articles/programming/math-and-physics/2d-car-physics-r2443/
 *
 * https://www.gamedev.net/forums/topic/51626-making-mario-kart-type-of-gameswhats-involved/
 * https://www.coranac.com/tonc/text/mode7.htm
 *
 * - maps
 *      - http://www.mariouniverse.com/maps-snes-smk/
 */
export class Mode7Scene extends AbstractScene {

    private map: Texture;
    private lap2Texture: Texture;
    private shadowTexture: Texture;
    private back: Texture;
    private grass: Texture;
    private pipe: Texture; private metrics: Texture;
    private kartPosition: Vector3f = new Vector3f(273.79803081006753, 2565.460311653938 - 1024, 0);
    private pipePositions: Array<Pipe>;
    private startTime: number = Date.now();
    private keyboard: Keyboard = new Keyboard();
    private marioTextures: Array<Texture> = new Array<Texture>();
    private joshiTextures: Array<Texture> = new Array<Texture>();
    private npc: Vector2f = new Vector2f(0, 0);
    private fontRenderer: FontRenderer;
    private spriteRenderer: SpriteRenderer = new SpriteRenderer();
    private angleVel: number = 0;
    private velocity: Vector3f = new Vector3f(0, 0, 0);
    private acceleration: number = 0;
    private mode7Renderer: Mode7Renderer;
    private camera: Camera;

    private npcTrack: Array<Vector2f> = [
        new Vector2f(920, 580),
        new Vector2f(940, 476),
        new Vector2f(922, 415),
        new Vector2f(850, 370),
        new Vector2f(766, 323),
        new Vector2f(684, 277),
        new Vector2f(615, 250),
        new Vector2f(524, 209),
        new Vector2f(449, 165),
        new Vector2f(371, 123),
        new Vector2f(295, 91),
        new Vector2f(229, 70),
        new Vector2f(165, 68),
        new Vector2f(119, 89),
        new Vector2f(85, 133),
        new Vector2f(64, 190),
        new Vector2f(56, 247),
        new Vector2f(72, 293),
        new Vector2f(87, 348),
        new Vector2f(81, 408),
        new Vector2f(71, 477),
        new Vector2f(64, 572),
        new Vector2f(67, 637),
        new Vector2f(78, 718),
        new Vector2f(134, 750),
        new Vector2f(226, 727),
        new Vector2f(286, 669),
        new Vector2f(344, 629),
        new Vector2f(447, 586),
        new Vector2f(535, 588),
        new Vector2f(583, 645),
        new Vector2f(612, 712),
        new Vector2f(641, 786),
        new Vector2f(681, 849),
        new Vector2f(744, 895),
        new Vector2f(820, 912),
        new Vector2f(880, 915),
        new Vector2f(930, 880),
        new Vector2f(955, 804),
        new Vector2f(944, 717),
        new Vector2f(921, 643)
    ];

    private animator: KartAnimator = new KartAnimator();

    public onInit(): void {
        const screenDistance: number = 160;
        const cameraHeight: number = 80;
        const cameraDistance: number = 153.4;

        this.camera = new Camera();

        this.camera.height = cameraHeight;
        this.camera.screenDistance = screenDistance;
        this.camera.angle = 270;

        this.camera.position = new Vector2f(
            this.kartPosition.x - Math.cos(2 * Math.PI / 360 * this.camera.angle) * cameraDistance,
            this.kartPosition.y - Math.sin(2 * Math.PI / 360 * this.camera.angle) * cameraDistance
        );

        this.mode7Renderer = new Mode7Renderer(this.map, this.grass);
        this.mode7Renderer.setCamera(this.camera);

        this.pipePositions = new Array<Pipe>();
        for (let i: number = 0; i < 100; i++) {
            this.pipePositions.push(
                new Pipe(
                    new Vector2f(
                        Math.random() * 1024,
                        Math.random() * 1024
                    ),
                    this.pipe)
            );
        }
    }

    public init(framebuffer: Framebuffer): Promise<any> {
        this.animator.setKeyFrames(this.npcTrack);

        this.fontRenderer = new FontRenderer(
            framebuffer, 8, 14, '0123456789',
            require('./assets/sprites/time.png')
        );

        return Promise.all([
            this.fontRenderer.init(),
            TextureUtils.load(require('./assets/map.png'), false).then(
                (texture: Texture) => this.map = texture
            ),
            TextureUtils.load(require('./assets/background.png'), false).then(
                (texture: Texture) => this.back = texture
            ),
            TextureUtils.load(require('./assets/grass.png'), false).then(
                (texture: Texture) => this.grass = texture
            ),
            TextureUtils.load(require('./assets/pipe.png'), true).then(
                (texture: Texture) => this.pipe = texture
            ), TextureUtils.load(require('./assets/sprites/lap2.png'), true).then(
                (texture: Texture) => this.lap2Texture = texture
            ), TextureUtils.load(require('./assets/sprites/shadow.png'), true).then(
                (texture: Texture) => this.shadowTexture = texture
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

            ,
            TextureUtils.load(require('./assets/sprites/joshi01.png'), true).then(
                (texture: Texture) => this.joshiTextures[0] = texture
            ),
            TextureUtils.load(require('./assets/sprites/joshi02.png'), true).then(
                (texture: Texture) => this.joshiTextures[1] = texture
            ),
            TextureUtils.load(require('./assets/sprites/joshi03.png'), true).then(
                (texture: Texture) => this.joshiTextures[2] = texture
            ),
            TextureUtils.load(require('./assets/sprites/joshi04.png'), true).then(
                (texture: Texture) => this.joshiTextures[3] = texture
            ),
            TextureUtils.load(require('./assets/sprites/joshi05.png'), true).then(
                (texture: Texture) => this.joshiTextures[4] = texture
            ),
            TextureUtils.load(require('./assets/sprites/joshi06.png'), true).then(
                (texture: Texture) => this.joshiTextures[5] = texture
            ),
            TextureUtils.load(require('./assets/sprites/joshi07.png'), true).then(
                (texture: Texture) => this.joshiTextures[6] = texture
            ),
            TextureUtils.load(require('./assets/sprites/joshi08.png'), true).then(
                (texture: Texture) => this.joshiTextures[7] = texture
            ),
            TextureUtils.load(require('./assets/sprites/joshi09.png'), true).then(
                (texture: Texture) => this.joshiTextures[8] = texture
            ),
            TextureUtils.load(require('./assets/sprites/joshi10.png'), true).then(
                (texture: Texture) => this.joshiTextures[9] = texture
            ),
            TextureUtils.load(require('./assets/sprites/joshi11.png'), true).then(
                (texture: Texture) => this.joshiTextures[10] = texture
            ),
            TextureUtils.load(require('./assets/sprites/joshi12.png'), true).then(
                (texture: Texture) => this.joshiTextures[11] = texture
            ),
            TextureUtils.load(require('./assets/sprites/joshi13.png'), true).then(
                (texture: Texture) => this.joshiTextures[12] = texture
            ),
            TextureUtils.load(require('./assets/sprites/joshi14.png'), true).then(
                (texture: Texture) => this.joshiTextures[13] = texture
            ),
            TextureUtils.load(require('./assets/sprites/joshi15.png'), true).then(
                (texture: Texture) => this.joshiTextures[14] = texture
            ),
            TextureUtils.load(require('./assets/sprites/joshi16.png'), true).then(
                (texture: Texture) => this.joshiTextures[15] = texture
            ),
            TextureUtils.load(require('./assets/sprites/joshi17.png'), true).then(
                (texture: Texture) => this.joshiTextures[16] = texture
            ),
            TextureUtils.load(require('./assets/sprites/joshi18.png'), true).then(
                (texture: Texture) => this.joshiTextures[17] = texture
            ),
            TextureUtils.load(require('./assets/sprites/joshi19.png'), true).then(
                (texture: Texture) => this.joshiTextures[18] = texture
            ),
            TextureUtils.load(require('./assets/sprites/joshi20.png'), true).then(
                (texture: Texture) => this.joshiTextures[19] = texture
            ),
            TextureUtils.load(require('./assets/sprites/joshi21.png'), true).then(
                (texture: Texture) => this.joshiTextures[20] = texture
            ),
            TextureUtils.load(require('./assets/sprites/joshi22.png'), true).then(
                (texture: Texture) => this.joshiTextures[21] = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        this.handleInput();
        this.mode7Renderer.render(framebuffer);
        this.drawBackground(framebuffer);

        let marioTex: Texture;
        if (this.keyboard.isDown(68)) {
            marioTex = this.marioTextures[1];
        } else if (this.keyboard.isDown(65)) {
            marioTex = this.marioTextures[this.marioTextures.length - 1];
        } else {
            marioTex = this.marioTextures[0];
        }

        this.drawMode7Entities(
            [new Pipe(new Vector2f(this.kartPosition.x * 0.3, this.kartPosition.y * 0.3), this.shadowTexture, 0.5)]
        );

        this.drawMode7Entities(
            [new Pipe(new Vector2f(this.kartPosition.x * 0.3, this.kartPosition.y * 0.3), marioTex)]
        );

        this.drawMode7Entities(this.getNPCs());
        this.drawMode7Entities(this.pipePositions);

        this.spriteRenderer.render(framebuffer);
        this.drawHeadUpDisplay(framebuffer);
        this.drawLapCounter(framebuffer);
    }

    private getNPCs(): Array<Mode7Entity> {
        const tim: number = Date.now() - this.startTime;
        const npcs: Array<NpcEntity> = new Array<NpcEntity>();

        for (let i: number = 0; i < 10; i++) {
            const scale: number = 2200;
            const pos: Vector2f = this.animator.getPos(tim + i * scale);
            const npcDir: Vector2f =
                this.animator.getPos(tim + 10 + i * scale).mul(1 / 0.3).sub(pos.mul(1 / 0.3)).normalize();

            const entity: NpcEntity = new NpcEntity(pos, this.joshiTextures);
            entity.setDirection(npcDir);
            npcs.push(entity);
        }
        return npcs;
    }

    private drawMode7Entities(entities: Array<Mode7Entity>): void {
        const horizonHeight: number = 20;
        const cameraDirection: Vector2f = this.camera.getViewDirection();
        const cameraDirectionPerp: Vector2f = cameraDirection.perp();
        const MINIMUM_SPRITE_HEIGHT: number = 3;

        for (let i: number = 0; i < entities.length; i++) {
            const entity: Vector2f = entities[i].position.mul(1 / 0.3);

            const distance: number = entity.sub(this.camera.position).dot(cameraDirection);

            if (distance > 0) {
                const projectionScale: number = this.camera.screenDistance / distance;
                const texture: Texture = entities[i].getTexture(this.camera);

                if (Math.round(projectionScale * texture.height) <= MINIMUM_SPRITE_HEIGHT) {
                    continue;
                }

                const cameraDirectionPerpDistance: number = entity.sub(this.camera.position).dot(cameraDirectionPerp);
                const projectedY: number = this.camera.height * projectionScale;

                this.spriteRenderer.addSprite(
                    new Sprite(
                        Math.round(
                            320 / 2 + cameraDirectionPerpDistance * projectionScale -
                            (texture.width * projectionScale) / 2
                        ),
                        Math.round(horizonHeight + projectedY) - Math.round(texture.height * projectionScale),
                        Math.round(texture.width * projectionScale),
                        Math.round(texture.height * projectionScale),
                        texture,
                        entities[i].getAlpha(),
                        distance)
                );
            }
        }
    }

    private drawBackground(framebuffer: Framebuffer): void {
        // TODO: optimize
        for (let x: number = 0; x < 320; x++) {
            for (let y: number = 0; y < this.back.height; y++) {
                framebuffer.drawPixel(
                    x, y,
                    this.back.getPixel2(
                        this.back,
                        ((Math.floor(x + this.camera.angle * 2) % this.back.width) + this.back.width)
                        % this.back.width, y)
                );
            }
        }
    }

    private drawHeadUpDisplay(framebuffer: Framebuffer): void {
        framebuffer.drawTexture(320 - this.metrics.width - 16, 2, this.metrics, 1.0);

        const gameTime: number = Date.now() - this.startTime;
        const small: number = Math.floor(gameTime / 10) % 100;
        const gameTimeSeconds: number = Math.floor(gameTime / 1000);
        const gameTimeMinutes: number = Math.floor(gameTime / 60000);
        const seconds: number = gameTimeSeconds % 60;

        this.fontRenderer.drawText2(320 - 8 * 8 - 16 + 1, 4, this.pad(gameTimeMinutes, 2));
        this.fontRenderer.drawText2(320 - 8 * 8 - 16 + 1 + 8 * 3, 4, this.pad(seconds, 2));
        this.fontRenderer.drawText2(320 - 8 * 8 - 16 + 1 + 8 * 6, 4, this.pad(small, 2));
    }

    private drawLapCounter(framebuffer: Framebuffer): void {
        framebuffer.drawTexture(80 +
            Math.floor(Math.sin(Date.now() * 0.001) * 32),
            Math.floor(Math.sin(Date.now() * 0.001) * 32),
            this.lap2Texture, 1.0);
    }

    private pad(num: number, size: number): string {
        const s: string = '0' + num;
        return s.substr(s.length - size);
    }

    private handleInput(): void {
        if (this.keyboard.isDown(Keyboard.KEY_L)) {
            this.acceleration = 0.57;
        }

        if (this.keyboard.isDown(Keyboard.KEY_A)) {
            this.angleVel = Math.max(-1.0, this.angleVel - 0.2);
        } else if (this.keyboard.isDown(Keyboard.KEY_D)) {
            this.angleVel = Math.min(1.0, this.angleVel + 0.2);
        } else {
            this.angleVel = 0;
        }

        this.camera.angle = this.camera.angle + this.angleVel;
        this.velocity.x += Math.cos(2 * Math.PI / 360 * this.camera.angle) * this.acceleration;
        this.velocity.y += Math.sin(2 * Math.PI / 360 * this.camera.angle) * this.acceleration;

        if (this.velocity.length() > 7.4) {
            this.velocity = this.velocity.mul(1 / this.velocity.length() * 7.4);
        }

        this.kartPosition = this.kartPosition.add(this.velocity);
        this.velocity = this.velocity.mul(0.95);
        this.acceleration = this.acceleration * 0.99;

        if (this.velocity.length() < 0.5) {
            this.velocity = this.velocity.mul(0);
        }

        const cameraDistance: number = 159;
        this.camera.position = new Vector2f(
            this.kartPosition.x - Math.cos(2 * Math.PI / 360 * this.camera.angle) * cameraDistance,
            this.kartPosition.y - Math.sin(2 * Math.PI / 360 * this.camera.angle) * cameraDistance
        );
    }

}
