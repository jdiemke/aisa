import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { SoundManager } from '../../sound/SoundManager';
// import { JSRocket } from '../../sound/JSRocket';

// Effects
import { LensScene } from '../lens/LensScene';
import { SineScrollerScene } from '../sine-scroller/SineScrollerScene';
import { AbstractCube } from '../abstract-cube/AbstractCube';
import { MetalHeadzScene } from '../metalheadz/MetalHeadzScene';

export class MiscScene extends AbstractScene {

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

		// JS Rocket
		// this._audio = new Audio();
		// this._syncDevice = new JSRocket().SyncDevice();
		// this.prepareSync();

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

	// todo: JSRocket move to soundManager
	// https://hernan.de/outer-realm/
	// http://embed.plnkr.co/uQO1MTeCLIoVLYbo0zim
	/*
	// Begin JSRocket stuff
	private _audio;
	private BPM = 120;
	private ROWS_PER_BEAT = 8;
	private ROW_RATE = this.BPM / 60 * this.ROWS_PER_BEAT;
	private _demoMode = true; // Set to true for preview
	private _syncDevice;

	// scene variables | things you set through jsRocket
	private FOV = 50;
	private _cameraRotation = 45;
	private _cameraDistance = 400;
	private _clearR = 51;
	private _clearG = 41;
	private _clearB = 44;
	private _fov = this.FOV;
	private _row = 0;
	private _previousIntRow;
	// End JSRocket stuff

	prepareSync() {
		if (this._demoMode) {
			this._syncDevice.setConfig({
				'rocketXML':
					'./src/assets/sound/alpha_c_-_euh.rocket'
			});
			this._syncDevice.init('demo');
		} else {
			this._syncDevice.init();
		}

		this._syncDevice.on('ready', this.onSyncReady);
		this._syncDevice.on('update', this.onSyncUpdate);
		this._syncDevice.on('play', this.onPlay);
		// this._syncDevice.on('pause', this.onPause);
	}

	onSyncReady() {
		this._clearR = this._syncDevice.getTrack('clearR');
		this._clearG = this._syncDevice.getTrack('clearG');
		this._clearB = this._syncDevice.getTrack('clearB');
		this._cameraRotation = this._syncDevice.getTrack('rotation');
		this._cameraDistance = this._syncDevice.getTrack('distance');
		this._fov = this._syncDevice.getTrack('FOV');

		this.prepareSync();
	}

	prepareAudio() {
		this._audio.src = require('../../assets/sound/alpha_c_-_euh.ogg').default;
		this._audio.load();
		this._audio.preload = 'auto';
		this._audio.addEventListener('canplay', this.onAudioReady);
	}

	onAudioReady() {
		console.info('this._demoMode', this._demoMode)
		if (this._demoMode) {
			// render();
			this._audio.play();
		} else {
			// this._audio.pause();
			this._audio.currentTime = this._row / this.ROW_RATE;
		}
	}

	onSyncUpdate(row) {
		if (!isNaN(row)) {
			this._row = row;
			this._audio.currentTime = this._row / this.ROW_RATE;
		}
		// render();
	}

	onPlay() {
		this._audio.currentTime = this._row / this.ROW_RATE;
		this._audio.play();
		// render();
	}

	onPause() {
		this._row = this._audio.currentTime * this.ROW_RATE;
		// window.cancelAnimationFrame(render, document);
		this._audio.pause();
	}
*/
}
