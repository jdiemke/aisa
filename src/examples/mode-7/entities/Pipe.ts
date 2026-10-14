import { Vector2f } from '@engine/math/index';
import { Texture } from '@engine/texture/index';
import { Mode7Entity } from '@examples/mode-7/Mode7Entity';

export class Pipe extends Mode7Entity {

    private texture: Texture;
    private alpha: number;

    public constructor(position: Vector2f, texture: Texture, alpha: number = 1.0,
        priority: number = 0, scale: number = 1.0, offset: number = 0) {
        super(position, 0, priority, scale, offset);
        this.texture = texture;
        this.alpha = alpha;
    }

    public getTexture(): Texture {
        return this.texture;
    }

    public getAlpha(): number {
        return this.alpha;
    }

}
