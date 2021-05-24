import 'jsxm/xm';
import 'jsxm/xmeffects';
import './JSRocket';

interface musicProperties {
    color?: string;
    width?: number;
}

export class SoundManager {

    public audioContext: AudioContext;
    public songLengthSeconds: number;

    public _syncDevice;
    public _audio = new Audio();


    // Beats per minute of your demo tune
    private BPM = 120;

    // The resolution between two beats, four is usually fine,- eight adds a bit more finer control
    public ROWS_PER_BEAT = 8;

    // we calculate this now, so we can translate between rows and seconds later on
    public ROW_RATE = this.BPM / 60 * this.ROWS_PER_BEAT;

    // scene variables | things you set through jsRocket
    public FOV = 50;
    public _cameraRotation;
    public _cameraDistance;
    public _effect;
    public _transition;
    public _snare;
    public _bass;
    public _fov;


    // use true for release mode
    public _demoMode = true;


    // the current row we're on
    public _row = 0;

    public constructor() {
        // Initialize JS Rocket
        this._syncDevice = new JSRocket.SyncDevice();
        this._syncDevice.connected = false;
    }

    public playExtendedModule(filename: string): Promise<void> {
        return fetch(filename)
            .then((response: Response) => response.arrayBuffer())
            .then((arrayBuffer: ArrayBuffer) => {
                if (arrayBuffer) {
                    XMPlayer.init();
                    XMPlayer.load(arrayBuffer);
                    XMPlayer.play();
                } else {
                    console.log('unable to load', filename);
                }
            });
    }

    // Initialize XM Player
    public initXM() {
        XMPlayer.init();
        this.audioContext = XMPlayer.audioctx;
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
                this._audio.autoplay = false;
            })
    }

    prepareSync(filename: string, demoMode: boolean): Promise<void> {
        this._demoMode = demoMode;
        return new Promise((resolve) => {
            if (this._demoMode) {
                this._syncDevice.setConfig({
                    'rocketXML': filename
                });
                this._syncDevice.init('demo');

            } else {
                this._syncDevice.init();
            };

            // XML file from JS Rocket library was loaded and parsed, make sure your ogg is ready
            this._syncDevice.on('ready', () => this.onSyncReady());

            // [JS Rocket - Arrow keys] whenever you change the row, a value or interpolation mode this will get called
            this._syncDevice.on('update', (newRow: number) => this.onSyncUpdate(newRow));

            // [JS Rocket - Spacebar] in Rocket calls one of those
            this._syncDevice.on('play', () => this.onPlay());
            this._syncDevice.on('pause', () => this.onPause());
            resolve()
        });
    }

    onSyncReady() {
        this._syncDevice.connected = true;
        this._effect = this._syncDevice.getTrack('effect');
        this._snare = this._syncDevice.getTrack('snare');
        this._bass = this._syncDevice.getTrack('bass');
        this._cameraRotation = this._syncDevice.getTrack('rotation');
        this._cameraDistance = this._syncDevice.getTrack('distance');
        this._fov = this._syncDevice.getTrack('FOV');
        this._transition = this._syncDevice.getTrack('transition');
    }

    // row is only given if you navigate, or change a value on the row in Rocket
    // on interpolation change (hit [i]) no row value is sent, as the current there is the upper row of your block
    onSyncUpdate(newRow: number) {
        if (!isNaN(newRow)) {
            this._row = newRow;
        }
        this._audio.currentTime = newRow / this.ROW_RATE;
    }

    onPlay() {
        console.log('[onPlay]');
        this._audio.currentTime = this._row / this.ROW_RATE;
        this._audio.play();
    }

    onPause() {
        console.info('[onPause]');
        this._row = this._audio.currentTime * this.ROW_RATE;
        this._audio.pause();
    }

}
