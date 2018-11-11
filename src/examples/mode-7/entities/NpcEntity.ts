import { Vector2f } from '../../../math/index';
import { Texture } from '../../../texture/Texture';
import { Mode7Entity } from '../Mode7Entity';
import { Camera } from '../Mode7Renderer';

export class NpcEntity extends Mode7Entity {

    private textures: Array<Texture>;
    private direction: Vector2f;

    public constructor(position: Vector2f, textures: Array<Texture>) {
        super(position);
        this.textures = textures;
    }

    public setDirection(direction: Vector2f): void {
        this.direction = direction;
    }

    public getTexture(camera: Camera): Texture {
        // TODO: move 1 / 0.3 somewhere else! maybe compute camera in world space lateron
        const objVec: Vector2f = this.position.mul(1 / 0.3).sub(camera.position);
        let spIndex: number = -Math.atan2(objVec.y, objVec.x) + Math.atan2(this.direction.y, this.direction.x);
        spIndex = (((spIndex / (Math.PI * 2) * 360) % 360) + 360) % 360;
        const texture: Texture = this.textures[Math.floor(spIndex / 360 * this.textures.length) % this.textures.length];
        return texture;
    }

    public getAlpha(): number {
        return 1.0;
    }

}
