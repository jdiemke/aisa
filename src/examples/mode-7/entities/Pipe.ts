import { Vector2f } from '../../../math/index';
import { Texture } from '../../../texture/index';
import { Mode7Entity } from '../Mode7Entity';

export class Pipe extends Mode7Entity {

    private texture: Texture;

    public constructor(position: Vector2f, texture: Texture) {
        super(position);
        this.texture = texture;
    }

    public getTexture(): Texture {
        return this.texture;
    }

}
