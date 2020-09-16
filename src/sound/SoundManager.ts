import 'jsxm/xm';
import 'jsxm/xmeffects';
import './JSRocket';

export class SoundManager {

    public audioContext: AudioContext;
    public songLengthSeconds: number;

    public _syncDevice = new JSRocket.SyncDevice();
    public _audio = new Audio();

    public constructor() {
        XMPlayer.init();

        this.audioContext = XMPlayer.audioctx;

        // Initialize JS Rocket
        this._syncDevice = new JSRocket.SyncDevice();
        this._syncDevice.connected = false;
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

    public loadOgg(filename: string): Promise<void> {
        return fetch(filename)
            .then((response: Response) => {
                this._audio.src = filename;
                this._audio.load();
                this._audio.preload = 'true';
                this._audio.loop = true;
            })
    }

}
