import { Framebuffer } from '../../Framebuffer';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { CubeScene } from '../cube/CubeScene';
import { PlatonianScene } from '../platonian/PlatonianScene';

export class GlowScene extends AbstractScene {

    private ledTexture: Texture;
    private noise: Texture; private accumulationBuffer: Uint32Array;
    private scene: PlatonianScene;

    private static readonly GLOW_TEXTURE_WIDTH = 16;
    private static readonly GLOW_TEXTURE_HEIGHT = 8;
     // GLOW
     glowBuffer = new Uint32Array(GlowScene.GLOW_TEXTURE_WIDTH * GlowScene.GLOW_TEXTURE_HEIGHT);
    glowBuffer2 = new Uint32Array(GlowScene.GLOW_TEXTURE_WIDTH * GlowScene.GLOW_TEXTURE_HEIGHT);


    public init(framebuffer: Framebuffer): Promise<any> {
        this.scene = new PlatonianScene();
        this.accumulationBuffer = new Uint32Array(framebuffer.width * framebuffer.height);
        return Promise.all([
            this.scene.init(framebuffer),
            TextureUtils.load(require('@assets/led.png'), false).then(
                (texture: Texture) => this.ledTexture = texture
            ),
            TextureUtils.generateProceduralNoise().then(texture => this.noise = texture),
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        const rng = new RandomNumberGenerator();
        rng.setSeed(666);
        rng.setSeed((time / 1000) |0)
        const texture = new Texture(new Uint32Array(32 * 32), 32, 32);
        // FIXME:
        // - remove realtime glow and put it pre baked into the texture insteadt!
        for (let k = 0; k < 100; k++) {
            const x = Math.round(rng.getFloat() * 32);
            const y = Math.round(rng.getFloat() * 32);
            if (k < 50)
                texture.texture[x + y * 32] = 47 | 181 << 8 | 243 << 16;
            else
                texture.texture[x + y * 32] = 252 | 130 << 8 | 195 << 16;
        }

        framebuffer.drawPlanedeformationTunnelAnim(time, texture);





        // todo filer onlyy brigh parts
        // blur if too blocky
        // clamp to border when filterting bilinear
        // add and dont blend with alpha
        for (let y = 0; y < GlowScene.GLOW_TEXTURE_HEIGHT; y++) {
            for (let x = 0; x < GlowScene.GLOW_TEXTURE_WIDTH; x++) {
                const xx = Math.round(320/ GlowScene.GLOW_TEXTURE_WIDTH * (x+0.5));
                const yy = Math.round(200/GlowScene.GLOW_TEXTURE_HEIGHT * (y+0.5));

                this.glowBuffer[x + y * GlowScene.GLOW_TEXTURE_WIDTH] = framebuffer.framebuffer[xx + yy * 320];//color ;
            }
        }

        for (let y = 0; y < GlowScene.GLOW_TEXTURE_HEIGHT; y++) {
            for (let x = 0; x < GlowScene.GLOW_TEXTURE_WIDTH; x++) {
                const col1 = this.glowBuffer[Math.max(x - 1, 0) + y * GlowScene.GLOW_TEXTURE_WIDTH];
                const col2 = this.glowBuffer[(x) % GlowScene.GLOW_TEXTURE_WIDTH + y * GlowScene.GLOW_TEXTURE_WIDTH];
                const col3 = this.glowBuffer[Math.min(x + 1, GlowScene.GLOW_TEXTURE_WIDTH-1) + y * GlowScene.GLOW_TEXTURE_WIDTH];
                const r = (col1 & 0xff) * 1 / 4 + (col2 & 0xff) * 2 / 4 + (col3 & 0xff) * 1 / 4;
                const g = (col1 >> 8 & 0xff) * 1 / 4 + (col2 >> 8 & 0xff) * 2 / 4 + (col3 >> 8 & 0xff) * 1 / 4;
                const b = (col1 >> 16 & 0xff) * 1 / 4 + (col2 >> 16 & 0xff) * 2 / 4 + (col3 >> 16 & 0xff) * 1 / 4;
                this.glowBuffer2[x + y * GlowScene.GLOW_TEXTURE_WIDTH] = r | g << 8 | b << 16;
            }
        }

        for (let y = 0; y < GlowScene.GLOW_TEXTURE_HEIGHT; y++) {
            for (let x = 0; x <  GlowScene.GLOW_TEXTURE_WIDTH; x++) {
                const col1 =  this.glowBuffer2[(x) + Math.max(y - 1, 0) *  GlowScene.GLOW_TEXTURE_WIDTH];
                const col2 =  this.glowBuffer2[(x) + y % GlowScene.GLOW_TEXTURE_HEIGHT *  GlowScene.GLOW_TEXTURE_WIDTH];
                const col3 =  this.glowBuffer2[(x) + Math.min(y + 1, GlowScene.GLOW_TEXTURE_WIDTH-1) *  GlowScene.GLOW_TEXTURE_WIDTH];
                const r = ((col1 & 0xff) * 1 / 4 + (col2 & 0xff) * 2 / 4 + (col3 & 0xff) * 1 / 4);
                const g = ((col1 >> 8 & 0xff) * 1 / 4 + (col2 >> 8 & 0xff) * 2 / 4 + (col3 >> 8 & 0xff) * 1 / 4);
                const b = ((col1 >> 16 & 0xff) * 1 / 4 + (col2 >> 16 & 0xff) * 2 / 4 + (col3 >> 16 & 0xff) * 1 / 4);
                this.glowBuffer[x + y *  GlowScene.GLOW_TEXTURE_WIDTH] = r | g << 8 | b << 16;
            }
        }

        // draw Glow
        const glowTexture = new Texture();
        glowTexture.texture =  this.glowBuffer;
        glowTexture.width =  GlowScene.GLOW_TEXTURE_WIDTH;
        glowTexture.height =  GlowScene.GLOW_TEXTURE_HEIGHT;
        glowTexture.setClamp(true);


        framebuffer.drawScaledTextureClipBiAdd(0, 0, 320, 200, glowTexture,0.70);
        // Cube


        // Motion Blur
        const texture3 = new Texture(this.accumulationBuffer, 320, 200);
        framebuffer.drawTexture(0, 0, texture3, 0.80);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);

        framebuffer.clearDepthBuffer();
        this.scene.drawBlenderScene8(framebuffer, time*4);

        framebuffer.noise(time, this.noise);


    }



}
