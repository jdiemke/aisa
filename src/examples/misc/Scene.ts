import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { Color } from '../../core/Color';
import { BunnyScene } from '../bunny/BunnyScene';
import { CubeScene } from '../cube/CubeScene';
import { time } from 'console';

export class Scene extends AbstractScene {

    // move
    private start: number;

    // move
    private texture: Texture;
    private mask: Texture;
    private texture2: Texture;
    private heightmap: Texture;
    private heightmapSphere: Texture;
    private texture4: Texture;
    private texture5: Texture;
    private baked: Texture;
    private texture6: Texture;
    private texture7: Texture;
    private texture8: Texture;
    private texture9: Texture;
    private texture10: Texture;
    private metalheadz: Texture;
    private platonian: Texture;
    private dirt: Texture;
    private texture11: Texture;
    private texture12: Texture;
    private texture13: Texture;
    private texture14: Texture;
    private texture15: Texture;
    private revision: Texture;
    private lab2: Texture;
    private hoodlumLogo: Texture;
    private blurred: Texture;
    private envmap: Texture;
    private particleTexture: Texture;
    private particleTexture2: Texture;
    private noise: Texture;
    private rave: Texture;
    private metal: Texture;
    private micro: Texture;
    private hlm: Texture;
    private meth: Texture;
    private displacementMap: Texture;
    private cross: Texture;
    private skybox: {
        back?: Texture,
        down?: Texture,
        front?: Texture,
        left?: Texture,
        right?: Texture,
        up?: Texture
    } = {};
    private abstract: Texture;
    private kiss: Texture;
    private myAudio: HTMLAudioElement;
    private spheremap: Texture;
    private overlay: Texture;

    private flood: Texture;
    private fairlight: Texture;

    // move
    private fpsStartTime: number = Date.now();
    private fpsCount: number = 0;
    private fps: number = 0;

    private accumulationBuffer: Uint32Array;
    private scene: CubeScene;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.accumulationBuffer = new Uint32Array(framebuffer.width * framebuffer.height);
        this.scene = new CubeScene();
        return Promise.all([
            this.scene.init(framebuffer),
            this.createTexture(require('../../assets/flood.png'), false).then(texture => this.flood = texture),
            this.createTexture(require('../../assets/logo-fairlight-10.png'), false).then(texture => this.fairlight = texture),
            this.createTexture(require('../../assets/kiss.png'), true).then(texture => this.kiss = texture),
            this.createTexture(require('../../assets/spheremap.png'), false).then(texture => this.spheremap = texture),
            this.createTexture(require('../../assets/textures/metall.png'), false).then(texture => this.metal = texture),
            this.createTexture(require('../../assets/logo.png'), false).then(texture => this.texture = texture),
            this.createTexture(require('../../assets/razor1911.png'), true).then(texture => this.texture2 = texture),
            this.createTexture(require('../../assets/heightmap.png'), false).then(texture => this.heightmap = texture),
            this.createTexture(require('../../assets/metalheadz.png'), false).then(texture => this.metalheadz = texture),
            this.createTexture(require('../../assets/font.png'), true).then(texture => this.texture4 = texture),
            this.createTexture(require('../../assets/atlantis.png'), false).then(texture => this.texture5 = texture),
            this.createTexture(require('../../assets/lens.png'), true).then(texture => this.texture6 = texture),
            this.createTexture(require('../../assets/ball2.png'), true).then(texture => this.texture7 = texture),
            this.createTexture(require('../../assets/pandabear.png'), false).then(texture => this.texture8 = texture),
            this.createTexture(require('../../assets/battleofilona.png'), false).then(texture => this.texture9 = texture),
            this.createTexture(require('../../assets/spark.png'), true).then(texture => this.texture10 = texture),
            this.createTexture(require('../../assets/ring.png'), true).then(texture => this.texture11 = texture),
            this.createTexture(require('../../assets/sky.png'), true).then(texture => this.texture12 = texture),
            this.createTexture(require('../../assets/bokeh.png'), true).then(texture => this.texture13 = texture),
            this.createTexture(require('../../assets/led.png'), false).then(texture => this.texture14 = texture),
            this.createTexture(require('../../assets/revision.png'), false).then(texture => this.revision = texture),
            this.createTexture(require('../../assets/lab2.png'), false).then(texture => this.lab2 = texture),

            this.createTexture(require('../../assets/skybox/skybox_back.png'), false).then(texture => this.skybox.back = texture),
            this.createTexture(require('../../assets/skybox/skybox_down.png'), false).then(texture => this.skybox.down = texture),
            this.createTexture(require('../../assets/skybox/skybox_front.png'), false).then(texture => this.skybox.front = texture),
            this.createTexture(require('../../assets/skybox/skybox_left.png'), false).then(texture => this.skybox.left = texture),
            this.createTexture(require('../../assets/skybox/skybox_right.png'), false).then(texture => this.skybox.right = texture),
            this.createTexture(require('../../assets/skybox/skybox_up.png'), false).then(texture => this.skybox.up = texture),

            this.createTexture(require('../../assets/platonian_baked.png'), false).then(texture => this.platonian = texture),
            this.createTexture(require('../../assets/meth.png'), true).then(texture => this.meth = texture),
            this.createProceduralTexture().then(texture => this.texture15 = texture),
            this.createProceduralTexture2().then(texture => this.particleTexture = texture),
            this.createProceduralTexture3().then(texture => this.particleTexture2 = texture),
            TextureUtils.generateProceduralNoise().then(texture => this.noise = texture),
            this.createProceduralDisplacementMap().then(texture => this.displacementMap = texture),
            this.createTexture(require('../../assets/hoodlumLogo.png'), true).then(texture => this.hoodlumLogo = texture),
            this.createTexture(require('../../assets/abstract.png'), false).then(texture => this.abstract = texture),
            this.createTexture(require('../../assets/rave.png'), false).then(texture => this.rave = texture),
            this.createTexture(require('../../assets/microstrange.png'), false).then(texture => this.micro = texture),
            this.createTexture(require('../../assets/Backed.png'), false).then(texture => this.baked = texture),
            this.createTexture(require('../../assets/blurredBackground.png'), false).then(texture => this.blurred = texture),
            this.createTexture(require('../../assets/hlm.png'), true).then(texture => this.hlm = texture),
            this.createTexture(require('../../assets/cross.png'), true).then(texture => this.cross = texture),
            this.createTexture(require('../../assets/envmap.png'), false).then(texture => this.envmap = texture),
            this.createTexture(require('../../assets/heightmapSphere.png'), false).then(texture => this.heightmapSphere = texture),
            this.createTexture(require('../../assets/mask.png'), true).then(texture => this.mask = texture),
            this.createTexture(require('../../assets/dirt.png'), true).then(texture => this.dirt = texture),
            this.createTexture(require('../../assets/haujobb-overlay.png'), true).then(texture => this.overlay = texture),

        ]).then(() => {
            // Web Audio API
            // FIXME: put this into a Player Class
            framebuffer.precompute(this.heightmap );

            const audioContext = new AudioContext();
            const request = new XMLHttpRequest();
            request.open('GET', require('../../assets/sound/xmix_q2_final.ogg'), true);
            request.responseType = 'arraybuffer';
            request.onload = () => {
                const undecodedAudio = request.response;
                audioContext.decodeAudioData(undecodedAudio,
                    (buffer) => {
                        const sourceBuffer = audioContext.createBufferSource();
                        sourceBuffer.buffer = buffer;
                        sourceBuffer.connect(audioContext.destination);
                        sourceBuffer.loop = true;
                        sourceBuffer.start(audioContext.currentTime);
                        this.start = Date.now();
                    });
            };

            request.send();
        });
    }

    public render(framebuffer: Framebuffer): void {
        const currentTime: number = Date.now();

        if (currentTime > this.fpsStartTime + 1000) {
            this.fpsStartTime = currentTime;
            this.fps = this.fpsCount;
            this.fpsCount = 0;
        }
        this.fpsCount++;

        framebuffer.pixelate();
        framebuffer.drawPlaneDeformation(currentTime, this.texture5);

        framebuffer.clear();
      //  framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.fairlight.texture);
        framebuffer.wireFrameTerrain(currentTime*0.008,this.particleTexture2);
     framebuffer.addReflections();
    }

    public createProceduralTexture(): Promise<Texture> {
        return new Promise((resolve) => {
            const texture = new Texture();
            texture.texture = new Uint32Array(256 * 256);

            const rng = new RandomNumberGenerator();
            rng.setSeed(100);

            for (let y = 0; y < 256; y++) {
                for (let x = 0; x < 256; x++) {
                    texture.texture[x + y * 256] = (rng.getFloat() * 256) | 0 | 255 << 24;
                }
            }

            texture.width = 256;
            texture.height = 256;
            resolve(texture);
        });
    }

    public createProceduralTexture2(): Promise<Texture> {
        return new Promise((resolve) => {
            const texture = new Texture();
            texture.texture = new Uint32Array(256 * 256);

            const rng = new RandomNumberGenerator();
            rng.setSeed(100);

            for (let y = 0; y < 256; y++) {
                for (let x = 0; x < 256; x++) {
                    const dx = 127 - x
                    const dy = 127 - y
                    const r = Math.sqrt(dx * dx + dy * dy) / 127;
                    let c = 1 - r;
                    c = c * c;
                    if (r > 1) c = 0;
                    c = Math.min(1, c * 40);
                    texture.texture[x + y * 256] = 255 | 205 << 8 | 255 << 16 | (c * 255) << 24;
                }
            }

            texture.width = 256;
            texture.height = 256;
            resolve(texture);
        });
    }

    public createProceduralTexture3(): Promise<Texture> {
        return new Promise((resolve) => {
            const texture = new Texture();
            texture.texture = new Uint32Array(256 * 256);

            const rng = new RandomNumberGenerator();
            rng.setSeed(100);

            for (let y = 0; y < 256; y++) {
                for (let x = 0; x < 256; x++) {
                    const dx = 127 - x
                    const dy = 127 - y
                    const r = Math.sqrt(dx * dx + dy * dy) / 127;
                    let c = 1 - r;
                    c = c * c * c;
                    if (r > 1) c = 0;
                    c = Math.min(1, c * 2.9);

                    texture.texture[x + y * 256] = 235 | 255 << 8 | 235 << 16 | (c * 255) << 24;
                }
            }

            texture.width = 256;
            texture.height = 256;
            resolve(texture);
        });
    }

    public createProceduralDisplacementMap(): Promise<Texture> {
        return new Promise((resolve) => {
            const texture = new Texture();
            texture.texture = new Uint32Array(256 * 256);

            const rng: RandomNumberGenerator = new RandomNumberGenerator();
            rng.setSeed(100);

            texture.texture.fill(128 | 255 << 24);

            for (let y = 0; y < 256; y++) {
                for (let x = 0; x < 256; x++) {
                    const dx = 127 - x
                    const dy = 127 - y
                    const r = Math.sqrt(dx * dx + dy * dy) / 127;
                    let c = 1 - r;
                    c = c * c * c;
                    if (r > 1) c = 0;
                    c = Math.min(1, c * 2.9);

                    texture.texture[x + y * 256] = (texture.texture[x + y * 256] & 0xffffff00) | texture.texture[x + y * 256] & 0xff + (c * 255);
                }
            }

            texture.width = 256;
            texture.height = 256;
            resolve(texture);
        });
    }

    public createTexture(path: string, hasAlpha: boolean): Promise<Texture> {
        return new Promise<Texture>(((resolve: (texture?: Texture) => void): void => {
            const img = new Image();
            img.onload = () => {
                const texture = new Texture();
                texture.texture = this.getImageData(img, hasAlpha);
                texture.width = img.width;
                texture.height = img.height;
                resolve(texture);
            };
            img.onerror = () => resolve();
            img.src = path;
        }));
    }

    getImageData(image: HTMLImageElement, withAlpha: boolean = false): Uint32Array {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context: CanvasRenderingContext2D = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        const data = context.getImageData(0, 0, image.width, image.height).data;
        const conv = new Uint32Array(data.length / 4);
        let c = 0;
        for (let i = 0; i < data.length; i += 4) {
            if (withAlpha) {
                conv[c] = (data[i + 3] << 24) | (data[i + 2] << 16) | (data[i + 1] << 8) | data[i + 0];
            } else {
                conv[c] = (255 << 24) | (data[i + 2] << 16) | (data[i + 1] << 8) | data[i + 0];
            }

            c++;
        }
        return conv;
    }

}
