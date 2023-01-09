// import 'jsxm/xm';
// import 'jsxm/xmeffects';
import './JSRocket';

/*
import './cowbell/cowbell.min'
import './cowbell/openmpt.min'
*/

import './cowbell/cowbell'
import './cowbell/web_audio_player'
import './cowbell/openmpt/openmpt_player'
import './cowbell/ui/basic'


type musicProperties = {
    // Beats per minute of your demo tune
    BPM: number;
    // The resolution between two beats, four is usually fine,- eight adds a bit more finer control
    ROWS_PER_BEAT: number;
    // we calculate this now, so we can translate between rows and seconds later on
    ROW_RATE: number;
    timeSeconds: number;
    timeMilliseconds: number;
    sceneData: sceneData;
}

// scene variables | things you set through jsRocket
type sceneData = {
    effect: any;
    transitionType: any;
    transitionValue: any;
    snare: any;
    bass: any;
}

export class SoundManager {

    public audioContext: AudioContext;
    public songLengthSeconds: number;
    public syncDevice;
    public audio = new Audio();
    public isPlaying = false;
    public demoMode = true;    // use true for release mode
    public row = 0;    // the current row we're on

    //  container for audio values to be used by effects (time, bass, effect, transitions)
    public musicProperties: musicProperties;
    public sceneData: sceneData;

    public modPlayer;
    public player;
    public audioElement: HTMLAudioElement;
    public track;

    public constructor() {

        const container = document.getElementById('player');
        this.player = new Cowbell.UI.Basic(container);

        this.modPlayer = new Cowbell.Player.OpenMPT({
            'pathToLibOpenMPT': './openmpt/libopenmpt.js'
        })

        // Initialize JS Rocket
        this.syncDevice = new JSRocket.SyncDevice();
        this.syncDevice.connected = false;

        this.musicProperties = {
            BPM: 0,
            ROWS_PER_BEAT: 0,
            ROW_RATE: 0,
            timeSeconds: 0,
            timeMilliseconds: 0,
            sceneData: {
                effect: 0,
                transitionType: 0,
                transitionValue: 0,
                snare: 0,
                bass: 0
            }
        }

        this.sceneData = {
            effect: null,
            transitionType: null,
            transitionValue: null,
            snare: null,
            bass: null,
        }
    }
    /**
     * Load and play module music tracker files
     *
     * @param {string} filename      module file to load
     * @returns {Promise<Response>}  fetch response
     */
    public playExtendedModule(filename: string): Promise<void> {
        return fetch(filename)
            .then((response: Response) => response.arrayBuffer())
            .then((arrayBuffer: ArrayBuffer) => {
                if (arrayBuffer) {
                    // console.clear();
                    this.track = new this.modPlayer.Track(filename);
                    this.player.open(this.track)
                    // this.audioElement.autoplay = false;
                    this.audioElement.autoplay = false;
                    // this.audioElement = this.track.open();



                } else {
                    console.log('unable to load', filename);
                }
            });
    }

    // Initialize XM Player
    public initXM() {
        //  XMPlayer.init();
        // this.audioContext = XMPlayer.audioctx; 
    }

    public playOgg(filename: string): Promise<void> {
        return fetch(filename)
            .then((response: Response) => response.arrayBuffer())
            .then((arrayBuffer: ArrayBuffer) => {
                if (arrayBuffer) {
                    this.audioContext.decodeAudioData(arrayBuffer,
                        (buffer: AudioBuffer) => {
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

    public loadOgg(filename: string): Promise<void>  {
        const audio = this.audio;
        return new Promise((resolve) => {
            audio.src = filename;
            audio.load();
            audio.preload = 'auto';
            audio.loop = true;
            audio.autoplay = false;
            audio.oncanplay = () => resolve();
        });
    }

    prepareSync(filename: string, demoMode: boolean): Promise<void> {
        this.demoMode = demoMode;
        return new Promise((resolve) => {
            if (this.demoMode) {
                this.syncDevice.setConfig({
                    'rocketXML': filename
                });
                this.syncDevice.init('demo');

            } else {
                this.syncDevice.init();
            }

            // XML file from JS Rocket library was loaded and parsed, make sure your ogg is ready
            this.syncDevice.on('ready', () => this.onSyncReady());

            // [JS Rocket - Arrow keys] whenever you change the row, a value or interpolation mode this will get called
            this.syncDevice.on('update', (newRow: number) => this.onSyncUpdate(newRow));

            // [JS Rocket - Spacebar] in Rocket calls one of those
            this.syncDevice.on('play', () => this.onPlay());
            this.syncDevice.on('pause', () => this.onPause());
            resolve()
        });
    }

    onSyncReady() {
        console.info('ready')
        this.musicProperties.BPM = 125;
        this.musicProperties.ROWS_PER_BEAT = 6;
        this.musicProperties.ROW_RATE = this.musicProperties.BPM / 60 * this.musicProperties.ROWS_PER_BEAT;
        this.syncDevice.connected = true;
        this.sceneData.effect = this.syncDevice.getTrack('effect');
        this.sceneData.snare = this.syncDevice.getTrack('snare');
        this.sceneData.bass = this.syncDevice.getTrack('bass');
        this.sceneData.transitionType = this.syncDevice.getTrack('transitionType');
        this.sceneData.transitionValue = this.syncDevice.getTrack('transitionValue');

        this.audioElement.onpause = () => {
            this.isPlaying = false;
        };

        this.audioElement.onplay = () => {
            this.isPlaying = true;
        }

    }

    // row is only given if you navigate, or change a value on the row in Rocket
    // on interpolation change (hit [i]) no row value is sent, as the current there is the upper row of your block
    onSyncUpdate(newRow: number) {
        if (!isNaN(newRow)) {
            this.row = newRow;
        }
        this.audioElement.currentTime = newRow / this.musicProperties.ROW_RATE;
    }

    updateMusic() {
        // show message if rocket app is not running in background
        if (!this.syncDevice.connected && !this.demoMode) {
            return;
        }

        // update music properties
        this.musicProperties.timeSeconds = (this.audioElement?.currentTime) || 0;
        this.musicProperties.timeMilliseconds = this.musicProperties.timeSeconds * 1000;
        this.row = this.musicProperties.timeSeconds * this.musicProperties.ROW_RATE;

        this.musicProperties.sceneData = {
            effect: this.sceneData.effect.getValue(this.row),
            transitionType: this.sceneData.transitionType.getValue(this.row),
            transitionValue: this.sceneData.transitionValue.getValue(this.row),
            snare: this.sceneData.snare.getValue(this.row),
            bass: this.sceneData.bass.getValue(this.row),
        }

        // update JS rocket
        if (this.audioElement && this.audioElement.paused === false) {
            // otherwise we may jump into a point in the audio where there's
            // no timeframe, resulting in Rocket setting row 2 and we report
            // row 1 back - thus Rocket spasming out

            // this informs Rocket where we are
            this.syncDevice.update(this.row);
        }
    }

    onPlay() {

        if (!this.audioElement) {
             this.audioElement = this.track.open();
             // this.audioElement.play();
            
            // this.track.self.play();
        }

        if (!this.isPlaying && this.audioElement) {
            if (this.audioElement.currentTime) {
                this.audioElement.currentTime = this.row / this.musicProperties.ROW_RATE;
            }

            this.isPlaying = true;
            this.audioElement.play();


            /*
            const playPromise = this.audioElement.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.isPlaying = true;
                })
                    .catch(error => {
                        console.log(error);
                    });
            }
            */



        }
        console.log('[onPlay]', this.audioElement);

    }

    onPause() {
        console.info('[onPause]', this.audioElement);
        if (!this.audioElement.paused && this.isPlaying) {
            this.row = this.audioElement.currentTime * this.musicProperties.ROW_RATE;
            this.audioElement.pause();
            this.isPlaying = false;
        }
    }

    /**
     * find the prev/next effect and jump to it
     *
     * @param   {number} time       where we are in the audio timeline
     * @param   {number} direction  direction to skip -1 goes backwards.  1 goes forward
     */
    public jump(time: number, direction: number, sceneLength: number) {
        this.row = time * this.musicProperties.ROW_RATE;
        const effectJump = Number(this.sceneData.effect.getValue(this.row).toFixed(1));
        if (Math.trunc(Number(this.musicProperties.sceneData.effect)) !== Math.trunc(effectJump) && effectJump >= 1) {
            // if running into transition effect 2.5..then keep searching and only land on whole numbers
            if (parseInt(effectJump.toString(), 10) !== effectJump) {
                this.jump(time + (0.12 * direction), direction, sceneLength);
            } else {
                this.seek(time);
            }
        } else {
            if (time >= 0 && effectJump < sceneLength - 3) {
                this.jump(time + (0.12 * direction), direction, sceneLength);
            } else {
                // go back to the beginning
                this.seek(0);
            }
        }
    }

    /**
     * Jumps to a point in the audio timeline in milliseconds
     *
     * @param  {number} time            time in milliseconds
     */
    public seek(time: number) {
        this.audioElement.currentTime = time;
        // update rocket editor position to new timeline location
        if (!this.demoMode) {
            this.syncDevice.update(this.audioElement.currentTime * this.musicProperties.ROW_RATE);
        }
    }

    /**
     * Turns music volume on or off
     *
     * @param  {HTMLElement} ref         volume icon to toggle
     * @param  {boolean} isMuted         on or off
     */
    public toggleSound(ref: HTMLElement, isMuted: boolean) {
        if (isMuted) {
            ref.setAttribute('title', 'enable sound');
            ref.classList.remove('fa-volume-up');
            ref.classList.add('fa-volume-off');
        } else {
            ref.setAttribute('title', 'mute sound');
            ref.classList.remove('fa-volume-off');
            ref.classList.add('fa-volume-up');
        }
        // this.audioElement.muted = isMuted;
    }

    /**
     * Restore position of timeline & mute preference on reload
     */
    public initTimeline() {
        // jump to last position on timeline for local development reloading
        const jumpTo = localStorage.getItem('lastTime');
        if (jumpTo) {
            // this.seek(Number(jumpTo));
        }

        // remember last sound preferences
        const isMuted = localStorage.getItem('soundToggle') === 'true';
        this.toggleSound(document.getElementById('ticker_volume'), isMuted);
    }





    /*
    // todo: add effect # markers to timeline
    fetch(rocketData.default).then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            const tracks: Element[] = Array.from(data.documentElement.getElementsByTagName("track"));
            tracks.forEach((element) => {
                if (element.getAttribute("name") === 'effect') {
                    const keys: Element[] = Array.from(element.getElementsByTagName("key"));
                    keys.forEach((elementKey) => {
                        const p = document.createElement("option");
                        const value = elementKey.getAttribute('row').valueOf();
                        const label = elementKey.getAttribute('value').valueOf();

                        // remap rows to a range between 0 and 1000
                        const newValue = Utils.map(Number(label), 0, 1520, 0, 1000);

                        p.value = value;
                        p.label = label;
                        // this.tickmarkRef.appendChild(p);
                    })
                }
            });
        });
        */

}
