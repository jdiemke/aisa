/*
Name          : Aisa Demo
Release Date  : TBD
Platform      : JavaScript
Category      : Demo
Notes         : Software rendered effects written in Typescript
*/

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
    private soundManager: SoundManager;

    // Video Recorder
    private canvasRecorder: CanvasRecorder;

    // list of scenes
    private sceneList: DoublyLinkedList<AbstractScene>;
    private nodeInstance: DLNode<AbstractScene>;

    // transitions
    private BlockFade: BlockFade;

    // stats
    private stats: Array<Stats>;

    // our main canvas
    private canvasRef: HTMLCanvasElement;

    // moving line marking current place in the timeline
    private timelineRef: HTMLInputElement;

    // displays which scene we're on
    private sceneRef: HTMLSpanElement;

    // displays time in seconds
    private timeRef: HTMLSpanElement;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.soundManager = new SoundManager();

        this.sceneList = new DoublyLinkedList();

        this.initControls(framebuffer.width);

        this.BlockFade = new BlockFade();

        this.canvasRef = document.getElementById('aisa-canvas') as HTMLCanvasElement;

        // initialize effects with progress
        return this.allProgress([

            // load music
            // this.soundManager.loadMusic(require(`../../assets/sound/dubmood_-_cromenu1_haschkaka.xm`)),
            this.soundManager.loadMusic(require(`../../assets/sound/showeroflove.mod`)),
            // this.soundManager.loadMusic(require('../../assets/sound/NotMixedorMastered.ogg')),

            // load *.rocket file for scene/music synchronization
            this.soundManager.prepareSync(require('../../assets/sound/demo.rocket'), true),

            // we use this for transitions
            this.BlockFade.init(framebuffer),

            // load and initialze effects
            import('./parts/Scene1').then(plug => this.initScene(framebuffer, plug)), // cubicles
            import('./parts/Scene1').then(plug => this.initScene(framebuffer, plug)), // cubicles
            import('./parts/Scene2').then(plug => this.initScene(framebuffer, plug)), // telephone
            import('./parts/Scene3').then(plug => this.initScene(framebuffer, plug)), // title screen here
            import('./parts/Scene4').then(plug => this.initScene(framebuffer, plug)), // pizza delivery guy
            import('./parts/Scene5').then(plug => this.initScene(framebuffer, plug)), // replace with something else
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
            import('./parts/Scene20').then(plug => this.initScene(framebuffer, plug)), // sinescroller

        ], (percent: number) => {
            // update the progress bar via canvas
            const outputX = Math.ceil(framebuffer.width * percent);
            framebuffer.drawRect2(0, (framebuffer.height / 2) - 5, outputX, 10, Color.WHITE.toPackedFormat());

            // update the canvas
            this.canvasRef.getContext('2d').putImageData(framebuffer.getImageData(), 0, 0);

            // update memory usage
            for (const p of this.stats) {
                p.update();
            }
        });
    }

    /**
     * Adds AbstractScenes to sceneList array and initializes it
     *
     * @param   {Framebuffer} framebuffer            scene initializes with information in framebuffer such as width and height
     * @param   {Object} plug                        imported class
     * @returns {Promise<any>}                       resolves promise after completion
     */
    private initScene(framebuffer: Framebuffer, plug: unknown, ...args: Array<any>): Promise<any> {
        const constructorName = Object.keys(plug)[0];
        const newNode: DLNode<AbstractScene> = new DLNode();
        newNode.data = new plug[constructorName](...args);
        this.sceneList.insert(newNode, this.sceneList.length - 1);
        return newNode.data.init(framebuffer);
    }

    // this runs after init() has finished
    public onInit(): void {

        this.canvasRecorder = new CanvasRecorder();

        // jump to last effect in timeline and set mute vs unmuted
        this.soundManager.initTimeline();

        // show debug / timeline navigator
        document.getElementById('debug').style.display = 'block';
    }

    /**
     * Setup debug tools for local development
     */
    private initControls(width: number) {
        this.stats = new Array<Stats>();

        // Stats - Memory in Megabytes
        this.initStats(2, 0, width * 2);

        // Stats - Frames per second
        this.initStats(0, 50, width * 2);

        // Stats - Milliseconds per frame
        this.initStats(1, 100, width * 2);

        document.getElementById('debug').style.width = `${width * 2}px`;

        // Scene Playback Controls
        const tickerPlayRef = document.getElementById('ticker_play');
        const tickerStopRef = document.getElementById('ticker_stop');
        const tickerNextRef = document.getElementById('ticker_next');
        const tickerBackRef = document.getElementById('ticker_back');
        const tickerRecordRef = document.getElementById('ticker_record');
        const tickerScreenshotRef = document.getElementById('ticker_screenshot');
        const tickerVolumeRef = document.getElementById('ticker_volume');

        // timeline slider, scene and time display
        this.timelineRef = document.getElementById('timeline') as HTMLInputElement;
        this.sceneRef = document.getElementById('scene') as HTMLSpanElement;
        this.timeRef = document.getElementById('time') as HTMLSpanElement;

        // stop
        tickerStopRef.addEventListener('click', () => {
            this.soundManager.onPause();
            this.soundManager.seek(0);

            tickerPlayRef.classList.add('fa-play');
            tickerPlayRef.classList.remove('fa-pause');

            // save video if recoding
            if (this.canvasRecorder.recording) {
                tickerRecordRef.style.color = 'white';
                this.canvasRecorder.saveVideo();
            }
        })

        // record video
        tickerRecordRef.addEventListener('click', () => {
            if (!this.canvasRecorder.recording) {
                // start audio and video recording
                tickerRecordRef.style.color = 'red';
                this.soundManager.onPlay();
                this.canvasRecorder.recordVideo();
                tickerPlayRef.classList.remove('fa-play');
                tickerPlayRef.classList.add('fa-pause');
            } else {
                // pause audio and save video file
                tickerRecordRef.style.color = 'white';
                this.soundManager.onPause();
                this.canvasRecorder.saveVideo();
                tickerPlayRef.classList.add('fa-play');
                tickerPlayRef.classList.remove('fa-pause');
            }
        })

        // play / pause
        tickerPlayRef.addEventListener('click', () => {
            if (!this.soundManager.isPlaying) {
                this.soundManager.onPlay();
                tickerPlayRef.setAttribute('title', 'pause');
                tickerPlayRef.classList.remove('fa-play');
                tickerPlayRef.classList.add('fa-pause');
            } else {
                this.soundManager.onPause();
                tickerPlayRef.setAttribute('title', 'play');
                tickerPlayRef.classList.add('fa-play');
                tickerPlayRef.classList.remove('fa-pause');
            }
        })

        // toggle audio and save preference for subsequent reloads
        tickerVolumeRef.addEventListener('click', () => {
            this.soundManager.toggleSound(tickerVolumeRef, !this.soundManager.audioElement.muted);
            localStorage.setItem('soundToggle', String(this.soundManager.audioElement.muted));
        });

        // save screenshot in PNG format
        tickerScreenshotRef.addEventListener('click', () => {
            const date = new Date();
            const fileName = `Aisa ${date.toISOString().slice(0, 10)} at ${date
                .toTimeString()
                .slice(0, 8)
                .replace(/:/g, '.')}.png`;
            const image = this.canvasRef.toDataURL('image/png').replace('image/png', 'image/octet-stream');
            const anchor = document.createElement('a');
            anchor.setAttribute('download', fileName);
            anchor.setAttribute('href', image);
            anchor.click();
        })

        // next
        tickerNextRef.addEventListener('click', () => {
            this.soundManager.jump(this.soundManager.musicProperties.timeSeconds, 1, this.sceneList.length);
        })

        // back
        tickerBackRef.addEventListener('click', () => {
            this.soundManager.jump(this.soundManager.musicProperties.timeSeconds, -1, this.sceneList.length);
        })

        // seek
        this.timelineRef.addEventListener('input', (e) => {
            const time = Number((e.target as HTMLInputElement).value);
            this.soundManager.seek(time / 1000);
        });

        // seek with scrollwheel
        document.addEventListener("wheel", (e) => {
            const directionToScroll = (e.deltaY < 0) ? -0.06 : 0.06;
            this.soundManager.seek(this.soundManager.audioElement.currentTime + directionToScroll);
            // prevent page scroll
            e.preventDefault();
            e.stopPropagation();
        }, { passive: false })

        // keyboard navigation controls
        document.addEventListener('keydown', (e: KeyboardEvent) => {
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
                    this.soundManager.seek(this.soundManager.audioElement.currentTime - 0.06);
                    break;
                // navigate timeline forward
                case 'ArrowRight':
                    this.soundManager.seek(this.soundManager.audioElement.currentTime + 0.06);
                    break;
                // jump to next effect
                case 'MediaTrackNext':
                case 'ArrowUp':
                    this.soundManager.jump(this.soundManager.audioElement.currentTime, 1, this.sceneList.length);
                    break;
                // jump to previous effect
                case 'MediaTrackPrevious':
                case 'ArrowDown':
                    this.soundManager.jump(this.soundManager.audioElement.currentTime, -1, this.sceneList.length);
                    break;
                // toggle full screen
                case 'f':
                    this.canvasRef.click();
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
     * @param   {Function} progressCallback          function sending percentage after individual promise is complete
     * @returns {Promise<any>}                       promise resolve after all promises are complete
     */
    private allProgress(promises: Array<Promise<any>>, progressCallback: (percentage: number) => void): Promise<any> {
        let d = 0;
        for (const p of promises) {
            p.then(() => {
                d++;
                progressCallback(d / promises.length);
            });
        }
        return Promise.all(promises);
    }

    /**
     * Adds JavaScript Performance Monitor and initializes it
     *
     * @param   {Object} args                        stat type[0-3], top in pixels, left in pixels
     */
    private initStats(...args: Array<number>) {
        this.stats.push(new Stats());
        const statsObj = this.stats[this.stats.length - 1];
        statsObj.showPanel(args[0]);
        statsObj.dom.style.cssText = `position:absolute;top:${args[1]}px;left:${args[2]}px;`;
        document.body.appendChild(statsObj.dom);
    }

    public render(framebuffer: Framebuffer) {
        // get time and values from music
        this.soundManager.updateMusic();

        // get which effect to run
        this.nodeInstance = this.sceneList.getNode(this.soundManager.musicProperties.sceneData.effect);

        // if "transitionType" in JSRocket is zero then run the effect by itself
        if (this.soundManager.musicProperties.sceneData.transitionType === 0) {
            this.nodeInstance.data.render(framebuffer, this.soundManager.musicProperties.timeMilliseconds)
        } else {
            // otherwise blend two effects together
            this.BlockFade.transition(
                framebuffer,
                this.nodeInstance.data,
                this.nodeInstance.next.data,
                this.soundManager.musicProperties.sceneData.transitionType,
                this.soundManager.musicProperties.sceneData.transitionValue,
                this.soundManager.musicProperties.timeMilliseconds);
        }

        // comment out for release
        this.drawStats();
    }

    /**
     * Show FPS, Memory Usage and js rocket time and effect number
     */
    private drawStats() {
        // update timeline marker
        this.timelineRef.value = String(this.soundManager.musicProperties.timeMilliseconds);

        // keep current time in local storage to stay in place during reloads
        localStorage.setItem('lastTime', String(this.soundManager.musicProperties.timeSeconds));

        if (!this.soundManager.syncDevice.connected && !this.soundManager.demoMode) {
            console.error('Rocket not connected.');
            return;
        } else {
            // get values from JS rocket
            this.sceneRef.innerText = this.soundManager.musicProperties.sceneData.effect.toString();
            this.timeRef.innerText = this.soundManager.musicProperties.timeSeconds.toFixed(2);
        }
        // update FPS and Memory usage
        for (const p of this.stats) {
            p.update();
        }
    }

}
