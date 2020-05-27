import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { SoundManager } from '../../sound/SoundManager';

// Effects
import { LensScene } from '../lens/LensScene';
import { SineScrollerScene } from '../sine-scroller/SineScrollerScene';
import { AbstractCube } from '../abstract-cube/AbstractCube';
import { MetalHeadzScene } from '../metalheadz/MetalHeadzScene';

export class DemoScene extends AbstractScene {

	// move
	private start: number;

	// move
	private texture4: Texture;

	// move
	private fpsStartTime: number = Date.now();
	private fpsCount: number = 0;
	private fps: number = 0;

	// sound
	private sm: SoundManager;

	// effects
	private lensScene: LensScene;
	private sineScrollerScene: SineScrollerScene;
	private abscractCubeScene: AbstractCube;
	private metalHeadzScene: MetalHeadzScene

	public init(framebuffer: Framebuffer): Promise<any> {
		this.sm = new SoundManager();

		// Effects
		this.lensScene = new LensScene();
		this.sineScrollerScene = new SineScrollerScene();
		this.abscractCubeScene = new AbstractCube();
		this.metalHeadzScene = new MetalHeadzScene();

		return Promise.all([
			// load music
			this.sm.playExtendedModule(require('../../assets/sound/dubmood_-_cromenu1_haschkaka.xm').default),
			// this.sm.playOgg(require('../../assets/sound/xmix_q2_final.ogg').default),

			// initialize effects
			this.abscractCubeScene.init(framebuffer),
			this.lensScene.init(framebuffer),
			this.sineScrollerScene.init(framebuffer),
			this.metalHeadzScene.init(framebuffer),


			TextureUtils.load(require('../../assets/font.png'), true).then(
				(texture: Texture) => this.texture4 = texture),
		]).then(() => {
			this.start = Date.now();
		});
	}

	public render(framebuffer: Framebuffer): void {
		const currentTime: number = Date.now();

		if (currentTime > this.fpsStartTime + 1000) {
			this.fpsStartTime = currentTime;
			this.fps = this.fpsCount;
			this.fpsCount = 0;
		}
		this.fpsCount++;

		// use audio time otherwise use date
		// const time: number = (Date.now() - this.start);
		const timeSeconds = this.sm.audioContext.currentTime;
		const time: number = timeSeconds * 1000;

		// empty the screen
		framebuffer.clearColorBuffer(0);
		// BEGIN DEMO ************************************

		// seconds
		switch (true) {
			// SCENE 1
			case (timeSeconds < 10):
				this.sineScrollerScene.render(framebuffer, time);
				framebuffer.fastFramebufferCopy(this.lensScene.textureBackground.texture, framebuffer.framebuffer);
				this.lensScene.render(framebuffer, time);
				break;
			// SCENE 2
			case timeSeconds < 15:
				this.abscractCubeScene.render(framebuffer, time);
				// code block
				break;
			// SCENE 2
			case timeSeconds < 20:
				this.metalHeadzScene.render(framebuffer, time);
				// code block
				break;
			default:
				this.sineScrollerScene.render(framebuffer, time);


			// code block
		}
		// END DEMO  ************************************

		this.drawStats(framebuffer, time);
	}

	// draw FPS and timestamps
	private drawStats(framebuffer: Framebuffer, time: number) {
		framebuffer.drawText(8, 18, 'FPS: ' + this.fps.toString(), this.texture4);
		framebuffer.drawText(8, 36, 'AUDIO TIME: ' + (this.sm.audioContext.currentTime).toFixed(2), this.texture4);
	}

}
