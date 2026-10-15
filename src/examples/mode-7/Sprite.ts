import { Texture } from '@engine/texture';

export class Sprite {

    public constructor(public xp: number, public yp: number,
        public width: number, public height: number,
        public texture: Texture, public alphaBlend: number, public z: number, public priority: number) {

    }

}
