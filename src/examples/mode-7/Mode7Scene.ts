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
import { NpcTrack } from './NpcTrack';
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
    private mapHud: Texture;
    private pos: Texture;
    private posJoshi: Texture;
    private lap2Texture: Texture;
    private shadowTexture: Texture;
    private bump: Texture;
    private banana: Texture;
    private flower: Texture;
    private egg: Texture;
    private pipe2: Texture;
    private back: Texture;
    private grass: Texture;
    private pipe: Texture; private metrics: Texture;
    private kartPosition: Vector3f = new Vector3f(273.79803081006753, 2565.460311653938 - 1024, 0);
    private pipePositions: Array<Pipe>;
    private startTime: number = Date.now();
    private keyboard: Keyboard = new Keyboard();
    private marioTextures: Array<Texture> = new Array<Texture>();
    private joshiTextures: Array<Texture> = new Array<Texture>();
    private fontRenderer: FontRenderer;
    private spriteRenderer: SpriteRenderer = new SpriteRenderer();
    private angleVel: number = 0;
    private velocity: Vector3f = new Vector3f(0, 0, 0);
    private acceleration: number = 0;
    private mode7Renderer: Mode7Renderer;
    private camera: Camera;

    private npcTrack: Array<Vector2f> = NpcTrack.track;

    private animator: KartAnimator = new KartAnimator();

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
            TextureUtils.load(require('./assets/sprites/bump.png'), true).then(
                (texture: Texture) => this.bump = texture
            ),
            TextureUtils.load(require('./assets/sprites/banana.png'), true).then(
                (texture: Texture) => this.banana = texture
            ),
            TextureUtils.load(require('./assets/sprites/egg.png'), true).then(
                (texture: Texture) => this.egg = texture
            ),
            TextureUtils.load(require('./assets/sprites/flower.png'), true).then(
                (texture: Texture) => this.flower = texture
            ),
            TextureUtils.load(require('./assets/sprites/pipe2.png'), true).then(
                (texture: Texture) => this.pipe2 = texture
            ),
            TextureUtils.load(require('./assets/sprites/mapHUD.png'), true).then(
                (texture: Texture) => this.mapHud = texture
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
            TextureUtils.load(require('./assets/sprites/pos.png'), true).then(
                (texture: Texture) => this.pos = texture
            ),
            TextureUtils.load(require('./assets/sprites/posJoshi.png'), true).then(
                (texture: Texture) => this.posJoshi = texture
            ),
        ]).then(
            () => {
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
                const texArray: Array<Texture> = [
                    this.banana,
                    this.bump,
                    this.pipe,
                    this.pipe2,
                    this.flower,
                    this.egg
                ];

                for (let i: number = 0; i < 100; i++) {
                    const tex: Texture = texArray[Math.floor(Math.random() * (texArray.length))];

                    this.pipePositions.push(
                        new Pipe(
                            new Vector2f(
                                Math.random() * 1024,
                                Math.random() * 1024
                            ),
                            tex, 1.0, 0, 1.2, tex === this.bump ? -5 : tex === this.banana ? -3 : 0)
                    );
                }

            });
    }

    public render(framebuffer: Framebuffer): void {
        // https://www.emanueleferonato.com/2007/05/15/create-a-flash-racing-game-tutorial/
        // http://engineeringdotnet.blogspot.com/2010/04/simple-2d-car-physics-in-games.html
        this.handleInput();
        this.mode7Renderer.render(framebuffer);
        this.drawBackground(framebuffer);

        this.drawMario();

        const npcs: Array<Mode7Entity> = this.getNPCs();
        this.drawMode7Entities(npcs);
        this.drawMode7Entities(this.pipePositions);

        this.spriteRenderer.render(framebuffer);
        this.drawHeadUpDisplay(framebuffer);
        this.drawLapCounter(framebuffer);
        this.drawMinimap(framebuffer, npcs);
    }

    private drawLapCounter(framebuffer: Framebuffer): void {
        const offset: Vector2f = this.camera.getViewDirection().perp()
            .mul(10.0 * Math.sin((Date.now() - this.startTime) * 0.001) + 25);
        const pos: Vector2f = new Vector2f(this.kartPosition.x * 0.3, this.kartPosition.y * 0.3).sub(offset);

        const counterEntity: Mode7Entity =
            new Pipe(pos, this.lap2Texture);
        counterEntity.height = Math.abs(Math.sin((Date.now() - this.startTime) * 0.001) * 30) + 25 +
            Math.abs(Math.sin((Date.now() - this.startTime) * 0.002) * 40);

        this.drawMode7Entities(
            [new Pipe(pos, this.shadowTexture, 1.0, 1, 1.0, -4)]
        );

        this.drawMode7Entities(
            [counterEntity]
        );
    }

    private drawMario(): void {
        let marioTex: Texture;
        if (this.keyboard.isDown(68)) {
            marioTex = this.marioTextures[1];
        } else if (this.keyboard.isDown(65)) {
            marioTex = this.marioTextures[this.marioTextures.length - 1];
        } else {
            marioTex = this.marioTextures[0];
        }

        this.drawMode7Entities(
            [new Pipe(new Vector2f(this.kartPosition.x * 0.3, this.kartPosition.y * 0.3),
                this.shadowTexture, 1.0, 1, 1, -4)]
        );

        const mario: Mode7Entity =
            new Pipe(new Vector2f(this.kartPosition.x * 0.3, this.kartPosition.y * 0.3), marioTex, 1.0, 0, 1.0, -4);
        mario.height = Math.abs(Math.sin((Date.now() - this.startTime) * 0.003) * 30);

        this.drawMode7Entities(
            [mario]
        );
    }

    private drawMinimap(framebuffer: Framebuffer, npcs: Array<Mode7Entity>): void {
        framebuffer.drawTexture(2, 100 - 2, this.mapHud, 0.5);

        npcs.forEach((npc: Mode7Entity) => {
            const xx: number = Math.round(npc.position.x / 1024 * 100 - 8 + 2);
            const yy: number = Math.round(npc.position.y / 1024 * 100 - 8 + 100 - 2);

            framebuffer.drawTexture(xx, yy, this.posJoshi, 0.5);
        });

        const x: number = Math.round(this.kartPosition.x / 1024 * 100 * 0.3 - 8 + 2);
        const y: number = Math.round(this.kartPosition.y / 1024 * 100 * 0.3 - 8 + 100 - 2);

        framebuffer.drawTexture(x, y, this.pos, 1.0);
    }

    private getNPCs(): Array<Mode7Entity> {
        const tim: number = Date.now() - this.startTime;
        const npcs: Array<Mode7Entity> = new Array<NpcEntity>();

        for (let i: number = 0; i < 10; i++) {
            const scale: number = 2200;
            const pos: Vector2f = this.animator.getPos(tim + i * scale);
            const npcDir: Vector2f =
                this.animator.getPos(tim + 10 + i * scale).mul(1 / 0.3).sub(pos.mul(1 / 0.3)).normalize();

            const entity: NpcEntity = new NpcEntity(pos, this.joshiTextures);
            entity.setDirection(npcDir);
            entity.height = Math.abs(Math.sin((Date.now() - this.startTime) * 0.003) * 30);
            npcs.push(entity);
            npcs.push(
                new Pipe(pos, this.shadowTexture, 1.0, 1)
            );
        }
        return npcs;
    }

    private drawMode7Entities(entities: Array<Mode7Entity>): void {
        const horizonHeight: number = 20;
        const cameraDirection: Vector2f = this.camera.getViewDirection();
        const cameraDirectionPerp: Vector2f = cameraDirection.perp();
        const MINIMUM_SPRITE_HEIGHT: number = 0;

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
                const scale: number = entities[i].scale;
                const offset: number = entities[i].offset;
                this.spriteRenderer.addSprite(
                    new Sprite(
                        Math.round(
                            320 / 2 + cameraDirectionPerpDistance * projectionScale -
                            (texture.width * projectionScale * scale) / 2
                        ),
                        Math.round(horizonHeight + projectedY -
                            ((texture.height + offset) * scale + entities[i].height) * projectionScale),
                        Math.round(texture.width * projectionScale * scale),
                        Math.round(texture.height * projectionScale * scale),
                        texture,
                        entities[i].getAlpha(),
                        distance,
                        entities[i].getPriority())
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
        this.velocity = this.velocity.mul(0.91);
        this.acceleration = this.acceleration * 0.89;

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
