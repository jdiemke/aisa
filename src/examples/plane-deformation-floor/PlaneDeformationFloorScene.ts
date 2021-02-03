import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { PlaneDeformationScene } from '../plane-deformation/PlaneDeformationScene';
import { FontRenderer } from '../sine-scroller/FontRenderer';

export class PlaneDeformationFloorScene extends AbstractScene {

    private hoodlumLogo: Texture;
    private fontRenderer2: FontRenderer;
    private startTime: number = Date.now();
    private PlaneDeformationFloorScene = new PlaneDeformationScene(8, require('../../assets/heightmap.png'));

    public init(framebuffer: Framebuffer): Promise<any> {

        const fonts2: string =
            ' !"    \'  ' +
            '  ,-. 0123' +
            '456789:; =' +
            ' ? ABCDEFG' +
            'HIJKLMNOPQ' +
            'RSTUVWXYZ ';
        this.fontRenderer2 = new FontRenderer(
            framebuffer,
            32, 32, fonts2,
            require('./../../assets/equinox.png')
        );

        return Promise.all([
            TextureUtils.load(require('../../assets/tristar.png'), true).then(
                (texture: Texture) => this.hoodlumLogo = texture
            ),
            this.fontRenderer2.init(),
            this.PlaneDeformationFloorScene.init(framebuffer)
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.PlaneDeformationFloorScene.drawPlaneDeformation(framebuffer, time >> 3, 0);
        this.fontRenderer2.drawText(framebuffer, 0, framebuffer.height - 32 - 16,
            '              WELCOME TO A NEW RELEASE FROM YOUR FRIENDS IN CRIME! HOW DO YOU LIKE THIS INTRO?'
            , (time - this.startTime) * 0.8, false);
        framebuffer.drawTexture((framebuffer.width/2)-(this.hoodlumLogo.width / 2), ((framebuffer.height / 2) - (this.hoodlumLogo.height / 2)) | 0, this.hoodlumLogo, 1.0);
    }

}
