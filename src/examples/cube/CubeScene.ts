import { Canvas } from '../../Canvas';
import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';

/**
 * TODO: extract lens into effect class
 */
export class CubeScene extends AbstractScene {

    private static BACKGROUND_COLOR: number = Color.BLACK.toPackedFormat();

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.setCullFace(CullFace.FRONT);
        return super.init(framebuffer);
    }

    public render(framebuffer: Framebuffer): void {
        framebuffer.clearColorBuffer(CubeScene.BACKGROUND_COLOR);
        framebuffer.shadingDemo(Date.now() * 0.02);
    }

}
