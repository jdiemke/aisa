import { Framebuffer } from '../../Framebuffer';
import { Vector3f } from '../../math/Vector3f';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { CubeScene } from '../cube/CubeScene';

export class LedTunnelScene extends AbstractScene {

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
        let rng = new RandomNumberGenerator();
        rng.setSeed(666);
        rng.setSeed((time / 1000) |0)
        let texture = new Texture(new Uint32Array(32 * 32), 32, 32);
        // FIXME:
        // - remove realtime glow and put it pre baked into the texture insteadt!
        for (let k = 0; k < 100; k++) {
            let x = Math.round(rng.getFloat() * 32);
            let y = Math.round(rng.getFloat() * 32);
            if (k < 50)
                texture.texture[x + y * 32] = 47 | 181 << 8 | 243 << 16;
            else
                texture.texture[x + y * 32] = 252 | 130 << 8 | 195 << 16;
        }

        framebuffer.drawPlanedeformationTunnelAnim(time, texture);
     


        // GLOW
        let glowBuffer = new Uint32Array(16 * 2 * 10 * 2);
        let glowBuffer2 = new Uint32Array(16 * 2 * 10 * 2);

        // todo filer onlyy brigh parts
        // blur if too blocky
        // clamp to border when filterting bilinear
        // add and dont blend with alpha
        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 32; x++) {
                let xx = Math.round(10 * x+5);
                let yy = Math.round(10 * y+5);
                let r = framebuffer.framebuffer[xx + yy * 320] & 0xff;
                let g = framebuffer.framebuffer[xx + yy * 320] >> 8 & 0xff;
                let b = framebuffer.framebuffer[xx + yy * 320] >> 16 & 0xff;
                let intensity = (r + g + b) / 3;
                let scale = framebuffer.cosineInterpolate(200, 130, intensity);
                let color = r * scale | g * scale << 8 | b * scale << 16 | 255 << 24;
                //  if (intensity > 138) {
                glowBuffer[x + y * 32] = framebuffer.framebuffer[xx + yy * 320];//color ;
                // }
            }
        }

        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 32; x++) {
                let col1 = glowBuffer[Math.max(x - 1, 0) + y * 32];
                let col2 = glowBuffer[(x) % 32 + y * 32];
                let col3 = glowBuffer[Math.min(x + 1, 31) + y * 32];
                let r = (col1 & 0xff) * 1 / 4 + (col2 & 0xff) * 2 / 4 + (col3 & 0xff) * 1 / 4;
                let g = (col1 >> 8 & 0xff) * 1 / 4 + (col2 >> 8 & 0xff) * 2 / 4 + (col3 >> 8 & 0xff) * 1 / 4;
                let b = (col1 >> 16 & 0xff) * 1 / 4 + (col2 >> 16 & 0xff) * 2 / 4 + (col3 >> 16 & 0xff) * 1 / 4;
                glowBuffer2[x + y * 32] = r | g << 8 | b << 16;
            }
        }

        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 32; x++) {
                let col1 = glowBuffer2[(x) + Math.max(y - 1, 0) * 32];
                let col2 = glowBuffer2[(x) + y % 20 * 32];
                let col3 = glowBuffer2[(x) + Math.min(y + 1, 19) * 32];
                let r = ((col1 & 0xff) * 1 / 4 + (col2 & 0xff) * 2 / 4 + (col3 & 0xff) * 1 / 4);
                let g = ((col1 >> 8 & 0xff) * 1 / 4 + (col2 >> 8 & 0xff) * 2 / 4 + (col3 >> 8 & 0xff) * 1 / 4);
                let b = ((col1 >> 16 & 0xff) * 1 / 4 + (col2 >> 16 & 0xff) * 2 / 4 + (col3 >> 16 & 0xff) * 1 / 4);
                glowBuffer[x + y * 32] = r | g << 8 | b << 16;
            }
        }

        let texture2 = new Texture();
        texture2.texture = glowBuffer;
        texture2.width = 32;
        texture2.height = 20;


        framebuffer.drawScaledTextureClipBiAdd(
            0, 0,
            320, 200, texture2, 0.75
            );
       

            framebuffer.clearDepthBuffer();
            this.scene.renderCube(framebuffer, time);
        // Motion Blur
        let texture3 = new Texture(this.accumulationBuffer, 320, 200);
        framebuffer.drawTexture(0, 0, texture3, 0.7);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);
        framebuffer.noise(time, this.noise);
    }

   

}
