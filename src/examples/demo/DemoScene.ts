// Synthwave
// https://codepen.io/H2xDev/pen/YMPJeP
// https://codepen.io/H2xDev/details/MRYoEM
// https://codepen.io/H2xDev/pen/dyPGKBy

// Core
import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { SoundManager } from '../../sound/SoundManager';
import { Color } from '../../core/Color';
import { BlockFade } from '../block-fade/BlockFade';
import { DoublyLinkedList } from '../../core/LinkedList';
import { DLNode } from '../../core/Node';

// Stats
import Stats = require('stats.js');

// Video Recording Tool
import { CanvasRecorder } from './canvas-record';

export class DemoScene extends AbstractScene {

    // Sound Manager
    private sm: SoundManager;

    // Video Recorder
    private _recording = false;
    private canvasRecorder;
    private canvasRecordingOptions;

    // list of scenes
    private sceneList: DoublyLinkedList<AbstractScene>;
    private nodeInstance: DLNode<AbstractScene>;

    private tickerPointerRef;

    // transitions
    private BlockFade: BlockFade;

    // stats
    private stats: Array<Stats>;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.sm = new SoundManager();

        this.sceneList = new DoublyLinkedList();;

        this.initControls(framebuffer.width);

        this.BlockFade = new BlockFade();

        document.getElementById('debug').style.width = `${framebuffer.width * 2}px`;

        // initialize effects with progress
        return this.allProgress([
            // load music
            this.sm.loadOgg(require('../../assets/sound/NotMixedorMastered.ogg').default),

            // load *.rocket file
            // Set to true when using *.rocket from file system
            // set to false when using rocket editor using websocket
            this.sm.prepareSync(require('../../assets/sound/demo.rocket').default, true),

            // we use this for transitions
            this.BlockFade.init(framebuffer),

            // load and initialze effects
            import('./parts/Scene1').then(plug => this.initScene(framebuffer, plug)), // cubicles
            import('./parts/Scene1').then(plug => this.initScene(framebuffer, plug)), // cubicles
            import('./parts/Scene2').then(plug => this.initScene(framebuffer, plug)), // telephone
            import('./parts/Scene3').then(plug => this.initScene(framebuffer, plug)), // title screen here
            import('./parts/Scene4').then(plug => this.initScene(framebuffer, plug)), // pizza delivery guy
            import('./parts/Scene5').then(plug => this.initScene(framebuffer, plug)), // replace with something else

            // oldskool effects start
            import('./parts/Scene6').then(plug => this.initScene(framebuffer, plug)), // spikeball + plane deformation
            import('./parts/Scene7').then(plug => this.initScene(framebuffer, plug)), // cube + rotozoomer
            import('./parts/Scene8').then(plug => this.initScene(framebuffer, plug)), // ledplasma + voxelcubes
            import('./parts/Scene9').then(plug => this.initScene(framebuffer, plug)), // blender camera
            import('./parts/Scene10').then(plug => this.initScene(framebuffer, plug)), // MetalHeadzScene
            import('./parts/Scene11').then(plug => this.initScene(framebuffer, plug)), // AbstractCube
            import('./parts/Scene12').then(plug => this.initScene(framebuffer, plug)), // DofBallsScene
            import('./parts/Scene13').then(plug => this.initScene(framebuffer, plug)), // TorusKnotTunnelScene
            import('./parts/Scene14').then(plug => this.initScene(framebuffer, plug)), // GearsScene
            import('./parts/Scene15').then(plug => this.initScene(framebuffer, plug)), // BakedLighting
            import('./parts/Scene16').then(plug => this.initScene(framebuffer, plug)), // ParticleStreamsScene
            import('./parts/Scene17').then(plug => this.initScene(framebuffer, plug)), // HoodlumScene
            import('./parts/Scene18').then(plug => this.initScene(framebuffer, plug)), // TwisterScene
            import('./parts/Scene19').then(plug => this.initScene(framebuffer, plug)), // RazorScene

            // end
            import('./parts/Scene20').then(plug => this.initScene(framebuffer, plug)), // sinescroller
            import('./parts/Scene20').then(plug => this.initScene(framebuffer, plug)), // sinescroller

        ], (percent: number) => {
            // update the progress bar via canvas
            const outputX = Math.ceil(framebuffer.width * percent);
            framebuffer.drawRect2(0, (framebuffer.height / 2) - 5, outputX, 10, Color.WHITE.toPackedFormat());

            // update the canvas
            const canvas = document.getElementById('aisa-canvas') as HTMLCanvasElement;
            canvas.getContext('2d').putImageData(framebuffer.getImageData(), 0, 0);

            // update memory usage
            for (const p of this.stats) {
                p.update();
            }
        });
    };

    /**
     * Adds AbstractScenes to sceneList array and initializes it
     *
     * @param   {Framebuffer} framebuffer            scene initializes with information in framebuffer such as width and height
     * @param   {Object} plug                        imported class
     * @returns {Promise<any>}                       resolves promise after completion
     */
    private count = 0;
    private initScene(framebuffer: Framebuffer, plug: {}, ...args: Array<any>): Promise<any> {
        const constructorName = Object.keys(plug)[0];
        const newNode: DLNode<AbstractScene> = new DLNode();
        newNode.data = new plug[constructorName](...args);
        this.sceneList.insert(newNode, this.count);
        return this.sceneList.getNode(this.count++).data.init(framebuffer);
    }

    // this runs after init() has finished
    public onInit(): void {
        this.nodeInstance = this.sceneList.start;
    }

    public recordVideo() {
        console.info('recording video...');
        this._recording = true;
        const date = new Date();

        // options
        this.canvasRecordingOptions = {
            filename: `Aisa ${date.toISOString().slice(0, 10)} at ${date
                .toTimeString()
                .slice(0, 8)
                .replace(/:/g, '.')}.webm`,
            frameRate: 60,
            download: true,
            recorderOptions: {
                // mimeType: 'video/x-matroska;codecs=avc1',
                mimeType: 'video/webm',
                // mimeType: 'video/webm; codecs=vp9',
                audioBitsPerSecond: 128000, // 128 Kbit/sec
                // videoBitsPerSecond: 2500000 // 2.5 Mbit/sec
                videoBitsPerSecond: 5000000 // 2.5 Mbit/sec
            }
        }

        // Create recorder
        const canvasRecorder = new CanvasRecorder();
        const canvasObj = document.getElementById('aisa-canvas');
        this.canvasRecorder = canvasRecorder.createCanvasRecorder(canvasObj, this.canvasRecordingOptions, this.sm._audio);
        this.canvasRecorder.start();
    }

    private saveVideo() {
        // Stop and dispose
        this.canvasRecorder.stop();
        this.canvasRecorder.dispose();
        this._recording = false;
        console.info(`saved video as ${this.canvasRecordingOptions.filename}`);
    }

    /**
     * Jumps to a point in the audio timeline in milliseconds
     *
     * @param  {number} time            time in milliseconds
     */
    private seek(time: number) {
        this.sm._audio.currentTime = time;
        // update rocket editor position to new timeline location
        if (!this.sm._demoMode) {
            this.sm._syncDevice.update(this.sm._audio.currentTime * this.sm.musicProperties.ROW_RATE);
        }
    }

    private initControls(width: number) {
        this.stats = new Array<Stats>();

        // Stats - Memory in Megabytes
        this.initStats(2, 0, width * 2);

        // Stats - Frames per second
        this.initStats(0, 50, width * 2);

        // Stats - Milliseconds per frame
        this.initStats(1, 100, width * 2);

        // Scene Playback Controls
        const tickerRef = document.getElementById('ticker');
        const tickerPlayRef = document.getElementById('ticker_play');
        const tickerStopRef = document.getElementById('ticker_stop');
        const tickerNextRef = document.getElementById('ticker_next');
        const tickerBackRef = document.getElementById('ticker_back');
        const tickerRecordRef = document.getElementById('ticker_record');
        const tickerScreenshotRef = document.getElementById('ticker_screenshot');
        this.tickerPointerRef = document.getElementById('ticker_pointer');

        // stop
        tickerStopRef.addEventListener('click', () => {
            this.sm.onPause();
            this.nodeInstance = this.sceneList.start;
            this.seek(0);

            tickerPlayRef.classList.add('fa-play');
            tickerPlayRef.classList.remove('fa-pause');

            // save video if recoding
            if (this._recording) {
                tickerRecordRef.style.color = 'white';
                this.saveVideo();
            }
        })

        // record video
        tickerRecordRef.addEventListener('click', () => {
            if (!this._recording) {
                tickerRecordRef.style.color = 'red';
                this.sm.onPlay(); // start playing from cursor
                this.recordVideo();
                tickerPlayRef.classList.remove('fa-play');
                tickerPlayRef.classList.add('fa-pause');
            } else {
                tickerRecordRef.style.color = 'white';
                this.sm.onPause();
                this.saveVideo();
                tickerPlayRef.classList.add('fa-play');
                tickerPlayRef.classList.remove('fa-pause');

            }
        })

        // play / pause
        tickerPlayRef.addEventListener('click', () => {
            if (this.sm._audio.paused && !this.sm.isPlaying) {
                this.sm.onPlay();
                tickerPlayRef.setAttribute('title','pause');
                tickerPlayRef.classList.remove('fa-play');
                tickerPlayRef.classList.add('fa-pause');
            } else {
                this.sm.onPause();
                tickerPlayRef.setAttribute('title','play');
                tickerPlayRef.classList.add('fa-play');
                tickerPlayRef.classList.remove('fa-pause');
           }
            
            // toggle play to pause icon
        })

        // save screenshot in PNG format
        tickerScreenshotRef.addEventListener('click', () => {
            const date = new Date();
            const fileName = `Aisa ${date.toISOString().slice(0, 10)} at ${date
                .toTimeString()
                .slice(0, 8)
                .replace(/:/g, '.')}.png`;
            const canvas = document.getElementById('aisa-canvas');
            const image = (canvas as HTMLCanvasElement).toDataURL('image/png').replace('image/png', 'image/octet-stream');
            const anchor = document.createElement('a');
            anchor.setAttribute('download', fileName);
            anchor.setAttribute('href', image);
            anchor.click();
        })

        // next
        tickerNextRef.addEventListener('click', () => {
            this.jump(this.sm._audio.currentTime, 1);
        })

        // back
        tickerBackRef.addEventListener('click', () => {
            this.jump(this.sm._audio.currentTime, -1);
        })

        // seek
        tickerRef.addEventListener('click', (e) => {
            const time = e.offsetX * this.sm._audio.duration / tickerRef.getBoundingClientRect().width;
            this.seek(time);
        });

        // don't seek when clicking on the pointer
        this.tickerPointerRef.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // keyboard navigation controls
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            console.info(e.key)
            switch (e.key) {
                case 'MediaStop':
                    tickerStopRef.click();
                    break;
                // play or pause
                case 'MediaPlayPause':
                case ' ':
                    tickerPlayRef.click();
                    break;
                // navigate timeline backward
                case 'ArrowLeft':
                    this.sm._audio.currentTime = this.sm._audio.currentTime - 0.06;
                    break;
                // navigate timeline forward
                case 'ArrowRight':
                    this.sm._audio.currentTime = this.sm._audio.currentTime + 0.06;
                    break;
                // jump to next effect
                case 'MediaTrackNext':
                case 'ArrowUp':
                    this.jump(this.sm._audio.currentTime, 1);
                    break;
                // jump to previous effect
                case 'MediaTrackPrevious':
                case 'ArrowDown':
                    this.jump(this.sm._audio.currentTime, -1);
                    break;
                // toggle full screen
                case 'f':
                    document.getElementById('aisa-canvas').click();
                    break;
                // save a screenshot
                case 's':
                    tickerScreenshotRef.click();
                    break;
                // record video in webm format
                case 'r':
                    tickerRecordRef.click();
                    break;
                case 'd':
                    break;
            }
        })
    }

    /**
     * Runs all promises in an array and runs callback with percentage of completion
     *
     * @param   {Array<Promise<any>>} promises       array of promises to run
     * @param   {Function} progressCallback          function to run sending percenetage after individual promise is complete
     * @returns {Promise<any>}                       promise resolve after all promises are complete
     */
    private allProgress(promsises: Array<Promise<any>>, progressCallback: Function): Promise<any> {
        let d = 0;
        for (const p of promsises) {
            p.then(() => {
                d++;
                progressCallback(d / promsises.length);
            });
        }
        return Promise.all(promsises);
    }

    /**
     * Adds JavaScript Performance Monitor and initializes it
     *
     * @param   {Object} args                        stat type[0-3], top in pixels, left in pixels
     */
    private initStats(...args: Array<any>) {
        this.stats.push(new Stats());
        const statsObj = this.stats[this.stats.length - 1];
        statsObj.showPanel(args[0]);
        statsObj.dom.style.cssText = `position:absolute;top:${args[1]}px;left:${args[2]}px;`;
        document.body.appendChild(statsObj.dom);
    }

    public render(framebuffer: Framebuffer): void {
        // get time and values from music
        this.sm.updateMusic();

        // get which effect to run
        this.nodeInstance = this.sceneList.getNode(this.sm.musicProperties.sceneData.effect);

        // update timeline
        this.tickerPointerRef.style.left = (this.sm.musicProperties.timeSeconds * 100 / this.sm._audio.duration) + '%';

        // if the "effect" column in JSRocket is a whole number then run the effect by itself
        if (Number.isInteger(this.sm.musicProperties.sceneData.effect)) {
            this.nodeInstance.data.render(framebuffer, this.sm.musicProperties.timeMilliseconds)
        } else {
            // run transition get the decimal from the current scene to pick which transition effect to use .5 = radial   .1 = fadein
            const decimalAsInt = Math.round((this.sm.musicProperties.sceneData.effect - parseInt(this.sm.musicProperties.sceneData.effect.toString(), 10)) * 10); // 10.5 returns 5
            this.BlockFade.transition(
                framebuffer,
                this.nodeInstance.data,
                this.nodeInstance.next.data,
                decimalAsInt,
                this.sm.musicProperties.sceneData.transition,
                this.sm.musicProperties.timeMilliseconds);
        }

        this.BlockFade.renderScanlines(framebuffer, this.sm.musicProperties.sceneData.bass && this.sm.musicProperties.sceneData.bass);

        // show FPS, time and effect number on canvas
        this.drawStats(framebuffer);
    }

    /**
     * find the prev/next effect and jump to it
     *
     * @param   {number} time       where we are in the audio timeline
     * @param   {number} direction  direction to skip -1 goes backwards.  1 goes forward
     */
    private jump(time: number, direction: number) {
        this.sm._row = time * this.sm.musicProperties.ROW_RATE;
        const effectJump = Number(this.sm.sceneData.effect.getValue(this.sm._row).toFixed(1));
        if (Math.trunc(this.sm.musicProperties.sceneData.effect) !== Math.trunc(effectJump) && effectJump >= 1) {
            // if running into transition effect 2.5..then keep searching and only land on whole numbers
            if (parseInt(effectJump.toString(), 10) !== effectJump) {
                this.jump(time + (0.12 * direction), direction);
            } else {
                this.seek(time);
            }
        } else {
            if (time >= 0 && effectJump < this.sceneList.length - 3) {
                this.jump(time + (0.12 * direction), direction);
            } else {
                // go back to the beginning
                this.seek(0);
            }
        }
    }

    // debug info
    private drawStats(framebuffer: Framebuffer) {
        if (!this.sm._syncDevice.connected && !this.sm._demoMode) {
            console.error('Rocket not connected.');
            return;
        } else {
            // get values from JS rocket
            document.getElementById('scene').innerText = this.sm.musicProperties.sceneData.effect.toString();
            document.getElementById('time').innerText = this.sm.musicProperties.timeSeconds.toFixed(2);
        }
        // update FPS and Memory usage
        for (const p of this.stats) {
            p.update();
        }
    }

}
