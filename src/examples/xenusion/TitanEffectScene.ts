import { Color } from '../../core/Color';
import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';

export class TitanEffectScene extends AbstractScene {


    private BG_sky: Texture;
    private BG_city: Texture;
    private BG_dirt1: Texture;
    private BG_dirt2: Texture;
    private BG_dirt3: Texture;
    private BG_road: Texture;
    private AR_oldhouse: Texture;
    private AR_grill: Texture;

    private PR_tree1: Texture;
    private PR_tree2 : Texture;
    private PR_lamp : Texture;

    private texture4 : Texture;
    public init(framebuffer: Framebuffer): Promise<any> {

        return Promise.all([
            TextureUtils.load(require('../../assets/font.png'), true).then(
                (texture: Texture) => this.texture4 = texture
            ),
            TextureUtils.load(require('../../assets/xenusion/BG_sky.png'), true).then(
                (texture: Texture) => this.BG_sky = texture
            ),
            TextureUtils.load(require('../../assets/xenusion/BG_city.png'), true).then(
                (texture: Texture) => this.BG_city = texture
            ),
            TextureUtils.load(require('../../assets/xenusion/BG_dirt1.png'), true).then(
                (texture: Texture) => this.BG_dirt1 = texture
            ),
            TextureUtils.load(require('../../assets/xenusion/BG_dirt2.png'), true).then(
                (texture: Texture) => this.BG_dirt2 = texture
            ),
            TextureUtils.load(require('../../assets/xenusion/BG_dirt3.png'), true).then(
                (texture: Texture) => this.BG_dirt3 = texture
            ),
            TextureUtils.load(require('../../assets/xenusion/BG_road.png'), true).then(
                (texture: Texture) => this.BG_road = texture
            ),
            TextureUtils.load(require('../../assets/xenusion/AR_oldhouse.png'), true).then(
                (texture: Texture) => this.AR_oldhouse = texture
            ),
            TextureUtils.load(require('../../assets/xenusion/AR_grill.png'), true).then(
                (texture: Texture) => this.AR_grill = texture
            ),
            TextureUtils.load(require('../../assets/xenusion/PR_tree1.png'), true).then(
                (texture: Texture) => this.PR_tree1 = texture
            ),
            TextureUtils.load(require('../../assets/xenusion/PR_tree2.png'), true).then(
                (texture: Texture) => this.PR_tree2 = texture
            ),
            TextureUtils.load(require('../../assets/xenusion/PR_lamp.png'), true).then(
                (texture: Texture) => this.PR_lamp = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        framebuffer.clearColorBuffer(Color.RED.toPackedFormat());

        const mySpeed = 0.24 ;
        const data = [
            {
                image: this.BG_sky,
                layerWidth: 600,
                positionY: 0,
                positionX: 0,
                speed: mySpeed * 0.8 * 0.8 *0.8 * 0.8 * 0.8 * 0.8,
            },
            {
                image: this.BG_city,
                layerWidth: 600,
                positionY: 109 - this.BG_city.height,
                positionX: 0,
                speed:  mySpeed * 0.8 * 0.8 *0.8 * 0.8 * 0.8,
            },
            {
                image: this.BG_dirt1,
                layerWidth: 600,
                positionY: 137 - this.BG_dirt1.height,
                positionX: 0,
                speed:  mySpeed * 0.8 * 0.8 *0.8 * 0.8,
            },
            {
                image: this.BG_dirt2,
                layerWidth: 600,
                positionY: 155 - this.BG_dirt2.height,
                positionX: 0,
                speed:  mySpeed * 0.8 * 0.8 * 0.8,
            },
            {
                image: this.BG_dirt3,
                layerWidth: 600,
                positionY: 177 - this.BG_dirt3.height,
                positionX: 0,
                speed:  mySpeed * 0.8 * 0.8,
            },
            {
                image: this.BG_road,
                layerWidth: 600,
                positionY: 200 - this.BG_road.height,
                positionX: 0,
                speed: mySpeed * 0.8,
            },
            {
                image: this.PR_tree1,
                layerWidth: 600,
                positionY: 163 - this.PR_tree1.height,
                positionX: 253,
                speed: mySpeed * 0.8 * 0.8,
            },
            {
                image: this.PR_tree2,
                layerWidth: 601,
                positionY: 160 - this.PR_tree2.height,
                positionX: 7,
                speed: mySpeed * 0.8 * 0.8,
            },
            {
                image: this.PR_tree2,
                layerWidth: 600,
                positionY: 158 - this.PR_tree2.height,
                positionX: 245,
                speed: mySpeed * 0.8 * 0.8,
            },
            {
                image: this.PR_tree2,
                layerWidth: 600,
                positionY: 158 - this.PR_tree2.height,
                positionX: 347,
                speed: mySpeed * 0.8 * 0.8,
            },
            {
                image: this.AR_oldhouse,
                layerWidth: 600,
                positionY: 176 - this.AR_oldhouse.height,
                positionX: 52,
                speed: mySpeed * 0.8 * 0.8,
            },

            {
                image: this.AR_grill,
                layerWidth: 600,
                positionY: 176 - this.AR_grill.height,
                positionX: 312,
                speed: mySpeed * 0.8 * 0.8,
            },
            {
                image: this.PR_lamp,
                layerWidth: 228,
                positionY: 177 - this.PR_lamp.height,
                positionX: 7,
                speed: mySpeed * 0.8 ,
            },
           {
                image: this.PR_lamp,
                layerWidth: 228,
                positionY: 177 - this.PR_lamp.height,
                positionX: 235,
                speed: mySpeed * 0.8 ,
            }
        ];



        data.forEach(layer => {
            const disp =  time*layer.speed;
            framebuffer.drawTexture((0 - (disp % layer.layerWidth)+layer.positionX)|0,layer.positionY,  layer.image, 1);
            framebuffer.drawTexture((layer.layerWidth - (disp % layer.layerWidth)+layer.positionX)|0,layer.positionY, layer.image, 1);
        });

        this.cinematicScroller(framebuffer, this.texture4, time);

    }

    public cinematicScroller(framebuffer: Framebuffer, texture: Texture, time: number): void {
        const scrollText: Array<string> = [
            '', '', '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '', '', '',
            '', '', '', '', '',
            'YOU HAVE BEEN WATCHING',
            '',
            'D A R K   M A T T E R',
            '',
            'A JAVASCRIPT DEMO MADE FOR',
            'NORDLICHT 2018',
            '',
            'CREDITS',
            '',
            'CODE BY',
            'TRIGGER',
            '',
            'GRAFICS BY',
            'PREMIUM',
            '',
            'MUSIC BY',
            'VIRGILL'
        ];
        time = time * 0.8;

        const scrollerOffset = Math.round(framebuffer.interpolate(0, 250, time & 0xff) * 8);

        for (let i = 1; i < framebuffer.height / 8; i++) {
            const text = scrollText[Math.floor((i + (time / 256))) % scrollText.length];
            const x = (framebuffer.width / 2 - text.length * 8 / 2) | 0;
            const y = 8 * i - scrollerOffset;
            // TODO: proper text clipping to rect
            // maybe just for first and last row
            framebuffer.drawText(x, y, text, texture);
        }
    }


}
