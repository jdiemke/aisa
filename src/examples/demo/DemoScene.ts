// Synthwave
// https://codepen.io/H2xDev/pen/YMPJeP
// https://codepen.io/H2xDev/details/MRYoEM
// https://codepen.io/H2xDev/pen/dyPGKBy

// Core
import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { SoundManager } from '../../sound/SoundManager';
import { Color } from '../../core/Color';
import { BlockFade } from '../block-fade/BlockFade';

// Stats
import Stats = require('stats.js');

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
    private _demoMode = false;

    // list of scenes
    private sceneList: Array<AbstractScene>;

    // scene variables | things you set through jsRocket
    private FOV = 50;
    private _cameraRotation;
    private _cameraDistance;
    private _effect;
    private _transition;
    private _snare;
    private _bass;
    private _fov;

    // the current row we're on
    private _row = 0;
    private _currentEffect: number;
    private tickerPointer = document.getElementById('ticker_pointer');
    private timeSeconds: number;
    private timeMilliseconds: number;
    private BlockFade: BlockFade;

    // stats
    private bmpFont: Texture;
    private statsFPS: Stats;
    private statsMEM: Stats;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.sm = new SoundManager();

        this.sceneList = new Array<AbstractScene>();

        // Stats - Memory in Megabytes stats
        this.statsMEM = new Stats();
        this.statsMEM.showPanel(2);
        this.statsMEM.dom.style.cssText = `position:absolute;top:0px;left:${framebuffer.width * 2}px;`;
        document.body.appendChild(this.statsMEM.dom);

        // Stats - Frames per Seconds
        this.statsFPS = new Stats();
        this.statsFPS.showPanel(0);
        this.statsFPS.dom.style.cssText = `position:absolute;top:50px;left:${framebuffer.width * 2}px;`;
        document.body.appendChild(this.statsFPS.dom);

        // Scene Playback Controls
        const tickerRef = document.getElementById('ticker');
        const tickerPlayRef = document.getElementById('ticker_play');
        const tickerPauseRef = document.getElementById('ticker_pause');

        // Loading bar
        const loadingRef = document.getElementById('loading');

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

        this.BlockFade = new BlockFade();

        // initialize effects with progress
        return this.allProgress([
            // load music
            this.sm.loadOgg(require('../../assets/sound/no-xs_4.ogg').default),

            // font for stats
            TextureUtils.load(require('../../assets/font.png'), true).then(
                (texture: Texture) => {
                    return this.bmpFont = texture;
                }),

            // load *.rocket file
            this.prepareSync(),

            // we use this for transitions
            this.BlockFade.init(framebuffer),

            // load and initialze effects
            import('../metalheadz/MetalHeadzScene').then(plug => this.initScene(framebuffer, plug)),
            import('../abstract-cube/AbstractCube').then(plug => this.initScene(framebuffer, plug)),
            import('../plane-deformation/PlaneDeformationScene').then(plug => this.initScene(framebuffer, plug, 8, require('../../assets/textures/tex4_256.png'))),
            import('../plane-deformation-floor/PlaneDeformationFloorScene').then(plug => this.initScene(framebuffer, plug)),
            import('../plane-deformation-tunnel/PlaneDeformationTunnelScene').then(plug => this.initScene(framebuffer, plug)),
            import('../plasma/PlasmaScene').then(plug => this.initScene(framebuffer, plug)),
            import('../dof-balls/DofBallsScene').then(plug => this.initScene(framebuffer, plug)),
            import('../baked-lighting/BakedLighting').then(plug => this.initScene(framebuffer, plug)),
            import('../bump-map/BumpMap').then(plug => this.initScene(framebuffer, plug)),
            import('../cube/CubeScene').then(plug => this.initScene(framebuffer, plug)),
            import('../cube-tunnel/CubeTunnelScene').then(plug => this.initScene(framebuffer, plug)),
            import('../distorted-sphere/DistortedSphereScene').then(plug => this.initScene(framebuffer, plug)),
            import('../gears-2/Gears2Scene').then(plug => this.initScene(framebuffer, plug)),
            import('../gears/GearsScene').then(plug => this.initScene(framebuffer, plug)),
            import('../hoodlum/HoodlumScene').then(plug => this.initScene(framebuffer, plug)),
            import('../led-plasma/LedPlasmaScene').then(plug => this.initScene(framebuffer, plug)),
            import('../lens/LensScene').then(plug => this.initScene(framebuffer, plug)),
            import('../md2/Md2ModelScene').then(plug => this.initScene(framebuffer, plug)),
            import('../razor/RazorScene').then(plug => this.initScene(framebuffer, plug)),
            import('../metaballs/MetaballsScene').then(plug => this.initScene(framebuffer, plug)),
            import('../moving-torus/MovingTorusScene').then(plug => this.initScene(framebuffer, plug)),
            import('../particle-streams/ParticleStreamsScene').then(plug => this.initScene(framebuffer, plug)),
            import('../particle-system/ParticleSystemScene').then(plug => this.initScene(framebuffer, plug)),
            import('../particle-torus/ParticleTorusScene').then(plug => this.initScene(framebuffer, plug)),
            import('../pixel-effect/PixelEffectScene').then(plug => { this.initScene(framebuffer, plug); }),
            import('../platonian/PlatonianScene').then(plug => this.initScene(framebuffer, plug)),
            // approximate end of demo here 26 effects
            import('../polar-voxels/PolarVoxelsScene').then(plug => this.initScene(framebuffer, plug)),
            import('../rotating-gears/RotatingGearsScene').then(plug => this.initScene(framebuffer, plug)),
            import('../roto-zoomer/RotoZoomerScene').then(plug => this.initScene(framebuffer, plug)),
            import('../sine-scroller/SineScrollerScene').then(plug => this.initScene(framebuffer, plug)),
            import('../starfield/StarfieldScene').then(plug => this.initScene(framebuffer, plug)),
            import('../textured-torus/TexturedTorusScene').then(plug => this.initScene(framebuffer, plug)),
            import('../third-person-camera/ThirdPersonCameraScene').then(plug => this.initScene(framebuffer, plug)),
            import('../titan-effect/TitanEffectScene').then(plug => this.initScene(framebuffer, plug)),
            import('../torus-knot/TorusKnotScene').then(plug => this.initScene(framebuffer, plug)),
            import('../torus-knot-tunnel/TorusKnotTunnelScene').then(plug => this.initScene(framebuffer, plug)),
            import('../torus/TorusScene').then(plug => this.initScene(framebuffer, plug)),
            import('../toxic-dots/ToxicDotsScene').then(plug => this.initScene(framebuffer, plug)),
            import('../twister/TwisterScene').then(plug => this.initScene(framebuffer, plug)),
            import('../voxel-balls/VoxelBallsScene').then(plug => { this.initScene(framebuffer, plug); }),
            import('../voxel-landscape-fade/VoxelLandcapeFadeScene').then(plug => this.initScene(framebuffer, plug)),
            import('../voxel-landscape/VoxelLandscapeScene').then(plug => this.initScene(framebuffer, plug)),

            /*
            import('../wavefront/WavefrontScene').then(plug => this.initScene(framebuffer, plug)),
            import('../wavefront-texture/WaveFrontTextureScene').then(plug => this.initScene(framebuffer, plug)),
            import('../cinematic-scroller/CinematicScroller').then(plug => this.initScene(framebuffer, plug)),
            import('../scrolling-background/ScrollingBackgroundScene').then(plug => this.initScene(framebuffer, plug)),
            import('../bobs/Bobs').then(plug => this.initScene(framebuffer, plug)),
            import('../flood-fill/FloodFillScene').then(plug => this.initScene(framebuffer, plug)),
            import('../different-md2/DifferentMd2ModelScene').then(plug => this.initScene(framebuffer, plug)),
            // this seems to be a debug effect
            import('../frustum-culling/FrustumCullingScene').then(plug => this.initScene(framebuffer, plug)),
            import('../mode-7/Mode7Scene').then(plug => this.initScene(framebuffer, plug)),
            */

        ], (percent: number) => {
            // update the progress bar via canvas
            const outputX = Math.ceil(framebuffer.width * percent);
            framebuffer.drawRect2(0, (framebuffer.height / 2) - 5, outputX, 10, Color.WHITE.toPackedFormat());

            // update the canvas
            const canvas = document.getElementById('aisa-canvas') as HTMLCanvasElement;
            canvas.getContext('2d').putImageData(framebuffer.getImageData(), 0, 0);

            // update memory usage
            this.statsMEM.update();
        });
    };

    // this runs after init() has finished
    public onInit(): void {

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
     * Adds list of AbstractScenes to sceneList array and initializes it
     *
     * @param   {Framebuffer} framebuffer            scene initializes with information in framebuffer such as width and height
     * @param   {Object} plug                        imported class
     * @returns {Promise<any>}                       resolves promise after completion
     */
    private initScene(framebuffer: Framebuffer, plug: {}, ...args: Array<any>): Promise<any> {
        const constructorName = Object.keys(plug)[0];
        this.sceneList.push(new plug[constructorName](...args));
        return this.sceneList[this.sceneList.length - 1].init(framebuffer);
    }

    public render(framebuffer: Framebuffer): void {

        // get time and values from music
        this.updateMusic(framebuffer);

        // use values from JS Rocket to determine which scene to show
        const whichEffect = Number(this._currentEffect - 1);

        // if the "effect" column in JSRocket is a whole number then run the effect by itself otherwise transition to next effect
        if (Number.isInteger(whichEffect)) {
            this.sceneList[Math.trunc(whichEffect)].render(framebuffer, this.timeMilliseconds);
        } else {
            const currentEffect = Math.trunc(whichEffect < 1 ? 0 : whichEffect);
            const nextEffect = Math.trunc(whichEffect + 1);
            // get the decimal from the current scene to pick which transition effect to use .5 = radial   .1 = fadein
            const decimalAsInt = Math.round((this._currentEffect - parseInt(this._currentEffect.toString(), 10)) * 10);; // 10.5 returns 5
            this.BlockFade.transition(
                framebuffer,
                this.sceneList[currentEffect],
                this.sceneList[nextEffect],
                decimalAsInt,
                this._transition.getValue(this._row),
                this.timeMilliseconds);
        }

        // show FPS, time and effect number on canvas
        this.drawStats(framebuffer);
    }

    private updateMusic(framebuffer: Framebuffer) {
        // show message if rocket app is not running in background
        if (!this.sm._syncDevice.connected && !this._demoMode) {
            framebuffer.drawText(8, 18, 'Rocket not connected'.toUpperCase(), this.bmpFont);
            return;
        }

        // use audio time otherwise use date
        // const time: number = (Date.now() - this.start);
        // const timeSeconds = this.sm.audioContext.currentTime;
        this.timeSeconds = this.sm._audio.currentTime;
        this.timeMilliseconds = this.timeSeconds * 1000;

        this._row = this.timeSeconds * this.ROW_RATE;

        this._currentEffect = this._effect.getValue(this._row).toFixed(1);

        // update JS rocket
        if (this.sm._audio.paused === false) {
            // otherwise we may jump into a point in the audio where there's
            // no timeframe, resulting in Rocket setting row 2 and we report
            // row 1 back - thus Rocket spasming out

            // this informs Rocket where we are
            this.sm._syncDevice.update(this._row);
        }
        this.tickerPointer.style.left = (this.timeSeconds * 100 / this.sm._audio.duration) + '%';
    }

    // debug info
    private drawStats(framebuffer: Framebuffer) {
        // get values from JS rocket
        framebuffer.drawText(8, 18, 'TIME: ' + this.timeSeconds.toFixed(2), this.bmpFont);
        framebuffer.drawText(8, 36, 'ROTATION: ' + this._cameraRotation.getValue(this._row).toFixed(0), this.bmpFont);
        framebuffer.drawText(8, 36 + 18, 'EFFECT: ' + this._currentEffect, this.bmpFont);

        // update FPS and Memory usage
        this.statsFPS.update();
        this.statsMEM.update();
    }

    prepareSync(): Promise<void> {
        return new Promise((resolve) => {
            if (this._demoMode) {
                this.sm._syncDevice.setConfig({
                    'rocketXML': require('../../assets/sound/no-xs_4.rocket').default
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
            resolve()
        });
    }

    onSyncReady() {
        this.sm._syncDevice.connected = true;
        this._effect = this.sm._syncDevice.getTrack('effect');
        this._snare = this.sm._syncDevice.getTrack('snare');
        this._bass = this.sm._syncDevice.getTrack('bass');
        this._cameraRotation = this.sm._syncDevice.getTrack('rotation');
        this._cameraDistance = this.sm._syncDevice.getTrack('distance');
        this._fov = this.sm._syncDevice.getTrack('FOV');
        this._transition = this.sm._syncDevice.getTrack('transition');
    }

    // row is only given if you navigate, or change a value on the row in Rocket
    // on interpolation change (hit [i]) no row value is sent, as the current there is the upper row of your block
    onSyncUpdate(newRow: number) {
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
