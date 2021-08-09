import { Color } from '../../core/Color';
import { Framebuffer } from '../../Framebuffer';
import { Vector3f } from '../../math';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';

export class TextZoomerScene extends AbstractScene {


    private noise: Texture;
    private micro: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {


        return Promise.all([
            TextureUtils.load(require('../../assets/microstrange.png'), false).then(texture => this.micro = texture),
            TextureUtils.generateProceduralNoise().then(texture => this.noise = texture)
        ]);
    }


    public render(framebuffer: Framebuffer, time: number): void {
        framebuffer.clearColorBuffer(Color.BLACK.toPackedFormat());


        framebuffer.noise(time, this.noise, 0.3);





        time *= .3;

        const count = (time * 0.0018);
        const index =  (count |0) % 100;
        let scale = (count - (count | 0));
        const alpha = (framebuffer.cosineInterpolate(0, 0.2, scale)* (1-framebuffer.cosineInterpolate(0.8, 1.0, scale)))*0.75;
        scale = 1*3/(scale*50);
        const width = (this.micro.width * scale * 6) | 0;
        const height = (this.micro.height * scale * 6) | 0;
        const rng = new RandomNumberGenerator();
        rng.setSeed(22);
        const pos = [];
        for(let i=0; i < 100; i++) {
            pos.push({x:rng.getFloat(), y: rng.getFloat()});
        }

        const xpos = 20+(320-40) * pos[index].x;
        const ypos = 20+(200-40) * pos[index].y;
        framebuffer.drawScaledTextureClipBiAdd(
            Math.round(xpos - width / 2),
            Math.round(ypos - height / 2),
           width, height, this.micro, alpha);




    }

}
