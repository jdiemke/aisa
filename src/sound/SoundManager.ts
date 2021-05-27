import 'jsxm/xm';
import 'jsxm/xmeffects';
import './JSRocket';

type musicProperties = {
    // Beats per minute of your demo tune
    BPM: number;
    // The resolution between two beats, four is usually fine,- eight adds a bit more finer control
    ROWS_PER_BEAT: number;
    // we calculate this now, so we can translate between rows and seconds later on
    ROW_RATE: number;
    timeSeconds: number;
    timeMilliseconds: number;
    sceneData: sceneVariables;
}

// scene variables | things you set through jsRocket
type sceneVariables = {
    cameraRotation: number;
    cameraDistance: number;
    effect: number;
    transition: number;
    snare: number;
    bass: number;
    fov: number;
}

type sceneData = {
    cameraRotation: any;
    cameraDistance: any;
    effect: any;
    transition: any;
    snare: any;
    bass: any;
    fov: any;
}

export class SoundManager {

    public audioContext: AudioContext;
    public songLengthSeconds: number;

    public _syncDevice;
    public _audio = new Audio();
    public isPlaying = false;

    // use true for release mode
    public _demoMode = true;

    // the current row we're on
    public _row = 0;

    //  container for audio values to be used by effects (time, bass, effect, transitions)
    public musicProperties: musicProperties;
    public sceneData: sceneData;

    public constructor() {

        // Initialize JS Rocket
        this._syncDevice = new JSRocket.SyncDevice();
        this._syncDevice.connected = false;

        this.musicProperties = {
            BPM: 0,
            ROWS_PER_BEAT: 0,
            ROW_RATE: 0,
            timeSeconds: 0,
            timeMilliseconds: 0,
            sceneData: {
                cameraRotation: 0,
                cameraDistance: 0,
                effect: 0,
                transition: 0,
                snare: 0,
                bass: 0,
                fov: 0
            }
        }

        this.sceneData = {
            cameraRotation: null,
            cameraDistance: null,
            effect: null,
            transition: null,
            snare: null,
            bass: null,
            fov: null
        }
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
        this.musicProperties.BPM = 120;
        this.musicProperties.ROWS_PER_BEAT = 8;
        this.musicProperties.ROW_RATE = this.musicProperties.BPM / 60 * this.musicProperties.ROWS_PER_BEAT;

        this._syncDevice.connected = true;

        this.sceneData.effect = this._syncDevice.getTrack('effect');
        this.sceneData.snare = this._syncDevice.getTrack('snare');
        this.sceneData.bass = this._syncDevice.getTrack('bass');
        this.sceneData.cameraRotation = this._syncDevice.getTrack('rotation');
        this.sceneData.cameraDistance = this._syncDevice.getTrack('distance');
        this.sceneData.fov = this._syncDevice.getTrack('FOV');
        this.sceneData.transition = this._syncDevice.getTrack('transition');


        this._audio.onpause = () => {
            this.isPlaying =  false;
        };

        this._audio.onplay = () => {
            this.isPlaying =  true;
        }

    }

    // row is only given if you navigate, or change a value on the row in Rocket
    // on interpolation change (hit [i]) no row value is sent, as the current there is the upper row of your block
    onSyncUpdate(newRow: number) {
        if (!isNaN(newRow)) {
            this._row = newRow;
        }
        this._audio.currentTime = newRow / this.musicProperties.ROW_RATE;
    }


    updateMusic() {
        // show message if rocket app is not running in background
        if (!this._syncDevice.connected && !this._demoMode) {
            return;
        }

        // update music properties
        this.musicProperties.timeSeconds = this._audio.currentTime;
        this.musicProperties.timeMilliseconds = this.musicProperties.timeSeconds * 1000;
        this._row = this.musicProperties.timeSeconds * this.musicProperties.ROW_RATE;

        this.musicProperties.sceneData = {
            cameraRotation: this.sceneData.cameraRotation.getValue(this._row),
            cameraDistance: this.sceneData.cameraDistance.getValue(this._row),
            effect: this.sceneData.effect.getValue(this._row),
            transition: this.sceneData.transition.getValue(this._row),
            snare: this.sceneData.snare.getValue(this._row),
            bass: this.sceneData.bass.getValue(this._row),
            fov: this.sceneData.fov.getValue(this._row)
        }

        // update JS rocket
        if (this._audio.paused === false) {
            // otherwise we may jump into a point in the audio where there's
            // no timeframe, resulting in Rocket setting row 2 and we report
            // row 1 back - thus Rocket spasming out

            // this informs Rocket where we are
            this._syncDevice.update(this._row);
        }
    }


    onPlay() {
        console.log('[onPlay]');
        this._audio.currentTime = this._row / this.musicProperties.ROW_RATE;

        console.info('this._audio.paused', this._audio.paused)



        
        if ( !this.isPlaying) {

            let playPromise = this._audio.play();

            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    // Automatic playback started!
                    // Show playing UI.
                    // We can now safely pause video...
                    //this._audio.play();
                    this.isPlaying = true;
                })
                    .catch(error => {
                        // Auto-play was prevented
                        // Show paused UI.
                    });
            }
        }

    }

    

    onPause() {
        console.info('[onPause]');
        this._row = this._audio.currentTime * this.musicProperties.ROW_RATE;

        if (!this._audio.paused && this.isPlaying) {
            this._audio.pause();
        }
    }

}
