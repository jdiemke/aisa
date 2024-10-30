import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';

interface IntensityFunction {
    (x: number, y: number, elapsedTime: number): number;
}

export class LedTunnelScene extends AbstractScene {

    private ledTexture: Texture;

    public init(): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('@assets/led.png'), false).then(
                (texture: Texture) => this.ledTexture = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        const functionList = [
            this.getIntensity,
            this.getIntensity2
        ];

        const index = ((time / 2000) | 0) % functionList.length;

        this.drawIntensityFuntion(framebuffer, time*2, this.ledTexture, functionList[index]);
    }

    public drawIntensityFuntion(framebuffer: Framebuffer, elapsedTime: number, texture: Texture,
            intensityFunction: IntensityFunction) {
        for (let y = 0; y < 25; y++) {
            for (let x = 0; x < 40; x++) {
                const intensity = intensityFunction(x ,y, elapsedTime);
                const textureIndex = ((intensity * 15) | 0) % 16;
                framebuffer.drawTextureRectNoAlpha(x * 8, y * 8, 0, 8 * textureIndex, 8, 8, texture);
            }
        }
    }

    /**
     * 
     * @param x 
     * @param y 
     * @param elapsedTime 
     * @returns A value between 0 and 1
     */
    public getIntensity(x: number, y: number, elapsedTime: number): number {
        const power = 2.0;
        const distance = Math.pow(Math.pow((x - 40 / 2.0) * (x - 40 / 2.0),power) + Math.pow((y - 25 / 2.0) * (y - 25 / 2.0),power),1/(2*power));
        const waveSum: number =  (Math.sin(distance+elapsedTime*0.005)+1)*0.5*(1-Math.min(distance*0.03, 1.0));
       
        return waveSum;
    }

    public getIntensity2(x: number, y: number, elapsedTime: number): number {
        const distance = 160 / (Math.sqrt((x - 40 / 2.0) * (x - 40 / 2.0) + (y - 25 / 2.0) * (y - 25 / 2.0)) * 1.4);
                
        const waveSum: number = (Math.sin(distance + elapsedTime * 0.005) + 1) * 0.5 * (1 - Math.min(distance * 0.003, 1.0));
               
        return waveSum;
    }

}
