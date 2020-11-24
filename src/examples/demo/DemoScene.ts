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
import { CinematicScroller } from '../cinematic-scroller/CinematicScroller';
import { CubeScene } from '../cube/CubeScene';
import { CubeTunnelScene } from '../cube-tunnel/CubeTunnelScene';
import { DifferentMd2ModelScene } from '../different-md2/DifferentMd2ModelScene';
import { DistortedSphereScene } from '../distorted-sphere/DistortedSphereScene';
import { DofBallsScene } from '../dof-balls/DofBallsScene';
import { FloodFillScene } from '../flood-fill/FloodFillScene';
import { FloorScene } from '../floor/FloorScene';
import { FrustumCullingScene } from '../frustum-culling/FrustumCullingScene';
import { Gears2Scene } from '../gears-2/Gears2Scene';
import { GearsScene } from '../gears/GearsScene';
import { HoodlumScene } from '../hoodlum/HoodlumScene';
import { LedPlasmaScene } from '../led-plasma/LedPlasmaScene';
import { LensScene } from '../lens/LensScene';
import { Md2ModelScene } from '../md2/Md2ModelScene';
import { MetaballsScene } from '../metaballs/MetaballsScene';
import { MetalHeadzScene } from '../metalheadz/MetalHeadzScene';
import { Mode7Scene } from '../mode-7/Mode7Scene';
import { MovingTorusScene } from '../moving-torus/MovingTorusScene';
import { ParticleStreamsScene } from '../particle-streams/ParticleStreamsScene';
import { ParticleSystemScene } from '../particle-system/ParticleSystemScene';
import { ParticleTorusScene } from '../particle-torus/ParticleTorusScene';
import { PixelEffectScene } from '../pixel-effect/PixelEffectScene';
import { PlaneDeformationAbstractScene } from '../planedeformation-abstract/PlaneDeformationAbstractScene';
import { PlanedeformationTunnelScene } from '../planedeformation-tunnel/PlanedeformationTunnelScene';
import { PlasmaScene } from '../plasma/PlasmaScene';
import { PlatonianScene } from '../platonian/PlatonianScene';
import { PolarVoxelsScene } from '../polar-voxels/PolarVoxelsScene';
import { RazorScene } from '../razor/RazorScene';
import { RotatingGearsScene } from '../rotating-gears/RotatingGearsScene';
import { RotoZoomerScene } from '../roto-zoomer/RotoZoomerScene';
import { ScrollingBackgroundScene } from '../scrolling-background/ScrollingBackgroundScene';
import { SineScrollerScene } from '../sine-scroller/SineScrollerScene';
import { StarfieldScene } from '../starfield/StarfieldScene';
import { TexturedTorusScene } from '../textured-torus/TexturedTorusScene';
import { ThirdPersonCameraScene } from '../third-person-camera/ThirdPersonCameraScene';
import { TitanEffectScene } from '../titan-effect/TitanEffectScene';
import { TorusKnotScene } from '../torus-knot/TorusKnotScene';
import { TorusKnotTunnelScene } from '../torus-knot-tunnel/TorusKnotTunnelScene';
import { TorusScene } from '../torus/TorusScene';
import { ToxicDotsScene } from '../toxic-dots/ToxicDotsScene';
import { TwisterScene } from '../twister/TwisterScene';
import { VoxelBallsScene } from '../voxel-balls/VoxelBallsScene';
import { VoxelLandScapeFadeScene } from '../voxel-landscape-fade/VoxelLandcapeFadeScene';
import { VoxelLandscapeScene } from '../voxel-landscape/VoxelLandscapeScene';
import { WavefrontScene } from '../wavefront/WavefrontScene';
import { WaveFrontTextureScene } from '../wavefront-texture/WaveFrontTextureScene';

// Stats
import Stats = require('stats.js');

// Transitions
export enum TransitionMethods {
    BLOCKFADE = 1,
    CROSSFADE = 2,
    FADEIN = 3,
    VERTICAL = 4,
}

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

    // effects
    private abscractCubeScene: AbstractCube;
    private BakedLighting: BakedLighting;
    private BlockFade: BlockFade;
    private Bobs: Bobs;
    private BumpMap: BumpMap;
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
        this.statsMEM.showPanel(2);
        this.statsMEM.dom.style.cssText = `position:absolute;top:0px;left:640px;`;
        document.body.appendChild(this.statsMEM.dom);

        // Stats - Frames per Seconds
        this.statsFPS = new Stats();
        this.statsFPS.showPanel(0);
        this.statsFPS.dom.style.cssText = 'position:absolute;top:50px;left:640px;';
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

        // Effects
        this.abscractCubeScene = new AbstractCube();
        this.BakedLighting = new BakedLighting();
        this.BlockFade = new BlockFade();
        this.Bobs = new Bobs();
        this.BumpMap = new BumpMap();
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
        this.PlasmaScene = new PlasmaScene();
        this.PlatonianScene = new PlatonianScene();
        this.PolarVoxelsScene = new PolarVoxelsScene();
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

        this.sineScrollerScene.init(framebuffer);

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
            // these two cause the background of metalheadz to go black
            this.Md2ModelScene.init(framebuffer),
            this.DifferentMd2ModelScene.init(framebuffer),
            this.abscractCubeScene.init(framebuffer),
            this.lensScene.init(framebuffer),
            this.sineScrollerScene.init(framebuffer),
            this.metalHeadzScene.init(framebuffer),
            this.ScrollingBackgroundScene.init(framebuffer),
            this.BumpMap.init(framebuffer),
            this.BakedLighting.init(framebuffer),
            this.BlockFade.init(framebuffer),
            this.Bobs.init(framebuffer),
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
            this.WavefrontScene.init(framebuffer),
            this.TwisterScene.init(framebuffer)
        ], (percent: number) => {
            // update the progress bar
            const outputX = 640 / (100 / percent);
            loadingRef.style.width = `${outputX}px`;
            this.statsMEM.update();
        });
    };

    public onInit(): void {
        document.getElementById('loading').style.width = `0px`;
    }

    private allProgress(proms: Array<Promise<void>>, progressCallback: Function) {
        let d = 0;
        progressCallback(0);
        for (const p of proms) {
            p.then(() => {
                d++;
                progressCallback((d * 100) / proms.length);
            });
        }
        return Promise.all(proms);
    }

    /**
     * Transitions from one effect to another using using "transition" value from JSRocket
     * uses textureBackground as the temp
     *
     * @param  {Framebuffer} framebuffer            pixels
     * @param  {Any} transitionSceneFrom            previous effect
     * @param  {Any} transitionSceneTo              effect we are transitioning to
     * @param  {number} transitionMethod            transition effect (1 - blockfade, 2-cross-fade, pixelate, wipe)
     */
    private transition(framebuffer: Framebuffer, transitionSceneFrom: any, transitionSceneTo: any, transitionMethod?: number) {
        // render the 'To' effect into the framebuffer
        transitionSceneTo.render(framebuffer, this.timeMilliseconds);

        //  copy framebuffer to the texture
        framebuffer.fastFramebufferCopy(this.lensScene.textureBackground.texture, framebuffer.framebuffer);

        // render 'From' effect into framebuffer
        transitionSceneFrom.render(framebuffer, this.timeMilliseconds);

        // apply transition to framebuffer (fromEffect) using texture (toEffect)
        switch (transitionMethod) {
            case TransitionMethods.BLOCKFADE:
                this.BlockFade.blockFade(framebuffer, this.lensScene.textureBackground, this._transition.getValue(this._row).toFixed(0), 0);
                break;
            case TransitionMethods.CROSSFADE:
                this.BlockFade.crossFade(framebuffer, this.lensScene.textureBackground, this._transition.getValue(this._row).toFixed(0));
                break;
            case TransitionMethods.FADEIN:
                this.BlockFade.fadeIn(framebuffer, this.lensScene.textureBackground, this._transition.getValue(this._row).toFixed(0), 0);
                break;
            case TransitionMethods.VERTICAL:
                this.BlockFade.fadeSide(framebuffer, this.lensScene.textureBackground, this._transition.getValue(this._row).toFixed(0), 0, this.timeMilliseconds);
                break;
            default:
                this.BlockFade.crossFade(framebuffer, this.lensScene.textureBackground, this._transition.getValue(this._row).toFixed(0));
        }
    }

    public render(framebuffer: Framebuffer): void {

        // get time and values from music
        this.updateMusic(framebuffer);

        // this._currentEffect = 0;

        // use values from JS Rocket to determine which scene to show
        switch (Number(this._currentEffect)) {
            case 0: // testing placeholder
                break;
            case 0.5:
                this.transition(framebuffer, this.metalHeadzScene, this.metalHeadzScene, TransitionMethods.FADEIN);
                break;
            case 1:
                this.metalHeadzScene.render(framebuffer, this.timeMilliseconds);
                break;
            case 1.5:
                this.transition(framebuffer, this.metalHeadzScene, this.abscractCubeScene, TransitionMethods.BLOCKFADE);
                break;
            case 2:
                this.abscractCubeScene.render(framebuffer, this.timeMilliseconds);
                break;
            case 2.5:
                this.transition(framebuffer, this.abscractCubeScene, this.sineScrollerScene, TransitionMethods.CROSSFADE);
                break;
            case 3:
                this.sineScrollerScene.render(framebuffer, this.timeMilliseconds);
                framebuffer.fastFramebufferCopy(this.lensScene.textureBackground.texture, framebuffer.framebuffer);
                break;
            case 3.5:
                this.transition(framebuffer, this.sineScrollerScene, this.DofBallsScene, TransitionMethods.BLOCKFADE);
                break;
            case 4:
                this.DofBallsScene.render(framebuffer, this.timeMilliseconds);
                break;
            case 4.5:
                this.transition(framebuffer, this.DofBallsScene, this.Md2ModelScene, TransitionMethods.BLOCKFADE);
                break;
            case 5:
                this.Md2ModelScene.render(framebuffer);
                break;
            case 5.5:
                this.transition(framebuffer, this.Md2ModelScene, this.BakedLighting, TransitionMethods.BLOCKFADE);
                break;
            case 6:
                this.BakedLighting.render(framebuffer);
                break;
            case 6.5:
                this.transition(framebuffer, this.BakedLighting, this.BumpMap, TransitionMethods.BLOCKFADE);
                break;
            case 7:
                this.BumpMap.render(framebuffer);
                break;
            case 7.5:
                this.transition(framebuffer, this.BumpMap, this.TwisterScene, TransitionMethods.BLOCKFADE);
                break;
            case 8: // twister cannot transition out
                this.TwisterScene.render(framebuffer);
                break;
            case 8.5:
                this.transition(framebuffer, this.TwisterScene, this.RotatingGearsScene, TransitionMethods.BLOCKFADE);
                break;
            case 9:
                this.RotatingGearsScene.render(framebuffer);
                break;
            case 9.5:
                this.transition(framebuffer, this.RotatingGearsScene, this.DifferentMd2ModelScene, TransitionMethods.BLOCKFADE);
                break;
            case 10:
                this.DifferentMd2ModelScene.render(framebuffer)
                break;
            case 10.5:
                this.transition(framebuffer, this.DifferentMd2ModelScene, this.CubeTunnelScene, TransitionMethods.BLOCKFADE);
                break;
            case 11: // cube tunnel is really nice, but is really SLOW (40FPS)..extra slow with transtion
                this.CubeTunnelScene.render(framebuffer);
                break;
            case 11.5:
                this.transition(framebuffer, this.CubeTunnelScene, this.FloodFillScene, TransitionMethods.BLOCKFADE);
                break;
            case 12: // floodfill does not transtion well - put next to still image
                this.FloodFillScene.render(framebuffer);
                break;
            case 13: // multi-layered effect do not transition well
                this.RotoZoomerScene.render(framebuffer);
                this.CubeScene.renderBackground(framebuffer);
                break;
            case 13.5:
                this.RotoZoomerScene.render(framebuffer);
                this.transition(framebuffer, this.CubeScene, this.FloorScene, TransitionMethods.BLOCKFADE);
                break;
            case 14:
                this.FloorScene.render(framebuffer);
                break;
            case 14.5:
                this.transition(framebuffer, this.FloorScene, this.PlatonianScene, TransitionMethods.BLOCKFADE);
                break;
            case 15:
                this.PlatonianScene.render(framebuffer);
                break;
            case 15.5:
                this.transition(framebuffer, this.PlatonianScene, this.GearsScene, TransitionMethods.BLOCKFADE);
                break;
            case 16: // remove gearScene as duplicate. keep cooler gears2Scene instead
                this.GearsScene.render(framebuffer);
                break;
            case 16.5:
                this.transition(framebuffer, this.GearsScene, this.Gears2Scene, TransitionMethods.BLOCKFADE);
                break;
            case 17:
                this.Gears2Scene.render(framebuffer);
                break;
            case 17.5:
                this.transition(framebuffer, this.Gears2Scene, this.HoodlumScene, TransitionMethods.BLOCKFADE);
                break;
            case 18:
                this.HoodlumScene.render(framebuffer);
                break;
            case 18.5:
                this.transition(framebuffer, this.HoodlumScene, this.LedPlasmaScene, TransitionMethods.BLOCKFADE);
                break;
            case 19:
                this.LedPlasmaScene.render(framebuffer);
                break;
            case 19.5:
                this.transition(framebuffer, this.LedPlasmaScene, this.MetaballsScene, TransitionMethods.BLOCKFADE);
                break;
            case 20: // remove - too simple
                this.MetaballsScene.render(framebuffer);
                break;
            case 20.5:
                this.transition(framebuffer, this.MetaballsScene, this.MovingTorusScene, TransitionMethods.BLOCKFADE);
                break;
            case 21:
                this.MovingTorusScene.render(framebuffer);
                break;
            // TODO --- KEEP DEMO TO 20-25 EFFECTS MAX for 10-12 seconds each effect
            // ELIMINATE / CONSOLIDATE EFFECTS FROM BELOW
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
                this.FrustumCullingScene.render(framebuffer);
                break;
            case 30:
                this.PolarVoxelsScene.render(framebuffer);
                break;
            case 31:
                this.RazorScene.render(framebuffer);
                break;
            case 32:
                this.TorusKnotTunnelScene.render(framebuffer);
                break;
            case 33:
                this.Bobs.render(framebuffer);
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
                break;
            case 40:
                this.ScrollingBackgroundScene.render(framebuffer);
                break;
            case 41:
                this.VoxelBallsScene.render(framebuffer);
                break;
            case 42:
                this.VoxelLandscapeScene.render(framebuffer);
                break;
            case 43:
                this.DistortedSphereScene.render(framebuffer);
                break;
            case 44:
                this.CinematicScroller.render(framebuffer);
                break;
            case 45:
                this.lensScene.render(framebuffer, this.timeMilliseconds);
                break;
            case 44:
                this.ThirdPersonCameraScene.render(framebuffer);
                break;
            case 45:
                this.Mode7Scene.render(framebuffer);
                break;
            case 46:
                this.VoxelLandScapeFadeScene.render(framebuffer);
                break;
            case 47:
                this.ToxicDotsScene.render(framebuffer);
                break;
            case 48:
                this.WavefrontScene.render(framebuffer); // dragon
                break;
            case 49:
                this.WaveFrontTextureScene.render(framebuffer); // monkey with grey texture map
                break;
            default:
                this.sineScrollerScene.render(framebuffer, this.timeMilliseconds);
        }

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
