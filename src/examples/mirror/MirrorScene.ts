import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { CubeScene } from '../cube/CubeScene';

export class MirrorScene extends AbstractScene {

    private hoodlumLogo: Texture;
    private blurred: Texture;
    private cross: Texture;
    private micro: Texture;
    private noise: Texture;
    private atlantisBackground: Texture;
    private startTime: number;
    private scene: CubeScene;

    private accumulationBuffer: Uint32Array;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.accumulationBuffer = new Uint32Array(framebuffer.width * framebuffer.height);
        this.startTime = Date.now();
        this.scene = new CubeScene();
        return Promise.all([
            this.scene.init(framebuffer),
            TextureUtils.load(require('../../assets/atlantis.png'), false).then(
                (texture: Texture) => this.atlantisBackground = texture
            ),
            TextureUtils.load(require('../../assets/hoodlumLogo.png'), true).then(
                (texture: Texture) => this.hoodlumLogo = texture
            ),
            TextureUtils.generateProceduralNoise().then(texture => this.noise = texture),
            TextureUtils.load(require('../../assets/blurredBackground.png'), false).then(texture => this.blurred = texture),
            TextureUtils.load(require('../../assets/cross.png'), true).then(texture => this.cross = texture),
            TextureUtils.load(require('../../assets/microstrange.png'), false).then(texture => this.micro = texture),
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {

        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.atlantisBackground.texture);

        
            framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);
            framebuffer.setCullFace(CullFace.BACK);

            
            this.scene.render(framebuffer, time);
    
    
            let source: number = 0;
            let dest: number = 319;
            for (let y: number = 0; y < 100; y++) {
                for (let x: number = 0; x < 160; x++) {
                   framebuffer.framebuffer[dest--] = framebuffer.framebuffer[source++];
                }
                source += 160;
                dest += 320 + 160;
            }
    
            const type = ((time / 1000)| 0) % 2;
            if (type == 0) {

            source = 0;
            dest = 199 * 320;
            for (let y: number = 0; y < 100; y++) {
                for (let x: number = 0; x < 320; x++) {
                    framebuffer.framebuffer[dest++] = framebuffer.framebuffer[source++];
                }
                dest -= 320 * 2;
            }
        } else {
            let source: number = 0;
            let dest: number = 319;
            for (let y: number = 0; y < 200; y++) {
                for (let x: number = 0; x < 160; x++) {
                    framebuffer.framebuffer[dest--] = framebuffer.framebuffer[source++];
                }
                source += 160;
                dest += 320 + 160;
            }
        }
    
            /*
            let tmpGlitch = new Uint32Array(320 * 200);
            framebuffer.fastFramebufferCopy(tmpGlitch, framebuffer.framebuffer);
    
            let texture = new Texture();
            texture.texture = tmpGlitch;
            texture.width = 320;
            texture.height = 200;
    
            const ukBasslineBpm = 140;
            const ukBasslineClapMs = 60000 / ukBasslineBpm * 2;
            const smashTime = (Date.now() - this.start) % ukBasslineClapMs;
            const smash = (framebuffer.cosineInterpolate(0, 20, smashTime) -
                framebuffer.cosineInterpolate(20, 300, smashTime)) * 35;
            let width = Math.round(320 + smash * 320 / 50);
            let height = Math.round(200 + smash * 200 / 50);
    
            framebuffer.drawScaledTextureClipBi(
                Math.round(320 / 2 - width / 2),
                Math.round(200 / 2 - height / 2),
                width, height, texture, 1.0);
    
                */
            for (let y = 0; y < 3; y++) {
                for (let x = 0; x < 4; x++) {
                    const xx = Math.round(320 / 4 * x + 320 / 4 * 0.5 - this.cross.width / 2);
                    const yy = Math.round(200 / 3 * y + 200 / 3 * 0.5 - this.cross.height / 2);
    
                    framebuffer.drawTexture(xx, yy, this.cross, 0.45);
                }
            }
    

            framebuffer.drawScaledTextureClipBiAdd(
                320 - (((time * 0.09) | 0) % (this.micro.width * 2 + 320)),
                200 / 2 - 20,
                this.micro.width * 2, this.micro.height * 2, this.micro,1);
    
            framebuffer.drawScaledTextureClipBiAdd(
                320 - (((time * 0.05) | 0) % (this.micro.width + 320)),
                200 / 2 - 60,
                this.micro.width, this.micro.height, this.micro,1);
    

            framebuffer.noise(time, this.noise);

    }
}
