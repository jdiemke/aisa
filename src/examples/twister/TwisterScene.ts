import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';

/**
 * TODO: extract twister into effect class
 */
export class TwisterScene extends AbstractScene {

    private backgroundTexture: Texture;
    private logoTexture: Texture;

    public init(): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('@assets/atlantis.png'), false).then(
                (texture: Texture) => this.backgroundTexture = texture
            ),
            TextureUtils.load(require('@assets/logo.png'), false).then(
                (texture: Texture) => this.logoTexture = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        framebuffer.drawScaledTextureClipBi(
            0,
            0,
            framebuffer.width, framebuffer.height, this.backgroundTexture, 1.0);

        // framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.backgroundTexture.texture);
        this.draw(framebuffer, this.logoTexture, time);
    }

    private draw(framebuffer: Framebuffer, texture: Texture, time: number): void {
        const a: number = time * 0.001;
        for (let i: number = 10; i < framebuffer.height - 10; i++) {
            const xoff = (Math.sin(a + i * 0.01) * 50) | 0;
            const rot = Math.sin(a * 0.4 + i * 0.0021) * Math.PI * 2;
            let scale = 42;
            const x1 = (Math.sin(rot) * scale) | 0;
            const x2 = (Math.sin(Math.PI * 2 / 4 + rot) * scale) | 0;
            const x3 = (Math.sin(Math.PI * 2 / 4 * 2 + rot) * scale) | 0;
            const x4 = (Math.sin(Math.PI * 2 / 4 * 3 + rot) * scale) | 0;

            if (x2 > x1) {
                scale = Math.max(0, Math.sin(Math.PI * 2 / 4 * 1.5 + rot));
                const dist = x2 - x1;
                const xPos = x1 + 120 + xoff;
                this.drawSpan(framebuffer, dist, xPos, i, scale, texture, time);
            }

            if (x3 > x2) {
                scale = Math.max(0, Math.sin(Math.PI * 2 / 4 * 2.5 + rot));
                const dist = x3 - x2;
                const xPos = x2 + 120 + xoff;
                this.drawSpan(framebuffer, dist, xPos, i, scale, texture, time);
            }

            if (x4 > x3) {
                scale = Math.max(0, Math.sin(Math.PI * 2 / 4 * 3.5 + rot));
                const dist = x4 - x3;
                const xPos = x3 + 120 + xoff;
                this.drawSpan(framebuffer, dist, xPos, i, scale, texture, time);
            }

            if (x1 > x4) {
                scale = Math.max(0, Math.sin(Math.PI * 2 / 4 * 4.5 + rot));
                const dist = x1 - x4;
                const xPos = x4 + 120 + xoff;
                this.drawSpan(framebuffer, dist, xPos, i, scale, texture, time);
            }
        }
    }

    private drawSpan(
        framebuffer: Framebuffer,
        dist: number,
        xpos: number,
        ypos: number,
        scale: number,
        texture: Texture,
        time: number): void {
        let framebufferIndex = xpos + ypos * framebuffer.width;
        let textureIndex = (((ypos - time * 0.029) | 0) & 0xff) * texture.width;
        const textureForwardDifference = texture.width / dist;
        const hightlight = Math.pow(scale, 11) * 115;

        for (let j = 0; j < dist; j++) {
            const color = texture.texture[textureIndex | 0];

            const r = Math.min(((color >> 0 & 0xff) * scale) + hightlight, 255);
            const g = Math.min(((color >> 8 & 0xff) * scale) + hightlight, 255);
            const b = Math.min(((color >> 16 & 0xff) * scale) + hightlight, 255);

            framebuffer.framebuffer[framebufferIndex] = r | g << 8 | b << 16 | 255 << 24;

            framebufferIndex++;
            textureIndex += textureForwardDifference;
        }
    }
}
