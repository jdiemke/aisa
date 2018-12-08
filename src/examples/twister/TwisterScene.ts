import { Canvas } from '../../Canvas';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';

/**
 * TODO: extract twister into effect class
 */
export class TwisterScene extends AbstractScene {

    private backgroundTexture: Texture;
    private logoTexture: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('./assets/atlantis.png'), false).then(
                (texture: Texture) => this.backgroundTexture = texture
            ),
            TextureUtils.load(require('./assets/logo.png'), false).then(
                (texture: Texture) => this.logoTexture = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();
        const elapsedTime: number = 0.02 * time;

        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.backgroundTexture.texture);
        this.draw(framebuffer, this.logoTexture, time);
    }

    private draw(framebuffer: Framebuffer, texture: Texture, time: number): void {
        const a: number = time * 0.001;
        for (let i: number = 10; i < 190; i++) {
            let xoff = (Math.sin(a + i * 0.01) * 50) | 0;
            let rot = Math.sin(a * 0.4 + i * 0.0021) * Math.PI * 2;
            let scale = 32;
            let x1 = (Math.sin(rot) * scale) | 0;
            let x2 = (Math.sin(Math.PI * 2 / 4 + rot) * scale) | 0;
            let x3 = (Math.sin(Math.PI * 2 / 4 * 2 + rot) * scale) | 0;
            let x4 = (Math.sin(Math.PI * 2 / 4 * 3 + rot) * scale) | 0;

            if (x2 > x1) {
                let scale = Math.max(0, Math.sin(Math.PI * 2 / 4 * 1.5 + rot));
                let dist = x2 - x1;
                let xPos = x1 + 120 + xoff;
                this.drawSpan(framebuffer, dist, xPos, i, scale, texture);
            }

            if (x3 > x2) {
                let scale = Math.max(0, Math.sin(Math.PI * 2 / 4 * 2.5 + rot));
                let dist = x3 - x2;
                let xPos = x2 + 120 + xoff;
                this.drawSpan(framebuffer, dist, xPos, i, scale, texture);
            }

            if (x4 > x3) {
                let scale = Math.max(0, Math.sin(Math.PI * 2 / 4 * 3.5 + rot));
                let dist = x4 - x3;
                let xPos = x3 + 120 + xoff;
                this.drawSpan(framebuffer, dist, xPos, i, scale, texture);
            }

            if (x1 > x4) {
                let scale = Math.max(0, Math.sin(Math.PI * 2 / 4 * 4.5 + rot));
                let dist = x1 - x4;
                let xPos = x4 + 120 + xoff;
                this.drawSpan(framebuffer, dist, xPos, i, scale, texture);
            }
        }
    }

    private drawSpan(framebuffer: Framebuffer, dist: number,
                     xpos: number, ypos: number, scale: number, texture: Texture): void {
        let framebufferIndex = xpos + ypos * 320;
        let textureIndex = (((ypos - Date.now() * 0.029) | 0) & 0xff) * texture.width;
        let textureForwardDifference = texture.width / dist;
        let hightlight = Math.pow(scale, 11) * 115;

        for (let j = 0; j < dist; j++) {
            let color = texture.texture[textureIndex | 0];

            let r = Math.min(((color >> 0 & 0xff) * scale) + hightlight, 255);
            let g = Math.min(((color >> 8 & 0xff) * scale) + hightlight, 255);
            let b = Math.min(((color >> 16 & 0xff) * scale) + hightlight, 255);

            framebuffer.framebuffer[framebufferIndex] = r | g << 8 | b << 16 | 255 << 24;

            framebufferIndex++;
            textureIndex += textureForwardDifference;
        }
    }
}
