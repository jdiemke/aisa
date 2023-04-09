import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { Color } from '../../core/Color';
import { BunnyScene } from '../bunny/BunnyScene';
import { CubeScene } from '../cube/CubeScene';
import { time } from 'console';

export class Scene extends AbstractScene {

    // move
    private start: number;

    // move
    private texture: Texture;
    private mask: Texture;
    private texture2: Texture;
    private heightmap: Texture;
    private heightmapSphere: Texture;
    private texture4: Texture;
    private texture5: Texture;
    private baked: Texture;
    private texture6: Texture;
    private texture7: Texture;
    private texture8: Texture;
    private texture9: Texture;
    private texture10: Texture;
    private metalheadz: Texture;
    private platonian: Texture;
    private dirt: Texture;
    private texture11: Texture;
    private texture12: Texture;
    private texture13: Texture;
    private texture14: Texture;
    private texture15: Texture;
    private revision: Texture;
    private lab2: Texture;
    private hoodlumLogo: Texture;
    private blurred: Texture;
    private envmap: Texture;
    private particleTexture: Texture;
    private particleTexture2: Texture;
    private noise: Texture;
    private rave: Texture;
    private metal: Texture;
    private micro: Texture;
    private hlm: Texture;
    private meth: Texture;
    private displacementMap: Texture;
    private cross: Texture;
    private skybox: {
        back?: Texture,
        down?: Texture,
        front?: Texture,
        left?: Texture,
        right?: Texture,
        up?: Texture
    } = {};
    private abstract: Texture;
    private kiss: Texture;
    private myAudio: HTMLAudioElement;
    private spheremap: Texture;
    private overlay: Texture;

    private flood: Texture;

    // move
    private fpsStartTime: number = Date.now();
    private fpsCount: number = 0;
    private fps: number = 0;

    private accumulationBuffer: Uint32Array;
    private scene: CubeScene;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.accumulationBuffer = new Uint32Array(framebuffer.width * framebuffer.height);
        this.scene = new CubeScene();
        return Promise.all([
            this.scene.init(framebuffer),
            this.createTexture(require('../../assets/flood.png'), false).then(texture => this.flood = texture),

            this.createTexture(require('../../assets/kiss.png'), true).then(texture => this.kiss = texture),
            this.createTexture(require('../../assets/spheremap.png'), false).then(texture => this.spheremap = texture),
            this.createTexture(require('../../assets/textures/metall.png'), false).then(texture => this.metal = texture),
            this.createTexture(require('../../assets/logo.png'), false).then(texture => this.texture = texture),
            this.createTexture(require('../../assets/razor1911.png'), true).then(texture => this.texture2 = texture),
            this.createTexture(require('../../assets/heightmap.png'), false).then(texture => this.heightmap = texture),
            this.createTexture(require('../../assets/metalheadz.png'), false).then(texture => this.metalheadz = texture),
            this.createTexture(require('../../assets/font.png'), true).then(texture => this.texture4 = texture),
            this.createTexture(require('../../assets/atlantis.png'), false).then(texture => this.texture5 = texture),
            this.createTexture(require('../../assets/lens.png'), true).then(texture => this.texture6 = texture),
            this.createTexture(require('../../assets/ball2.png'), true).then(texture => this.texture7 = texture),
            this.createTexture(require('../../assets/pandabear.png'), false).then(texture => this.texture8 = texture),
            this.createTexture(require('../../assets/battleofilona.png'), false).then(texture => this.texture9 = texture),
            this.createTexture(require('../../assets/spark.png'), true).then(texture => this.texture10 = texture),
            this.createTexture(require('../../assets/ring.png'), true).then(texture => this.texture11 = texture),
            this.createTexture(require('../../assets/sky.png'), true).then(texture => this.texture12 = texture),
            this.createTexture(require('../../assets/bokeh.png'), true).then(texture => this.texture13 = texture),
            this.createTexture(require('../../assets/led.png'), false).then(texture => this.texture14 = texture),
            this.createTexture(require('../../assets/revision.png'), false).then(texture => this.revision = texture),
            this.createTexture(require('../../assets/lab2.png'), false).then(texture => this.lab2 = texture),

            this.createTexture(require('../../assets/skybox/skybox_back.png'), false).then(texture => this.skybox.back = texture),
            this.createTexture(require('../../assets/skybox/skybox_down.png'), false).then(texture => this.skybox.down = texture),
            this.createTexture(require('../../assets/skybox/skybox_front.png'), false).then(texture => this.skybox.front = texture),
            this.createTexture(require('../../assets/skybox/skybox_left.png'), false).then(texture => this.skybox.left = texture),
            this.createTexture(require('../../assets/skybox/skybox_right.png'), false).then(texture => this.skybox.right = texture),
            this.createTexture(require('../../assets/skybox/skybox_up.png'), false).then(texture => this.skybox.up = texture),

            this.createTexture(require('../../assets/platonian_baked.png'), false).then(texture => this.platonian = texture),
            this.createTexture(require('../../assets/meth.png'), true).then(texture => this.meth = texture),
            this.createProceduralTexture().then(texture => this.texture15 = texture),
            this.createProceduralTexture2().then(texture => this.particleTexture = texture),
            this.createProceduralTexture3().then(texture => this.particleTexture2 = texture),
            TextureUtils.generateProceduralNoise().then(texture => this.noise = texture),
            this.createProceduralDisplacementMap().then(texture => this.displacementMap = texture),
            this.createTexture(require('../../assets/hoodlumLogo.png'), true).then(texture => this.hoodlumLogo = texture),
            this.createTexture(require('../../assets/abstract.png'), false).then(texture => this.abstract = texture),
            this.createTexture(require('../../assets/rave.png'), false).then(texture => this.rave = texture),
            this.createTexture(require('../../assets/microstrange.png'), false).then(texture => this.micro = texture),
            this.createTexture(require('../../assets/Backed.png'), false).then(texture => this.baked = texture),
            this.createTexture(require('../../assets/blurredBackground.png'), false).then(texture => this.blurred = texture),
            this.createTexture(require('../../assets/hlm.png'), true).then(texture => this.hlm = texture),
            this.createTexture(require('../../assets/cross.png'), true).then(texture => this.cross = texture),
            this.createTexture(require('../../assets/envmap.png'), false).then(texture => this.envmap = texture),
            this.createTexture(require('../../assets/heightmapSphere.png'), false).then(texture => this.heightmapSphere = texture),
            this.createTexture(require('../../assets/mask.png'), true).then(texture => this.mask = texture),
            this.createTexture(require('../../assets/dirt.png'), true).then(texture => this.dirt = texture),
            this.createTexture(require('../../assets/haujobb-overlay.png'), true).then(texture => this.overlay = texture),

        ]).then(() => {
            // Web Audio API
            // FIXME: put this into a Player Class
            framebuffer.precompute(this.heightmap );

            const audioContext = new AudioContext();
            const request = new XMLHttpRequest();
            request.open('GET', require('../../assets/sound/xmix_q2_final.ogg'), true);
            request.responseType = 'arraybuffer';
            request.onload = () => {
                const undecodedAudio = request.response;
                audioContext.decodeAudioData(undecodedAudio,
                    (buffer) => {
                        const sourceBuffer = audioContext.createBufferSource();
                        sourceBuffer.buffer = buffer;
                        sourceBuffer.connect(audioContext.destination);
                        sourceBuffer.loop = true;
                        sourceBuffer.start(audioContext.currentTime);
                        this.start = Date.now();
                    });
            };

            request.send();
        });
    }

    public render(framebuffer: Framebuffer): void {
        const currentTime: number = Date.now();

        if (currentTime > this.fpsStartTime + 1000) {
            this.fpsStartTime = currentTime;
            this.fps = this.fpsCount;
            this.fpsCount = 0;
        }
        this.fpsCount++;




        {
            framebuffer.pixelate();
        }

            framebuffer.drawPlaneDeformation(currentTime, this.texture5);



        // TODO:
        // * build level in code (portals and areas)
        // * use controllable camera to move
        // TODO: Front Mission Modell in Blender
        /**
         * TODO:
         * - Draw Vector ART in SVG Inkscape
         * - Vectorize with Blender and Display
         */
        /**
         * TODO:
         * - transition effects with alpha layer
         * - wormhole particle tunnel
         * - rubiks cube animation :-)
         * - cube with animated texture
         * - Oldskool amiga screen with disk loading and decrunching
         * - screen exploding intro cubes
         * - Split red green and blue channels and displace them in x direction
         */
        /**
         * TODO:
         * - Stripe landscape: http://farm3.static.flickr.com/2653/5710494901_2ca6ddbfb2_b.jpg
         *   maybe with sync to bass and fft
         * - Blender modells (Flat, textured, GI baked)
         * - particle tunnel
         * - ribbons on curves
         * - dof
         */
        // TS SoftSynth Project
        // http://natureofcode.com/book/
        // https://noisehack.com/generate-noise-web-audio-api/
        // https://noisehack.com/custom-audio-effects-javascript-web-audio-api/
        // https://noisehack.com/how-to-build-supersaw-synth-web-audio-api/
        // https://noisehack.com/build-music-visualizer-web-audio-api/
        // https://noisehack.com/how-to-build-monotron-synth-web-audio-api/
        // https://davidwalsh.name/web-audio-api
        // https://codepen.io/gregh/post/recreating-legendary-8-bit-games-music-with-web-audio-api
        // https://developer.mozilla.org/en-US/docs/Games/Techniques/Audio_for_Web_Games
        // https://www.html5rocks.com/en/tutorials/webaudio/intro/

        // TODO:
        // - Progress Bar for Loading
        // - Web Audio API
        // - blasphemy line sphere with particles and blur
        // - fractal landscape fade in / out
        // - particle emitter
        // - plane deformation on rendererd scenes
        // - alpha blend between different or same scene
        // - fade to white
        // - spike ball / particle and 3d mesh with normals
        // - glow
        // - kewlers cube torus
        // - kewlsers recht billboard spikeball
        // - kewslers rect billboard cylinder
        // seminars:
        // - https://www.youtube.com/playlist?list=PLwbFJIXXSsXvbpDxOaaBrxSBdLUW1hdax
        // - https://www.youtube.com/watch?v=XZLqwXdXjqY
        // - https://www.youtube.com/watch?v=nt-BpAYMeJs&list=PLNqQO7lFY6dmH5kMSWtuRP6ZhBiQdQIU1&index=5
        // - https://www.youtube.com/watch?v=WgUkCRvti3Y&list=PLNqQO7lFY6dlPOg7cA1SczEU0Y7UW6iMW
        // - https://www.youtube.com/watch?v=7wYq6O-g2U8&list=PLNqQO7lFY6dm_GROVFIZ6C6mUINMnlpyC
        // - https://www.youtube.com/watch?v=hszyYAT5R1Q&list=PLNqQO7lFY6dm_GROVFIZ6C6mUINMnlpyC&index=5
        // - https://www.youtube.com/watch?v=4Q5sgNCN2Jw&list=PL2EEF025A89BAA0FC
        // - https://www.youtube.com/watch?v=TbcZyAO6K7c
        // - https://www.youtube.com/watch?v=2p2JcHzRlJU
        // - https://www.youtube.com/watch?v=QT2ftidLTn4
        // - https://www.youtube.com/watch?v=Oo-jlpvhTcY





        // NEW EFFECTS:
        // * https://www.youtube.com/watch?v=bg-MTl_nRiU
        // * SPIKEBALL KYLE
        // plane deformation with texture to LED
        // 16 / 9 --> 320 x 180


        /*
        this.framebuffer.setCullFace(CullFace.BACK);
        //this.framebuffer.drawBlenderScene(time, this.texture4, this.particleTexture2);
        this.framebuffer.setBob(this.spheremap);
        this.framebuffer.drawPlanedeformationTunnelV2(time, this.abstract, this.metal);
        this.framebuffer.shadingSphereEnv(time*0.0002);
         this.framebuffer.drawTexture(0, 75, this.hoodlumLogo, (Math.sin(time * 0.0003) + 1) * 0.5);
        */

        /**
         * Inspiration:
         * - https://www.youtube.com/watch?v=7kLNXg4BmM8
         * - https://www.youtube.com/watch?v=PLrio-uwvwk
         * - https://www.youtube.com/watch?v=XJKDb4ByZ7Y
         */
        /**
         * TODO:
         * - http://sol.gfxile.net/gp/ch18.html
         * - http://insolitdust.sourceforge.net/code.html
         * - http://sol.gfxile.net/sphere/index.html
         * - http://4matprojects.blogspot.de/
         * - http://sol.gfxile.net/particle/index.html
         * - http://sol.gfxile.net/gp/ch19.html
         * - http://www.flipcode.com/archives/The_Art_of_Demomaking-Issue_07_Bump_Mapping.shtml
         * - http://sol.gfxile.net/interpolation/index.html
         * - http://adrianboeing.blogspot.de/2011/06/deform-textured-interference-effect-in.html
         * - particle ball pulsating (https://www.youtube.com/watch?v=NPZEkhtXhgE)
         * - metaballs
         * - particle stream
         * - scene with baked lighting & wobbling ball & camera animation
         * - DOF flares
         * - demo tool http://peisik.untergrund.net/engines/
         * - https://www.youtube.com/watch?v=ghX1-EUx-fQ&index=7&list=PLPnuj18PSHazbti_tw1zoQ23fqx8-ZZP7 (min 15)
         */

        //  this.framebuffer.cinematicScroller(this.texture4, time);
        //  this.framebuffer.drawTextureScaledLame(0,0, 16,16, this.texture7);
        // http://doc.babylonjs.com/tutorials/discover_basic_elements

        // implement modells with baked shaods and lighting :)
        // http://iquilezles.org/www/index.htm
        // http://iquilezles.org/www/articles/normals/normals.htm
        // http://iquilezles.org/www/articles/areas/areas.htm
        // http://iquilezles.org/www/articles/frustum/frustum.htm
        // http://iquilezles.org/www/articles/frustumcorrect/frustumcorrect.htm
        // http://iquilezles.org/www/articles/deform/deform.htm
        // http://www.gamers.org/dEngine/quake/papers/ddjzsort.html
        // http://fabiensanglard.net/quakeSource/quakeSourceRendition.php

        //  this.framebuffer.shadingSphereClip((time ) * 0.003);
        // this.framebuffer.cinematicScroller(this.texture4, time );
        //   this.framebuffer.drawText(8, 192 - 18, 'TRIANGLE NEAR PLANE CLIPPING', this.texture4);

        // TODO:
        // - textured cube / dynamic textures
        // - skybox
        // - specular highlights
        // - 3d bobs (with shadows)
        // - plane deformation effect
        // - sine scroller (color bar texture)
        // - dot tunnel
        // - 2d / 3d start field
        // - 2d vector start
        // - wobble logo
        // - text writer
        // - scroller / sine scroller
        // - fractalplasma fade in
        // - water effect
        // - cross fade
        // - 2d bump mapping ( maybe on 3d object)
        // - smooth shading (gouraud)
        // - voxel landscape with color
        // - metaballs
        // - rasterbars
        // - 3d particles / 3d particle collision
        // - vector morphing
        // - voxel tunnel / sphere / torus
        // - stencil vectors
        // - chess zoomer / chess waver
        // - raycaster

        // this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.texture5.texture);
        // this.framebuffer.shadingTorus2(time * 0.02);
        // this.framebuffer.drawTexture(32, 60, this.texture2, 1.0);

        // this.framebuffer.clear();

        // this.framebuffer.wireFrameTerrain(time*0.01, this.texture3);
        // this.framebuffer.pixelate();



        //     this.framebuffer.wireFrameTerrain(time*0.008,this.texture3);
        //    this.framebuffer.cinematicScroller(this.texture4, time );
        // todo: radial blur -> pouet.net

        // http://www.cubic.org/docs/camera.htm
        // http://www.cubic.org/docs/3dclip.htm
        // http://www.cubic.org/docs/backcull.htm

        // this.framebuffer.addReflections();

        // this.framebuffer.drawRaster();
        // this.framebuffer.enableBackfaceCulling();
        // this.framebuffer.setCullFace(FRONT);

        // TODO: text
        // 3d line clipping for fly by :)
        // different transitions:
        // - stripes etc
        // - chessboard
        // wobble logo
        // ball 3d with precalculated sizes lookup
        // starfield 2d /3d
        // wormhole
        // glitch logo
    }

    // Move
    public createProceduralTexture(): Promise<Texture> {
        return new Promise((resolve) => {
            const texture = new Texture();
            texture.texture = new Uint32Array(256 * 256);

            const rng = new RandomNumberGenerator();
            rng.setSeed(100);

            for (let y = 0; y < 256; y++) {
                for (let x = 0; x < 256; x++) {
                    texture.texture[x + y * 256] = (rng.getFloat() * 256) | 0 | 255 << 24;
                }
            }

            texture.width = 256;
            texture.height = 256;
            resolve(texture);
        });
    }

    // Move
    public createProceduralTexture2(): Promise<Texture> {
        return new Promise((resolve) => {
            const texture = new Texture();
            texture.texture = new Uint32Array(256 * 256);

            const rng = new RandomNumberGenerator();
            rng.setSeed(100);

            for (let y = 0; y < 256; y++) {
                for (let x = 0; x < 256; x++) {
                    const dx = 127 - x
                    const dy = 127 - y
                    const r = Math.sqrt(dx * dx + dy * dy) / 127;
                    let c = 1 - r;
                    c = c * c;
                    if (r > 1) c = 0;
                    c = Math.min(1, c * 40);
                    texture.texture[x + y * 256] = 255 | 205 << 8 | 255 << 16 | (c * 255) << 24;
                }
            }

            texture.width = 256;
            texture.height = 256;
            resolve(texture);
        });
    }


    public createProceduralTexture3(): Promise<Texture> {
        return new Promise((resolve) => {
            const texture = new Texture();
            texture.texture = new Uint32Array(256 * 256);

            const rng = new RandomNumberGenerator();
            rng.setSeed(100);

            for (let y = 0; y < 256; y++) {
                for (let x = 0; x < 256; x++) {
                    const dx = 127 - x
                    const dy = 127 - y
                    const r = Math.sqrt(dx * dx + dy * dy) / 127;
                    let c = 1 - r;
                    c = c * c * c;
                    if (r > 1) c = 0;
                    c = Math.min(1, c * 2.9);

                    texture.texture[x + y * 256] = 235 | 255 << 8 | 235 << 16 | (c * 255) << 24;
                }
            }

            texture.width = 256;
            texture.height = 256;
            resolve(texture);
        });
    }


    // Move
    public createProceduralDisplacementMap(): Promise<Texture> {
        return new Promise((resolve) => {
            const texture = new Texture();
            texture.texture = new Uint32Array(256 * 256);

            const rng: RandomNumberGenerator = new RandomNumberGenerator();
            rng.setSeed(100);

            texture.texture.fill(128 | 255 << 24);

            for (let y = 0; y < 256; y++) {
                for (let x = 0; x < 256; x++) {
                    const dx = 127 - x
                    const dy = 127 - y
                    const r = Math.sqrt(dx * dx + dy * dy) / 127;
                    let c = 1 - r;
                    c = c * c * c;
                    if (r > 1) c = 0;
                    c = Math.min(1, c * 2.9);

                    texture.texture[x + y * 256] = (texture.texture[x + y * 256] & 0xffffff00) | texture.texture[x + y * 256] & 0xff + (c * 255);
                }
            }

            texture.width = 256;
            texture.height = 256;
            resolve(texture);
        });
    }

    public createTexture(path: string, hasAlpha: boolean): Promise<Texture> {
        return new Promise<Texture>(((resolve: (texture?: Texture) => void): void => {
            const img = new Image();
            img.onload = () => {
                const texture = new Texture();
                texture.texture = this.getImageData(img, hasAlpha);
                texture.width = img.width;
                texture.height = img.height;
                resolve(texture);
            };
            img.onerror = () => resolve();
            img.src = path;
        }));
    }

    getImageData(image: HTMLImageElement, withAlpha: boolean = false): Uint32Array {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context: CanvasRenderingContext2D = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        const data = context.getImageData(0, 0, image.width, image.height).data;
        const conv = new Uint32Array(data.length / 4);
        let c = 0;
        for (let i = 0; i < data.length; i += 4) {
            if (withAlpha) {
                conv[c] = (data[i + 3] << 24) | (data[i + 2] << 16) | (data[i + 1] << 8) | data[i + 0];
            } else {
                conv[c] = (255 << 24) | (data[i + 2] << 16) | (data[i + 1] << 8) | data[i + 0];
            }

            c++;
        }
        return conv;
    }

}
