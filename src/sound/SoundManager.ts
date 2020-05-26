import 'jsxm/xm';
import 'jsxm/xmeffects';

export class SoundManager {

	public audioContext: AudioContext;
	public songLengthSeconds: number;

	public constructor() {
		XMPlayer.init();

		this.audioContext = XMPlayer.audioctx;

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
}
