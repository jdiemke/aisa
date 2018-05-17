import { Framebuffer } from './Framebuffer';
import { Matrix4f } from './math';
import Texture from './Texture';

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
        this.createTexture(require('./assets/skybox/skybox_back.png'), false).then(
            (texture: Texture) => this.skybox.back = texture
        ),
        this.createTexture(require('./assets/skybox/skybox_down.png'), false).then(
            (texture: Texture) => this.skybox.down = texture
        ),
        this.createTexture(require('./assets/skybox/skybox_front.png'), false).then(
            (texture: Texture) => this.skybox.front = texture
        ),
        this.createTexture(require('./assets/skybox/skybox_left.png'), false).then(
            (texture: Texture) => this.skybox.left = texture
        ),
        this.createTexture(require('./assets/skybox/skybox_right.png'), false).then(
            (texture: Texture) => this.skybox.right = texture
        ),
        this.createTexture(require('./assets/skybox/skybox_up.png'), false).then(
            (texture: Texture) => this.skybox.up = texture
        )]);
    }

    // TODO: make TextureUtils
    public createTexture(path: string, hasAlpha: boolean): Promise<Texture> {
        return new Promise<Texture>((resolve) => {
            const img = new Image();
            img.onload = () => {
                const texture = new Texture();
                texture.texture = this.getImageData(img, hasAlpha);
                texture.width = img.width;
                texture.height = img.height;
                resolve(texture);
            };
            img.onerror = () => resolve();
            img.src = path;
        });
    }

    getImageData(image: HTMLImageElement, withAlpha: boolean = false): Uint32Array {
        let canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        let context: CanvasRenderingContext2D = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        let data = context.getImageData(0, 0, image.width, image.height).data;
        let conv = new Uint32Array(data.length / 4);
        let c = 0;
        for (let i = 0; i < data.length; i += 4) {
            if (withAlpha) {
                conv[c] = (data[i + 3] << 24) | (data[i + 2] << 16) | (data[i + 1] << 8) | data[i + 0];
            } else {
                conv[c] = (255 << 24) | (data[i + 2] << 16) | (data[i + 1] << 8) | data[i + 0];
            }

            c++;
        }
        return conv;
    }

}
