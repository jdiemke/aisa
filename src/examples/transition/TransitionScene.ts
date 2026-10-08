import { Framebuffer } from '../../Framebuffer';
import { Transition } from '../../effects/transition/Transition';
import { TransitionMethods } from '../../effects/transition/TransitionMethods';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';

const TRANSITION_DURATION_MS = 2400;
const TRANSITION_HOLD_MS = 500;
const TRANSITION_TYPES = [
    TransitionMethods.FADEIN,
    TransitionMethods.BLOCKFADE,
    TransitionMethods.CROSSFADE,
    TransitionMethods.CIRCLE,
    TransitionMethods.WIPE_HORIZONTAL,
    TransitionMethods.WIPE_VERTICAL,
    TransitionMethods.DISSOLVE,
    TransitionMethods.FADEOUT
];

export class TransitionScene extends AbstractScene {

    private transition = new Transition();
    private fontTexture: Texture;
    private startTime: number;
    private readonly scenes: ImageScene[] = [];

    public init(framebuffer: Framebuffer): Promise<any> {
        return Promise.all([
            this.transition.init(framebuffer),
            TextureUtils.load(require('@assets/fonts/font.png'), true).then(
                texture => this.fontTexture = texture
            ),
            TextureUtils.load(require('@assets/eye-background.png'), false).then(
                texture => this.scenes[0] = new ImageScene(texture)
            ),
            TextureUtils.load(require('@assets/psychadelic.png'), false).then(
                texture => this.scenes[1] = new ImageScene(texture)
            ),
        ]).then(() => {
            this.startTime = Date.now();
        });
    }

    public render(framebuffer: Framebuffer): void {
        const elapsed = Date.now() - this.startTime;
        const cycleDuration = TRANSITION_DURATION_MS + TRANSITION_HOLD_MS;
        const cycleIndex = Math.floor(elapsed / cycleDuration);
        const cycleTime = elapsed % cycleDuration;
        const transitionIndex = cycleIndex % TRANSITION_TYPES.length;
        const transitionType = TRANSITION_TYPES[transitionIndex];
        const progress = Math.min(cycleTime / TRANSITION_DURATION_MS, 1);
        const transitionValue = Math.round(progress * 255);
        const loopStartScene = Math.floor(cycleIndex / TRANSITION_TYPES.length) % this.scenes.length;
        const fromSceneIndex = transitionIndex === 0 || transitionIndex % 2 === 1
            ? loopStartScene
            : (loopStartScene + 1) % this.scenes.length;
        const fromScene = this.scenes[fromSceneIndex];
        const toScene = this.scenes[(fromSceneIndex + 1) % this.scenes.length];

        this.transition.render(framebuffer, fromScene, toScene, cycleTime, {
            transitionType,
            transitionValue,
        });

        const transitionName = TransitionMethods[transitionType].replace('_', ' ');
        framebuffer.drawText(8, 8, transitionName, this.fontTexture);
    }

}

class ImageScene extends AbstractScene {

    constructor(private texture: Texture) {
        super();
    }

    public render(framebuffer: Framebuffer): void {
        framebuffer.drawTextureRectNoAlpha(
            0,
            0,
            0,
            0,
            this.texture.width,
            this.texture.height,
            this.texture
        );
    }

}