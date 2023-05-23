import { Framebuffer } from '../../Framebuffer';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { CubeScene } from '../cube/CubeScene';

export class GlowScene extends AbstractScene {

    private ledTexture: Texture;
    private noise: Texture; private accumulationBuffer: Uint32Array;
    private scene: CubeScene;
    

    public init(framebuffer: Framebuffer): Promise<any> {
        this.scene = new CubeScene();
        this.accumulationBuffer = new Uint32Array(framebuffer.width * framebuffer.height);
        return Promise.all([
            this.scene.init(framebuffer),
            TextureUtils.load(require('../../assets/led.png'), false).then(
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
     


        // GLOW
        const glowBuffer = new Uint32Array(16 * 2 * 10 * 2);
        const glowBuffer2 = new Uint32Array(16 * 2 * 10 * 2);

        // todo filer onlyy brigh parts
        // blur if too blocky
        // clamp to border when filterting bilinear
        // add and dont blend with alpha
        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 32; x++) {
                const xx = Math.round(10 * x+5);
                const yy = Math.round(10 * y+5);

                glowBuffer[x + y * 32] = framebuffer.framebuffer[xx + yy * 320];//color ;
            }
        }

        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 32; x++) {
                const col1 = glowBuffer[Math.max(x - 1, 0) + y * 32];
                const col2 = glowBuffer[(x) % 32 + y * 32];
                const col3 = glowBuffer[Math.min(x + 1, 31) + y * 32];
                const r = (col1 & 0xff) * 1 / 4 + (col2 & 0xff) * 2 / 4 + (col3 & 0xff) * 1 / 4;
                const g = (col1 >> 8 & 0xff) * 1 / 4 + (col2 >> 8 & 0xff) * 2 / 4 + (col3 >> 8 & 0xff) * 1 / 4;
                const b = (col1 >> 16 & 0xff) * 1 / 4 + (col2 >> 16 & 0xff) * 2 / 4 + (col3 >> 16 & 0xff) * 1 / 4;
                glowBuffer2[x + y * 32] = r | g << 8 | b << 16;
            }
        }

        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 32; x++) {
                const col1 = glowBuffer2[(x) + Math.max(y - 1, 0) * 32];
                const col2 = glowBuffer2[(x) + y % 20 * 32];
                const col3 = glowBuffer2[(x) + Math.min(y + 1, 19) * 32];
                const r = ((col1 & 0xff) * 1 / 4 + (col2 & 0xff) * 2 / 4 + (col3 & 0xff) * 1 / 4);
                const g = ((col1 >> 8 & 0xff) * 1 / 4 + (col2 >> 8 & 0xff) * 2 / 4 + (col3 >> 8 & 0xff) * 1 / 4);
                const b = ((col1 >> 16 & 0xff) * 1 / 4 + (col2 >> 16 & 0xff) * 2 / 4 + (col3 >> 16 & 0xff) * 1 / 4);
                glowBuffer[x + y * 32] = r | g << 8 | b << 16;
            }
        }

        // draw Glow
        const glowTexture = new Texture();
        glowTexture.texture = glowBuffer;
        glowTexture.width = 32;
        glowTexture.height = 20;
        glowTexture.setClamp(true);

        framebuffer.drawScaledTextureClipBiAdd(0, 0, 320, 200, glowTexture, 0.75);
       
        // Cube
        framebuffer.clearDepthBuffer();
        this.scene.renderCube(framebuffer, time);
        
        // Motion Blur
        const texture3 = new Texture(this.accumulationBuffer, 320, 200);
        framebuffer.drawTexture(0, 0, texture3, 0.7);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);
        framebuffer.noise(time, this.noise);
    }

   

}
