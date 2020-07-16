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

	// Sound Manager
	private sm: SoundManager;

	// Beats per minute of your demo tune
	private BPM = 120;

	// The resolution between two beats, four is usually fine,- eight adds a bit more finer control
	private ROWS_PER_BEAT = 8;

	// we calculate this now, so we can translate between rows and seconds later on
	private ROW_RATE = this.BPM / 60 * this.ROWS_PER_BEAT;

	// Set to true when using *.rocket
	// set to false when using rocket editor using websocket
	private _demoMode = true;

	// scene variables | things you set through jsRocket
	private FOV = 50;
	private _cameraRotation;
	private _cameraDistance;
	private _clearR;
	private _clearG;
	private _clearB;
	private _fov;

	// the current row we're on
	private _row = 0;

	private tickerPointer = document.getElementById('ticker_pointer');

	// move
	private start: number;

	// move
	private texture4: Texture;

	// move
	private fpsStartTime: number = Date.now();
	private fpsCount: number = 0;
	private fps: number = 0;


	// effects
	private lensScene: LensScene;
	private sineScrollerScene: SineScrollerScene;
	private abscractCubeScene: AbstractCube;
	private metalHeadzScene: MetalHeadzScene

	public init(framebuffer: Framebuffer): Promise<any> {
		this.sm = new SoundManager();

		// Scene Playback Controls
		const tickerRef = document.getElementById('ticker');
		const tickerPlayRef = document.getElementById('ticker_play');
		const tickerPauseRef = document.getElementById('ticker_pause');

		// play
		tickerPlayRef.addEventListener('click', () => {
			this.onPlay();
		})

		// pause
		tickerPauseRef.addEventListener('click', () => {
			this.onPause();
		})

		// seek
		tickerRef.addEventListener('click', (e) => {
			const time = e.offsetX * this.sm._audio.duration / tickerRef.getBoundingClientRect().width;
			this.sm._audio.currentTime = time;

			// update rocket editor position to new timeline location
			if (!this._demoMode) {
				this.sm._syncDevice.update(this.sm._audio.currentTime * this.ROW_RATE);
			}
		});

		// Effects
		this.lensScene = new LensScene();
		this.sineScrollerScene = new SineScrollerScene();
		this.abscractCubeScene = new AbstractCube();
		this.metalHeadzScene = new MetalHeadzScene();

		return Promise.all([
			// load music
			// this.sm.playExtendedModule(require('../../assets/sound/dubmood_-_cromenu1_haschkaka.xm').default),
			// this.sm.playOgg(require('../../assets/sound/alpha_c_-_euh.ogg').default),
			this.prepareSync(),
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
		// const timeSeconds = this.sm.audioContext.currentTime;
		const timeSeconds = this.sm._audio.currentTime;
		const time: number = timeSeconds * 1000;

		this._row = timeSeconds * this.ROW_RATE;

		// update JS rocket
		if (this.sm._audio.paused === false) {
			// otherwise we may jump into a point in the audio where there's
			// no timeframe, resulting in Rocket setting row 2 and we report
			// row 1 back - thus Rocket spasming out

			// this informs Rocket where we are
			this.sm._syncDevice.update(this._row);
		}
		this.tickerPointer.style.left = (timeSeconds * 100 / this.sm._audio.duration) + '%';

		// empty the screen
		framebuffer.clearColorBuffer(0);
		// BEGIN DEMO ************************************

		// todo - use values from JS Rocket to determine which scene to show instead of time < 10
		switch (true) {
			// SCENE 1
			case (timeSeconds < 10):
				this.abscractCubeScene.render(framebuffer, time);
				break;
			// SCENE 2
			case timeSeconds < 15:
				this.abscractCubeScene.render(framebuffer, time);
				this.sineScrollerScene.render(framebuffer, time);
				framebuffer.fastFramebufferCopy(this.lensScene.textureBackground.texture, framebuffer.framebuffer);
				this.lensScene.render(framebuffer, time);
				break;
			// SCENE 2
			case timeSeconds < 20:
				this.metalHeadzScene.render(framebuffer, time);
				break;
			default:
				this.sineScrollerScene.render(framebuffer, time);
		}
		// END DEMO  ************************************

		this.drawStats(framebuffer, time);
	}

	// draw FPS and timestamps
	private drawStats(framebuffer: Framebuffer, time: number) {
		framebuffer.drawText(8, 18, 'FPS: ' + this.fps.toString(), this.texture4);
		framebuffer.drawText(8, 36, 'ROCKET TIME: ' + this.sm._audio.currentTime.toFixed(2), this.texture4);
		framebuffer.drawText(8, 36 + 18, 'ROTATION: ' + this._cameraRotation.getValue(this._row).toFixed(0), this.texture4);
	}

	prepareSync() {
		console.info('this._syncDevice', this.sm._syncDevice)

		if (this._demoMode) {
			this.sm._syncDevice.setConfig({
				'rocketXML': require('../../assets/sound/alpha_c_-_euh.rocket').default
			});
			this.sm._syncDevice.init('demo');

		} else {
			this.sm._syncDevice.init();
		};

		// XML file from JS Rocket library was loaded and parsed, make sure your ogg is ready
		this.sm._syncDevice.on('ready', () => this.onSyncReady());

		// [JS Rocket - Arrow keys] whenever you change the row, a value or interpolation mode this will get called
		this.sm._syncDevice.on('update', (newRow: number) => this.onSyncUpdate(newRow));

		// [JS Rocket - Spacebar] in Rocket calls one of those
		this.sm._syncDevice.on('play', () => this.onPlay());
		this.sm._syncDevice.on('pause', () => this.onPause());
	}

	onSyncReady() {
		console.info('onSyncReady', this.sm._syncDevice)
		this._clearR = this.sm._syncDevice.getTrack('clearR');
		this._clearG = this.sm._syncDevice.getTrack('clearG');
		this._clearB = this.sm._syncDevice.getTrack('clearB');
		this._cameraRotation = this.sm._syncDevice.getTrack('rotation');
		this._cameraDistance = this.sm._syncDevice.getTrack('distance');
		this._fov = this.sm._syncDevice.getTrack('FOV');

		this.prepareAudio();
	}

	prepareAudio() {
		console.info('prepareAudio');
		// this.sm.playExtendedModule(require('../../assets/sound/dubmood_-_cromenu1_haschkaka.xm').default);
		// this.sm.playOgg(require('../../assets/sound/alpha_c_-_euh.ogg').default);
		// this.sm.audioContext.createMediaElementSource(this._audio);

		// todo move this into an async loader
		this.sm._audio.src = require('../../assets/sound/alpha_c_-_euh.ogg').default;
		this.sm._audio.load();
		this.sm._audio.preload = 'true';
		this.sm._audio.loop = true;

		// debug - resume audio after reload
		this.sm._audio.addEventListener('canplay', () => this.onAudioReady());
	}

	onAudioReady() {
		// console.info('onAudioReady');
		if (this._demoMode) {
			this.sm._audio.play();
		};
	}

	// row is only given if you navigate, or change a value on the row in Rocket
	// on interpolation change (hit [i]) no row value is sent, as the current there is the upper row of your block
	onSyncUpdate(newRow: number) {
		// console.info('onSyncUpdate', newRow);
		if (!isNaN(newRow)) {
			this._row = newRow;
		}

		this.sm._audio.currentTime = newRow / this.ROW_RATE;
	}

	onPlay() {
		this.sm._audio.currentTime = this._row / this.ROW_RATE;
		this.sm._audio.play();
		console.log('[onPlay] time in seconds', this.sm._audio.currentTime);
	}

	onPause() {
		console.info('[onPause]');
		this._row = this.sm._audio.currentTime * this.ROW_RATE;
		this.sm._audio.pause();
	}

}
