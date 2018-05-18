import { Framebuffer } from './Framebuffer';
import { Matrix4f } from './math';
import { Texture, TextureUtils } from './texture';

export class SkyBox {

    // TODO: make single textures
    private skybox: {
        back?: Texture,
        down?: Texture,
        front?: Texture,
        left?: Texture,
        right?: Texture,
        up?: Texture
    } = {};

    // move code from framebuffer into draw method!
    public draw(framebuffer: Framebuffer, mv: Matrix4f): void {
        framebuffer.drawSkyBox(mv.getRotation(), this.skybox);
    }

    public init(): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('./assets/skybox/skybox_back.png'), false).then(
                (texture: Texture) => this.skybox.back = texture
            ),
            TextureUtils.load(require('./assets/skybox/skybox_down.png'), false).then(
                (texture: Texture) => this.skybox.down = texture
            ),
            TextureUtils.load(require('./assets/skybox/skybox_front.png'), false).then(
                (texture: Texture) => this.skybox.front = texture
            ),
            TextureUtils.load(require('./assets/skybox/skybox_left.png'), false).then(
                (texture: Texture) => this.skybox.left = texture
            ),
            TextureUtils.load(require('./assets/skybox/skybox_right.png'), false).then(
                (texture: Texture) => this.skybox.right = texture
            ),
            TextureUtils.load(require('./assets/skybox/skybox_up.png'), false).then(
                (texture: Texture) => this.skybox.up = texture
            )]);
    }

}
