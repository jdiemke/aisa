import { Framebuffer } from '../../Framebuffer';
import { Sprite } from './Sprite';

export class SpriteRenderer {

    private sprites: Array<Sprite>;

    constructor() {
        this.sprites = new Array<Sprite>();
    }

    public addSprite(sprite: Sprite): void {
        this.sprites.push(sprite);
    }

    public render(framebuffer: Framebuffer): void {
        this.sprites.sort((a: Sprite, b: Sprite) => {
            return b.priority === a.priority ? b.z - a.z : b.priority - a.priority;
        });

        this.sprites.forEach((sp: Sprite) => {
            framebuffer.scaleClipBlitter.drawScaledTextureClip(
                sp.xp,
                sp.yp,
                sp.width,
                sp.height, sp.texture, sp.alphaBlend);
        });
        this.sprites.length = 0;
    }

}
