import { Framebuffer } from '../../Framebuffer';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { Texture } from '../../texture/Texture';

export class Noise {

    public static noise(fb: Framebuffer, elapsedTime: number, texture: Texture, scale: number = 0.07): void {
        const rng = new RandomNumberGenerator();
        rng.setSeed(elapsedTime);
        for (let y = 0; y < fb.height; y++) {
            fb.drawTextureRect(0, y, Math.floor(rng.getFloat() * (texture.texture.length - fb.width)), 0, fb.width, 1, texture.texture, texture.width, scale);
        }
    }

}
