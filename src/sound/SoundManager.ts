import './JSRocket';
import './cowbell/cowbell'
import './cowbell/audio_player'
import './cowbell/web_audio_player'
import './cowbell/openmpt/openmpt_player'
import {
    musicProperties,
    ROW_RATE,
    sceneData
} from './MusicProperties';
export class SoundManager {

    public syncDevice;
    public isPlaying = false;
    public demoMode: boolean;
    public row = 0;    // the current row we're on

    //  container for audio values to be used by effects (time, bass, effect, transitions)
    public musicProperties: musicProperties;
    public sceneData: sceneData;
    public audioElement: HTMLAudioElement;

    public constructor() {

        // Initialize JS Rocket
        this.syncDevice = new JSRocket.SyncDevice();
        this.syncDevice.connected = false;

    }

    /**
     * Load audio files supported by cowbell
     *
     * @param {string} filename     audio file to load
     * @returns {Promise<void>}     promise
     */
    public loadMusic(filename: string): Promise<void> {
        return new Promise((resolve) => {

            // Reset any stale modulePtr left over from a previous load (e.g. after a
            // webpack HMR hot-reload).  The initTimeline poll checks window.modulePtr;
            // if a stale truthy value remains, the poll fires immediately against the
            // new generator whose closure modulePtr is still undefined, causing
            // libopenmpt to crash with "Cannot read properties of undefined (reading 'ob')".
            (window as any).modulePtr = 0;

            const fileExtension = filename.split('.').pop().toLowerCase();
            let audioPlayer;

            switch (fileExtension) {
                case 'it':
                case 'xm':
                case 's3m':
                case 'mod':
                    audioPlayer = new Cowbell.Player.OpenMPT({
                        'pathToLibOpenMPT': './openmpt/libopenmpt.js'
                    });
                    break;
                case 'ogg':
                case 'mp3':
                default:
                    audioPlayer = new Cowbell.Player.Audio();
                    break;
            }
            const track = new audioPlayer.Track(filename);
            this.audioElement = track.open();
            // Resolve only after the audio metadata is available, meaning the
            // underlying XHR + WASM initialisation (and window.modulePtr) are done.
            // Cowbell's WebAudioPlayer fires onloadedmetadata from inside
            // generator.load()'s callback, after initModule() has completed.
            this.audioElement.onloadedmetadata = () => resolve();
        });
    }

    /**
     * Load XML file for music syncronization for use with JS Rocket
     *
     * @param {string} filename      XML file to load
     * @param {string} demoMode      use true for release mode (uses file) | false when using rocket editor
     * @returns {Promise<void>}      promise
     */
    prepareSync(filename: string, demoMode: boolean): Promise<void> {
        this.demoMode = demoMode;
        return new Promise((resolve) => {
            // Register event listeners BEFORE calling init() to avoid a race condition
            // where the 'ready' event fires before the listener is attached (demo mode
            // loads the XML immediately, which can trigger 'ready' synchronously).

            // XML file from JS Rocket library was loaded and parsed, make sure your ogg is ready
            this.syncDevice.on('ready', () => this.onSyncReady());

            // [JS Rocket - Arrow keys] whenever you change the row, a value or interpolation mode this will get called
            this.syncDevice.on('update', (newRow: number) => this.onSyncUpdate(newRow));

            // [JS Rocket - Spacebar] in Rocket calls one of those
            this.syncDevice.on('play', () => this.onPlay());
            this.syncDevice.on('pause', () => this.onPause());

            if (this.demoMode) {
                this.syncDevice.setConfig({
                    'rocketXML': filename
                });
                this.syncDevice.init('demo');
            } else {
                this.syncDevice.init();
            }

            resolve();
        });
    }

    onSyncReady() {
        this.syncDevice.connected = true;

        this.sceneData = {
            effect: this.syncDevice.getTrack('effect'),
            snare: this.syncDevice.getTrack('snare'),
            bass: this.syncDevice.getTrack('bass'),
            transitionType: this.syncDevice.getTrack('transitionType'),
            transitionValue: this.syncDevice.getTrack('transitionValue')
        }
    }

    // row is only given if you navigate, or change a value on the row in Rocket
    // on interpolation change (hit [i]) no row value is sent, as the current there is the upper row of your block
    onSyncUpdate(newRow: number) {
        if (!isNaN(newRow)) {
            this.row = newRow;
        }
        this.audioElement.currentTime = newRow / ROW_RATE;
    }

    updateMusic() {
        // show message if rocket app is not running in background
        if (!this.syncDevice.connected && !this.demoMode) {
            return;
        }

        // In demo mode the early-return above is skipped, so guard against
        // sceneData not yet populated (onSyncReady fires async after XML loads).
        if (!this.sceneData) {
            return;
        }

        // update music properties
        this.musicProperties = {
            timeSeconds: (this.audioElement?.currentTime) || 0,
            timeMilliseconds: (this.audioElement?.currentTime) * 1000,
            sceneData: {
                effect: this.sceneData.effect.getValue(this.row),
                transitionType: this.sceneData.transitionType.getValue(this.row),
                transitionValue: this.sceneData.transitionValue.getValue(this.row),
                snare: this.sceneData.snare.getValue(this.row),
                bass: this.sceneData.bass.getValue(this.row),
            }
        }

        this.row = this.musicProperties.timeSeconds * ROW_RATE;

        // update JS rocket
        if (this.audioElement && this.audioElement.paused === false) {
            // otherwise we may jump into a point in the audio where there's
            // no timeframe, resulting in Rocket setting row 2 and we report
            // row 1 back - thus Rocket spasming out

            // this informs Rocket where we are
            this.syncDevice.update(this.row);
        }

        // stop once timeline reaches end
        if (Math.floor(this.audioElement.duration) === Math.floor(this.musicProperties.timeSeconds)) {
            document.getElementById('ticker_stop').click();
        }
    }

    onPlay() {
        if (!this.isPlaying && this.audioElement) {
            if (this.audioElement.currentTime) {
                this.audioElement.currentTime = this.row / ROW_RATE;
            }
            this.isPlaying = true;
            this.audioElement.play();
        }
        console.log('[onPlay]');
    }

    onPause() {
        this.row = this.audioElement.currentTime * ROW_RATE;
        if (!this.audioElement.paused && this.isPlaying) {
            this.audioElement.pause();
            this.isPlaying = false;
        }
        console.info('[onPause]');
    }

    /**
     * find the prev/next effect and jump to it
     *
     * @param   {number} time       where we are in the audio timeline
     * @param   {number} direction  direction to skip -1 goes backwards.  1 goes forward
     */
    public jump(time: number, direction: number, sceneLength: number) {
        this.row = time * ROW_RATE;
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
            this.syncDevice.update(this.audioElement.currentTime * ROW_RATE);
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
        this.audioElement.muted = isMuted;
    }

    /**
     * Restore position of timeline & mute preferences on reloads
     */
    public initTimeline() {
        // jump to last position on timeline for local development reloading
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const newLocal = this;
        const jumpTo = Number(localStorage.getItem('lastTime')) || 0;

        // poll for mod player since library does not use promises
        if ((window as any).libopenmpt) {
            (function poll() {
                // check if mod was loaded then seek
                if ((window as any).modulePtr) {

                    // openmpt does not support volume control or muting
                    document.getElementById('ticker_volume').style.display = 'none';
                    newLocal.updateRange(newLocal.audioElement.duration);
                    newLocal.seek(jumpTo);
                    return;
                }
                setTimeout(poll, 150);
            })();
        } else {
            newLocal.audioElement.onloadedmetadata = function () {
                newLocal.updateRange(newLocal.audioElement.duration);
            };
            newLocal.seek(jumpTo);
        }

        // remember last sound preferences
        const isMuted = localStorage.getItem('soundToggle') === 'true';
        this.toggleSound(document.getElementById('ticker_volume'), isMuted);
    }

    /**
     * Set timeline slider max range
     *
     * @param  {number} value         length time in seconds
     */
    private updateRange(value: number) {
        (document.getElementById("timeline") as HTMLInputElement).max = String(Math.floor(value) * 1000);
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
