// Core
import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { SoundManager } from '../../sound/SoundManager';

// Effects
import { AbstractCube } from '../abstract-cube/AbstractCube';
import { BakedLighting } from '../baked-lighting/BakedLighting';
import { BlockFade } from '../block-fade/BlockFade';
import { Bobs } from '../bobs/Bobs';
import { BumpMap } from '../bump-map/BumpMap';
import { BunnyScene } from '../bunny/BunnyScene';
import { CinematicScroller } from '../cinematic-scroller/CinematicScroller';
import { CubeScene } from '../cube/CubeScene';
import { CubeTunnelScene } from '../cube-tunnel/CubeTunnelScene';
import { DifferentMd2ModelScene } from '../Different-Md2/DifferentMd2ModelScene';
import { DistortedSphereScene } from '../Distorted-Sphere/DistortedSphereScene';
import { DofBallsScene } from '../Dof-Balls/DofBallsScene';
import { FloodFillScene } from '../flood-fill/FloodFillScene';
import { FloorScene } from '../Floor/FloorScene';
import { FrustumCullingScene } from '../Frustum-Culling/FrustumCullingScene';
import { Gears2Scene } from '../Gears-2/Gears2Scene';
import { GearsScene } from '../Gears/GearsScene';
import { HoodlumScene } from '../Hoodlum/HoodlumScene';
import { LedPlasmaScene } from '../Led-Plasma/LedPlasmaScene';
import { LensScene } from '../lens/LensScene';
import { Md2ModelScene } from '../md2/Md2ModelScene';
import { MetaballsScene } from '../Metaballs/MetaballsScene';
import { MetalHeadzScene } from '../metalheadz/MetalHeadzScene';
import { Mode7Scene } from '../Mode-7/Mode7Scene';
import { MovingTorusScene } from '../Moving-Torus/MovingTorusScene';
import { ParticleStreamsScene } from '../Particle-Streams/ParticleStreamsScene';
import { ParticleSystemScene } from '../Particle-System/ParticleSystemScene';
import { ParticleTorusScene } from '../Particle-Torus/ParticleTorusScene';
import { PixelEffectScene } from '../Pixel-Effect/PixelEffectScene';
import { PlaneDeformationAbstractScene } from '../PlaneDeformation-Abstract/PlaneDeformationAbstractScene';
import { PlanedeformationTunnelScene } from '../Planedeformation-Tunnel/PlanedeformationTunnelScene';
import { PlasmaScene } from '../Plasma/PlasmaScene';
import { PlatonianScene } from '../Platonian/PlatonianScene';
import { PolarVoxelsScene } from '../Polar-Voxels/PolarVoxelsScene';
import { PortalScene } from '../Portals/PortalScene';
import { RazorScene } from '../Razor/RazorScene';
import { RotatingGearsScene } from '../Rotating-Gears/RotatingGearsScene';
import { RotoZoomerScene } from '../Roto-Zoomer/RotoZoomerScene';
import { ScrollingBackgroundScene } from '../Scrolling-Background/ScrollingBackgroundScene';
import { SineScrollerScene } from '../sine-scroller/SineScrollerScene';
import { StarfieldScene } from '../Starfield/StarfieldScene';
import { TexturedTorusScene } from '../Textured-Torus/TexturedTorusScene';
import { ThirdPersonCameraScene } from '../Third-Person-Camera/ThirdPersonCameraScene';
import { TitanEffectScene } from '../Titan-Effect/TitanEffectScene';
import { TorusKnotScene } from '../Torus-Knot/TorusKnotScene';
import { TorusKnotTunnelScene } from '../Torus-Knot-Tunnel/TorusKnotTunnelScene';
import { TorusScene } from '../Torus/TorusScene';
import { ToxicDotsScene } from '../Toxic-Dots/ToxicDotsScene';
import { TwisterScene } from '../Twister/TwisterScene';
import { VoxelBallsScene } from '../Voxel-Balls/VoxelBallsScene';
import { VoxelLandScapeFadeScene } from '../voxel-landscape-fade/VoxelLandcapeFadeScene';
import { VoxelLandscapeScene } from '../Voxel-Landscape/VoxelLandscapeScene';
import { WavefrontScene } from '../Wavefront/WavefrontScene';
import { WaveFrontTextureScene } from '../WaveFront-Texture/WaveFrontTextureScene';

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
    private _demoMode = true;

    // scene variables | things you set through jsRocket
    private FOV = 50;
    private _cameraRotation;
    private _cameraDistance;
    private _effect;
    private _snare;
    private _bass;
    private _fov;

    // the current row we're on
    private _row = 0;
    private _currentEffect: number;

    private tickerPointer = document.getElementById('ticker_pointer');

    // effects
    private abscractCubeScene: AbstractCube;
    private BakedLighting: BakedLighting;
    private BlockFade: BlockFade;
    private Bobs: Bobs;
    private BumpMap: BumpMap;
    private BunnyScene: BunnyScene;
    private CinematicScroller: CinematicScroller;
    private CubeScene: CubeScene;
    private CubeTunnelScene: CubeTunnelScene;
    private DifferentMd2ModelScene: DifferentMd2ModelScene;
    private DistortedSphereScene: DistortedSphereScene;
    private DofBallsScene: DofBallsScene;
    private FloodFillScene: FloodFillScene;
    private FloorScene: FloorScene;
    private FrustumCullingScene: FrustumCullingScene;
    private Gears2Scene: Gears2Scene;
    private GearsScene: GearsScene;
    private HoodlumScene: HoodlumScene;
    private LedPlasmaScene: LedPlasmaScene;
    private lensScene: LensScene;
    private Md2ModelScene: Md2ModelScene;
    private MetaballsScene: MetaballsScene;
    private metalHeadzScene: MetalHeadzScene
    private Mode7Scene: Mode7Scene;
    private MovingTorusScene: MovingTorusScene;
    private ParticleStreamsScene: ParticleStreamsScene;
    private ParticleSystemScene: ParticleSystemScene;
    private ParticleTorusScene: ParticleTorusScene;
    private PixelEffectScene: PixelEffectScene;
    private PlaneDeformationAbstractScene: PlaneDeformationAbstractScene;
    private PlanedeformationTunnelScene: PlanedeformationTunnelScene;
    private PlasmaScene: PlasmaScene;
    private PlatonianScene: PlatonianScene;
    private PolarVoxelsScene: PolarVoxelsScene;
    private PortalScene: PortalScene;
    private RazorScene: RazorScene;
    private RotatingGearsScene: RotatingGearsScene;
    private RotoZoomerScene: RotoZoomerScene;
    private ScrollingBackgroundScene: ScrollingBackgroundScene;
    private sineScrollerScene: SineScrollerScene;
    private StarfieldScene: StarfieldScene;
    private TexturedTorusScene: TexturedTorusScene;
    private ThirdPersonCameraScene: ThirdPersonCameraScene;
    private TitanEffectScene: TitanEffectScene;
    private TorusKnotScene: TorusKnotScene;
    private TorusKnotTunnelScene: TorusKnotTunnelScene;
    private TorusScene: TorusScene;
    private ToxicDotsScene: ToxicDotsScene;
    private TwisterScene: TwisterScene;
    private VoxelBallsScene: VoxelBallsScene;
    private VoxelLandScapeFadeScene: VoxelLandScapeFadeScene;
    private VoxelLandscapeScene: VoxelLandscapeScene;
    private WavefrontScene: WavefrontScene;
    private WaveFrontTextureScene: WaveFrontTextureScene;

    // stats
    private bmpFont: Texture;
    private statsFPS: Stats;
    private statsMEM: Stats;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.sm = new SoundManager();

        // Stats - Memory in Megabytes stats
        this.statsMEM = new Stats();
        this.statsMEM.showPanel(0);
        this.statsMEM.dom.style.cssText = `position:absolute;top:0px;left:640px;`;
        document.body.appendChild(this.statsMEM.dom);

        // Stats - Frames per Seconds
        this.statsFPS = new Stats();
        this.statsFPS.showPanel(2);
        this.statsFPS.dom.style.cssText = 'position:absolute;top:50px;left:640px;';
        document.body.appendChild(this.statsFPS.dom);

        // Scene Playback Controls
        const tickerRef = document.getElementById('ticker');
        const tickerPlayRef = document.getElementById('ticker_play');
        const tickerPauseRef = document.getElementById('ticker_pause');

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

        // Effects
        this.abscractCubeScene = new AbstractCube();
        this.BakedLighting = new BakedLighting();
        this.BlockFade = new BlockFade();
        this.Bobs = new Bobs();
        this.BumpMap = new BumpMap();
        this.BunnyScene = new BunnyScene();
        this.CinematicScroller = new CinematicScroller();
        this.CubeScene = new CubeScene();
        this.CubeTunnelScene = new CubeTunnelScene();
        this.DifferentMd2ModelScene = new DifferentMd2ModelScene();
        this.DistortedSphereScene = new DistortedSphereScene();
        this.DofBallsScene = new DofBallsScene();
        this.FloodFillScene = new FloodFillScene();
        this.FloorScene = new FloorScene();
        this.FrustumCullingScene = new FrustumCullingScene();
        this.Gears2Scene = new Gears2Scene();
        this.GearsScene = new GearsScene();
        this.HoodlumScene = new HoodlumScene();
        this.LedPlasmaScene = new LedPlasmaScene();
        this.lensScene = new LensScene();
        this.Md2ModelScene = new Md2ModelScene();
        this.MetaballsScene = new MetaballsScene();
        this.metalHeadzScene = new MetalHeadzScene();
        this.Mode7Scene = new Mode7Scene();
        this.MovingTorusScene = new MovingTorusScene();
        this.ParticleStreamsScene = new ParticleStreamsScene();
        this.ParticleSystemScene = new ParticleSystemScene();
        this.ParticleTorusScene = new ParticleTorusScene();
        this.PixelEffectScene = new PixelEffectScene();
        this.PlaneDeformationAbstractScene = new PlaneDeformationAbstractScene();
        this.PlanedeformationTunnelScene = new PlanedeformationTunnelScene();
        this.PlanedeformationTunnelScene = new PlanedeformationTunnelScene();
        this.PlasmaScene = new PlasmaScene();
        this.PlatonianScene = new PlatonianScene();
        this.PolarVoxelsScene = new PolarVoxelsScene();
        this.PortalScene = new PortalScene();
        this.RazorScene = new RazorScene();
        this.RotatingGearsScene = new RotatingGearsScene();
        this.RotoZoomerScene = new RotoZoomerScene();
        this.ScrollingBackgroundScene = new ScrollingBackgroundScene();
        this.sineScrollerScene = new SineScrollerScene();
        this.StarfieldScene = new StarfieldScene();
        this.TexturedTorusScene = new TexturedTorusScene();
        this.ThirdPersonCameraScene = new ThirdPersonCameraScene();
        this.TitanEffectScene = new TitanEffectScene();
        this.TorusKnotScene = new TorusKnotScene();
        this.TorusKnotTunnelScene = new TorusKnotTunnelScene();
        this.TorusScene = new TorusScene();
        this.ToxicDotsScene = new ToxicDotsScene();
        this.TwisterScene = new TwisterScene();
        this.VoxelBallsScene = new VoxelBallsScene();
        this.VoxelLandScapeFadeScene = new VoxelLandScapeFadeScene();
        this.VoxelLandscapeScene = new VoxelLandscapeScene();
        this.WavefrontScene = new WavefrontScene();
        this.WaveFrontTextureScene = new WaveFrontTextureScene();

        // initialize effects
        // TODO: dynamically init each effect so everything isnt loaded at once
        return Promise.all([
            // load music
            // this.sm.playExtendedModule(require('../../assets/sound/dubmood_-_cromenu1_haschkaka.xm').default),
            this.sm.loadOgg(require('../../assets/sound/no-xs_4.ogg').default),
            this.prepareSync(),

            // these two cause the background of metalheadz to go black
            // this.Md2ModelScene.init(framebuffer),
            // this.DifferentMd2ModelScene.init(framebuffer),
            this.abscractCubeScene.init(framebuffer),
            this.lensScene.init(framebuffer),
            this.sineScrollerScene.init(framebuffer),
            this.metalHeadzScene.init(framebuffer),
            this.ScrollingBackgroundScene.init(framebuffer),
            this.BumpMap.init(framebuffer),
            this.BakedLighting.init(framebuffer),
            this.BlockFade.init(framebuffer),
            this.Bobs.init(framebuffer),
            this.BunnyScene.init(framebuffer),
            this.CinematicScroller.init(framebuffer),
            this.CubeScene.init(framebuffer),
            this.CubeTunnelScene.init(framebuffer),
            this.ThirdPersonCameraScene.init(framebuffer),
            this.DistortedSphereScene.init(framebuffer),
            this.DofBallsScene.init(framebuffer),
            this.FloodFillScene.init(framebuffer),
            this.FloorScene.init(framebuffer),
            this.FrustumCullingScene.init(framebuffer),
            this.GearsScene.init(framebuffer),
            this.Gears2Scene.init(framebuffer),
            this.HoodlumScene.init(framebuffer),
            this.LedPlasmaScene.init(framebuffer),
            this.MetaballsScene.init(framebuffer),
            this.Mode7Scene.init(framebuffer),
            this.MovingTorusScene.init(framebuffer),
            this.ParticleStreamsScene.init(framebuffer),
            this.ParticleSystemScene.init(framebuffer),
            this.ParticleTorusScene.init(framebuffer),
            this.PixelEffectScene.init(framebuffer),
            this.PlaneDeformationAbstractScene.init(framebuffer),
            this.PlanedeformationTunnelScene.init(framebuffer),
            this.PlasmaScene.init(framebuffer),
            this.PlatonianScene.init(framebuffer),
            this.PolarVoxelsScene.init(framebuffer),
            this.PortalScene.init(framebuffer),
            this.RazorScene.init(framebuffer),
            this.RotatingGearsScene.init(framebuffer),
            this.RotoZoomerScene.init(framebuffer),
            this.ScrollingBackgroundScene.init(framebuffer),
            this.StarfieldScene.init(framebuffer),
            this.TexturedTorusScene.init(framebuffer),
            this.TitanEffectScene.init(framebuffer),
            this.TorusScene.init(framebuffer),
            this.TorusKnotScene.init(framebuffer),
            this.TorusKnotTunnelScene.init(framebuffer),
            this.ToxicDotsScene.init(framebuffer),
            this.PlanedeformationTunnelScene.init(framebuffer),
            this.TwisterScene.init(framebuffer),
            this.VoxelBallsScene.init(framebuffer),
            this.VoxelLandscapeScene.init(framebuffer),
            this.VoxelLandScapeFadeScene.init(framebuffer),
            this.WavefrontScene.init(framebuffer),
            this.WaveFrontTextureScene.init(framebuffer),

            TextureUtils.load(require('../../assets/font.png'), true).then(
                (texture: Texture) => this.bmpFont = texture),
        ]).then(() => {
        });
    }

    public render(framebuffer: Framebuffer): void {

        // show message if rocket app is not running in background
        if (!this.sm._syncDevice.connected && !this._demoMode) {
            framebuffer.drawText(8, 18, 'Rocket not connected'.toUpperCase(), this.bmpFont);
            return;
        }

        // use audio time otherwise use date
        // const time: number = (Date.now() - this.start);
        // const timeSeconds = this.sm.audioContext.currentTime;
        const timeSeconds = this.sm._audio.currentTime;
        const time: number = timeSeconds * 1000;

        this._row = timeSeconds * this.ROW_RATE;

        this._currentEffect = this._effect.getValue(this._row).toFixed(1);

        // update JS rocket
        if (this.sm._audio.paused === false) {
            // otherwise we may jump into a point in the audio where there's
            // no timeframe, resulting in Rocket setting row 2 and we report
            // row 1 back - thus Rocket spasming out

            // this informs Rocket where we are
            this.sm._syncDevice.update(this._row);
        }
        this.tickerPointer.style.left = (timeSeconds * 100 / this.sm._audio.duration) + '%';

        // empty the screen
        framebuffer.clearColorBuffer(0);

        // BEGIN DEMO ************************************

        // error - normal not found (works in standalone)
        // this.BumpMap.render(framebuffer);

        // error - upButtonNot not defined (works in standalone)
        // this.ThirdPersonCameraScene.render(framebuffer);

        // error - points undefined (works in standalone)
        // this.DistortedSphereScene.render(framebuffer);

        // error - angle undefined (works in standalone)
        // this.Mode7Scene.render(framebuffer);

        // debug effect?
        // this.PortalScene.render(framebuffer);

        // missing bloom effect (works in standalone)
        // this.ToxicDotsScene.render(framebuffer);

        // black screen
        // this.VoxelLandScapeFadeScene.render(framebuffer);

        // duplicate
        // this.WavefrontScene.render(framebuffer);

        // duplicate
        // this.WaveFrontTextureScene.render(framebuffer);

        // TODO: add transition effects as effect N.5
        // 5-10 seconds per effect is ideal
        // max of 30 effects at 10 seconds each for 5 min demo

        // use values from JS Rocket to determine which scene to show
        switch (Number(this._currentEffect)) {
            case 1:
                this.metalHeadzScene.render(framebuffer, time);
                break;
            case 1.5:
                this.BlockFade.render(framebuffer);  // Transition!
            case 2:
                this.abscractCubeScene.render(framebuffer, time);
                break;
            case 3:
                this.sineScrollerScene.render(framebuffer, time);
                framebuffer.fastFramebufferCopy(this.lensScene.textureBackground.texture, framebuffer.framebuffer);
                this.lensScene.render(framebuffer, time);
                break;
            case 4:
                this.DofBallsScene.render(framebuffer);
                break;
            case 5:
                this.ScrollingBackgroundScene.render(framebuffer);
                break;
            case 6:
                this.BakedLighting.render(framebuffer);
                break;
            case 7:
                this.BlockFade.render(framebuffer);  // Transition!
                break;
            case 8:
                this.Bobs.render(framebuffer);
                break;
            case 9:
                this.BunnyScene.render(framebuffer);
                break;
            case 10:
                this.CubeScene.render(framebuffer);
                break;
            case 11:
                this.CubeTunnelScene.render(framebuffer);
                break;
            case 12:
                this.FloodFillScene.render(framebuffer); // Transition!
                break;
            case 13:
                this.CinematicScroller.render(framebuffer);
                break;
            case 14:
                this.FloorScene.render(framebuffer);
                break;
            case 15:
                this.FrustumCullingScene.render(framebuffer);
                break;
            case 16:
                this.GearsScene.render(framebuffer);
                break;
            case 17:
                this.Gears2Scene.render(framebuffer);
                break;
            case 18:
                this.HoodlumScene.render(framebuffer);
                break;
            case 19:
                this.LedPlasmaScene.render(framebuffer);
                break;
            case 20:
                this.MetaballsScene.render(framebuffer);
                break;
            case 21:
                this.MovingTorusScene.render(framebuffer);
                break;
            case 22:
                this.ParticleStreamsScene.render(framebuffer);
                break;
            case 23:
                this.ParticleSystemScene.render(framebuffer);
                break;
            case 24:
                this.ParticleTorusScene.render(framebuffer); // has a zoom bump for sync
                break;
            case 25:
                this.PixelEffectScene.render(framebuffer);
                break;
            case 26:
                this.PlaneDeformationAbstractScene.render(framebuffer);
                break;
            case 27:
                this.PlanedeformationTunnelScene.render(framebuffer);
                break;
            case 28:
                this.PlasmaScene.render(framebuffer);
                break;
            case 29:
                this.PlatonianScene.render(framebuffer);
                break;
            case 30:
                this.PolarVoxelsScene.render(framebuffer);
                break;
            case 31:
                this.RazorScene.render(framebuffer);
                break;
            case 32:
                this.RotatingGearsScene.render(framebuffer);
                break;
            case 33:
                this.RotoZoomerScene.render(framebuffer);
                break;
            case 34:
                this.StarfieldScene.render(framebuffer);
                break;
            case 35:
                this.TexturedTorusScene.render(framebuffer);
                break;
            case 36:
                this.TitanEffectScene.render(framebuffer);
                break;
            case 37:
                this.TorusScene.render(framebuffer);
                break;
            case 38:
                this.TorusKnotScene.render(framebuffer);
                break;
            case 39:
                this.TorusKnotTunnelScene.render(framebuffer);
                break;
            case 40:
                this.TwisterScene.render(framebuffer);
                break;
            case 41:
                this.VoxelBallsScene.render(framebuffer);
                break;
            case 42:
                this.VoxelLandscapeScene.render(framebuffer);
                break;
            case 43:
                this.sineScrollerScene.render(framebuffer, time);
                break;
            default:
                this.sineScrollerScene.render(framebuffer, time);
        }
        // END DEMO  ************************************

        this.drawStats(framebuffer);
    }

    // debug info
    private drawStats(framebuffer: Framebuffer) {
        // get values from JS rocket
        framebuffer.drawText(8, 18, 'ROCKET TIME: ' + this.sm._audio.currentTime.toFixed(2), this.bmpFont);
        framebuffer.drawText(8, 36, 'ROTATION: ' + this._cameraRotation.getValue(this._row).toFixed(0), this.bmpFont);
        framebuffer.drawText(8, 36 + 18, 'EFFECT: ' + this._currentEffect, this.bmpFont);

        // update FPS and Memory usage
        this.statsFPS.update();
        this.statsMEM.update();
    }

    prepareSync() {
        console.info('this._syncDevice', this.sm._syncDevice)

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
    }

    onSyncReady() {
        console.info('onSyncReady', this.sm._syncDevice)
        this.sm._syncDevice.connected = true;
        this._effect = this.sm._syncDevice.getTrack('effect');
        this._snare = this.sm._syncDevice.getTrack('snare');
        this._bass = this.sm._syncDevice.getTrack('bass');
        this._cameraRotation = this.sm._syncDevice.getTrack('rotation');
        this._cameraDistance = this.sm._syncDevice.getTrack('distance');
        this._fov = this.sm._syncDevice.getTrack('FOV');
    }

    // row is only given if you navigate, or change a value on the row in Rocket
    // on interpolation change (hit [i]) no row value is sent, as the current there is the upper row of your block
    onSyncUpdate(newRow: number) {
        // console.info('onSyncUpdate', newRow);
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
