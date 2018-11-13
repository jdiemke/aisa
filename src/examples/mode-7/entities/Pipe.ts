import { Vector2f } from '../../../math/index';
import { Texture } from '../../../texture/index';
import { Mode7Entity } from '../Mode7Entity';

export class Pipe extends Mode7Entity {

    private texture: Texture;
    private alpha: number;

    public constructor(position: Vector2f, texture: Texture, alpha: number = 1.0,
                       priority: number = 0, scale: number = 1.0) {
        super(position, 0, priority, scale);
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
