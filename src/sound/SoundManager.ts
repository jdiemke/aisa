import 'jsxm/xm';
import 'jsxm/xmeffects';
// import { JSRocket } from '../../sound/JSRocket';

export class SoundManager {

	public audioContext: AudioContext;
	public songLengthSeconds: number;

	public constructor() {
		XMPlayer.init();

		this.audioContext = XMPlayer.audioctx;

		// JS Rocket
		// this._audio = new Audio();
		// this._syncDevice = new JSRocket().SyncDevice();
		// this.prepareSync();

		// JS Doc Controls
		const tickerRef = document.getElementById('ticker');
		const tickerPlayRef = document.getElementById('ticker_play');
		const tickerPauseRef = document.getElementById('ticker_pause');

		// play
		tickerPlayRef.addEventListener('click', () => {
			this.audioContext.resume();
		})

		// pause
		tickerPauseRef.addEventListener('click', () => {
			this.audioContext.suspend();
		})

		// seek
		tickerRef.addEventListener('click', (e) => {
			/*
			var time = e.layerX * song.duration() / tickerRef.getBoundingClientRect().width;
			song.seek(time);
			if (song.isPaused()) {
				pauseAnimation();
				playAnimation();
				pauseAnimation();
			}
			*/
		});

	}

	public playExtendedModule(filename: string): Promise<void> {
		return fetch(filename)
			.then((response: Response) => response.arrayBuffer())
			.then((arrayBuffer: ArrayBuffer) => {
				if (arrayBuffer) {
					XMPlayer.load(arrayBuffer);
					XMPlayer.play();
				} else {
					console.log('unable to load', filename);
				}
			});
	}

	public playOgg(filename: string): Promise<void> {
		return fetch(filename)
			.then((response: Response) => response.arrayBuffer())
			.then((arrayBuffer: ArrayBuffer) => {
				if (arrayBuffer) {
					this.audioContext.decodeAudioData(arrayBuffer,
						(buffer) => {
							const sourceBuffer = this.audioContext.createBufferSource();
							console.info('ogg create buffer');
							sourceBuffer.buffer = buffer;
							sourceBuffer.connect(this.audioContext.destination);
							console.info('ogg connect');
							sourceBuffer.loop = true;
							sourceBuffer.start(this.audioContext.currentTime);
							console.info('ogg ready');
						})
				} else {
					console.log('unable to load', filename);
				}
			});
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
