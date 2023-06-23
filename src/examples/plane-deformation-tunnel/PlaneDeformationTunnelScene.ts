import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { ScaleClipBlitter } from '../../blitter/ScaleClipBlitter';
import { PlaneDeformationScene } from '../plane-deformation/PlaneDeformationScene';
import { Interpolator } from '../../math/Interpolator';

export class PlaneDeformationTunnelScene extends AbstractScene {

    private hoodlumLogo: Texture;
    private scaleClipBlitter: ScaleClipBlitter;
    public PlaneDeformationScene: PlaneDeformationScene;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.scaleClipBlitter = new ScaleClipBlitter(framebuffer);
        this.PlaneDeformationScene = new PlaneDeformationScene(3, require('../../assets/textures/checker.png'));

        return Promise.all([

            TextureUtils.load(require('../../assets/hoodlumLogo.png'), true).then(
                (texture: Texture) => this.hoodlumLogo = texture
            ),
            this.PlaneDeformationScene.init(framebuffer),
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.PlaneDeformationScene.render(framebuffer, time);

        const ukBasslineBpm = 140;
        const ukBasslineClapMs = 60000 / ukBasslineBpm * 2;
        const smashTime = time % ukBasslineClapMs;
        const smash = (Interpolator.cosineInterpolate(0, 15, smashTime) -
        Interpolator.cosineInterpolate(15, 200, smashTime) +
            0.4 * Interpolator.cosineInterpolate(200, 300, smashTime) -
            0.4 * Interpolator.cosineInterpolate(300, 400, smashTime)) * 35;
        this.scaleClipBlitter.drawScaledTextureClip((framebuffer.width / 2 - (this.hoodlumLogo.width + smash) / 2) | 0,
            (framebuffer.height / 2 - (this.hoodlumLogo.height - smash) / 2) | 0, this.hoodlumLogo.width + smash, (this.hoodlumLogo.height - smash) | 0, this.hoodlumLogo, 1.0);
    }

}
