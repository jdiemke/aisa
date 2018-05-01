import { CullFace } from './CullFace';
import Framebuffer from './Framebuffer';
import { Vector4f } from './math/index';
import { Matrix4f } from './math/Matrix4f';
import { Sphere } from './math/Sphere';
import { Vector3f } from './math/Vector3f';
import RandomNumberGenerator from './RandomNumberGenerator';
import Texture from './Texture';

declare function require(resource: string): string;

export class Canvas {

    public framebuffer: Framebuffer;

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private start: number;
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
    private myAudio: HTMLAudioElement;
    private spheremap: Texture;
    private boundRenderLoop: (time: number) => void;

    private fpsStartTime: number = Date.now();
    private fpsCount: number = 0;
    private fps: number = 0;

    private accumulationBuffer: Uint32Array = new Uint32Array(320 * 200);

    constructor(width: number, height: number) {
        this.canvas = document.createElement('canvas');

        this.canvas.width = width;
        this.canvas.height = height;

        this.canvas.style.cssText = 'image-rendering: optimizeSpeed;' + // FireFox < 6.0
            'image-rendering: -moz-crisp-edges;' + // FireFox
            'image-rendering: -o-crisp-edges;' +  // Opera
            'image-rendering: -webkit-crisp-edges;' + // Chrome
            'image-rendering: crisp-edges;' + // Chrome
            'image-rendering: -webkit-optimize-contrast;' + // Safari
            'image-rendering: pixelated; ' + // Future browsers
            '-ms-interpolation-mode: nearest-neighbor;'; // IE

        this.canvas.style.width = `${width * 2}px`;
        this.canvas.style.height = `${height * 2}px`;

        this.context = this.canvas.getContext('2d');

        this.context.oImageSmoothingEnabled = false;
        this.context.imageSmoothingEnabled = false;
        this.context.webkitImageSmoothingEnabled = false;

        this.framebuffer = new Framebuffer(320, 200);
        this.boundRenderLoop = this.renderLoop.bind(this);
    }

    /**
     * http://www.hugi.scene.org/online/coding/hugi%20se%204%20-%20index%20sorted%20by%20topic.htm
     * http://www.flipcode.com/archives/The_Art_of_Demomaking-Issue_01_Prologue.shtml
     * http://insolitdust.sourceforge.net/code.html
     *
     * http://www.wab.com/screen.php?screen=20
     * http://www.helixsoft.nl/articles/circle/sincos.htm
     * https://gamedev.stackexchange.com/questions/24957/doing-an-snes-mode-7-affine-transform-effect-in-pygame
     * https://www.coranac.com/tonc/text/mode7ex.htm
     *
     * http://codeincomplete.com/posts/javascript-racer-v1-straight/
     * http://www.extentofthejam.com/pseudo/
     *
     * http://hugi.scene.org/online/hugi24/coding%20graphics%20bonz%20sines%20and%20cosines%20for%20fun%20and%20profit.htm
     *
     * @memberof Canvas
     */
    public render(): void {

        const currentTime: number = Date.now();

        if (currentTime > this.fpsStartTime + 1000) {
            this.fpsStartTime = currentTime;
            this.fps = this.fpsCount;
            this.fpsCount = 0;
        }
        this.fpsCount++;

        let time: number = (Date.now() - this.start);
        time = time * 3 + 550000;
        time = time % (1150000);

        this.framebuffer.setCullFace(CullFace.FRONT);
        /*
                if (time < 5000) {
                    this.framebuffer.drawTitanEffect();
                    this.framebuffer.shadingTorus(time * 0.02);
                    this.framebuffer.drawTexture(32, 1, this.texture2, 1.0);
                } else if (time < 15000) {
                    this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.texture5.texture);
                    this.framebuffer.draw(this.texture, time);
                } else if (time < 25000) {
                    this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.texture5.texture);
                    this.framebuffer.drawLens(this.texture5, this.texture6, time);
                } else if (time < 30000) {
                    this.framebuffer.drawRotoZoomer(this.texture);
                    this.framebuffer.shadingDemo(time * 0.02);
                } else if (time < 35000) {
                    this.framebuffer.drawRotoZoomer(this.texture);
                    this.framebuffer.shadingSphere(time * 0.01);
                } else if (time < 40000) {
                    this.framebuffer.drawRotoZoomer(this.texture);
                    this.framebuffer.wireFrameSphereClipping(time * 0.01);
                } else if (time < 45000) {
                    this.framebuffer.drawVoxelLandscape2(this.heightmap, time);
                    this.framebuffer.drawTexture(32, 1, this.texture2, 1.0);
                } else if (time < 50000) {
                    this.framebuffer.drawOldSchoolPlasma(time);
                } else if (time < 55000) {
                    // https://www.youtube.com/watch?v=ccYLb7cLB1I&t=773s
                    this.framebuffer.drawMetaballs();
                } else if (time < 60000) {
                    this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.texture5.texture);
                    this.framebuffer.shadingTorus2(time * 0.02);
                } else if (time < 70000) {
                    this.framebuffer.floodFill(this.texture5, time - 60000);
                } else if (time < 80000) {
                    this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.texture5.texture);
                    this.framebuffer.drawBobs(this.texture7, time);
                } else if (time < 95000) {
                    this.framebuffer.blockFace(this.texture5, time, 80000);
                } else if (time < 140000) {
                    this.framebuffer.scrollingBackground(this.texture8, time - 95000);
                } else if (time < 160000) {
                    this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.texture9.texture);
                    this.framebuffer.cinematicScroller(this.texture4, time - 140000);
                } else if (time < 185000) {
                    this.framebuffer.shadingSphereClip((time - 170000) * 0.003);
                    this.framebuffer.cinematicScroller(this.texture4, time - 160000);
                } else if (time < 200000) {
                    this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.texture12.texture);
                    this.framebuffer.shadingTorus(time * 0.02);
                    this.framebuffer.drawLensFlare(time - 185000, [
                        { tex: this.texture10, scale: 0.0, alpha: 1.0 },
                        { tex: this.texture11, scale: 2.3, alpha: 0.5 },
                        { tex: this.texture13, scale: 1.6, alpha: 0.25 }
                    ]);
                } else if (time < 210000) {
                    this.framebuffer.blur();
                    this.framebuffer.shadingTorus3(time * 0.015);
                    this.framebuffer.drawTexture(32, 70, this.texture2, 1.0);
                } else if (time < 215000) {
                    this.framebuffer.led(time, this.texture14);
                    this.framebuffer.drawTexture(32, 64, this.texture2, 1.0);
                } else if (time < 230000) {
                    this.framebuffer.setBob(this.metal);
                    this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.texture5.texture);
                    this.framebuffer.shadingTorus4(time * 0.002);
                    this.framebuffer.drawLensFlare(time - 185000, [
                        { tex: this.texture10, scale: 0.0, alpha: 1.0 },
                        { tex: this.texture11, scale: 2.3, alpha: 0.5 },
                        { tex: this.texture13, scale: 1.6, alpha: 0.25 }
                    ]);
                    this.framebuffer.cinematicScroller(this.texture4, time);
                } else if (time < 240000) {
                    this.framebuffer.setBob(this.spheremap);
                    this.framebuffer.clear();
                    this.framebuffer.shadingTorusENvironment(time * 0.006);
                    this.framebuffer.drawLensFlare(time - 185000, [
                        { tex: this.texture10, scale: 0.0, alpha: 1.0 },
                        { tex: this.texture11, scale: 2.3, alpha: 0.5 },
                        { tex: this.texture13, scale: 1.6, alpha: 0.25 }
                    ]);
                } else if (time < 250000) {
                    this.framebuffer.setCullFace(CullFace.BACK);
                    this.framebuffer.reproduceRazorScene(time * 0.003);
                    this.framebuffer.drawLensFlare(time - 185000, [
                        { tex: this.texture10, scale: 0.0, alpha: 1.0 },
                        { tex: this.texture11, scale: 2.3, alpha: 0.5 },
                        { tex: this.texture13, scale: 1.6, alpha: 0.25 }
                    ]);
                } else if (time < 260000) {
                    this.framebuffer.setCullFace(CullFace.BACK);
                    this.framebuffer.setBob(this.spheremap);
                    this.framebuffer.led(time, this.texture14);
                    this.framebuffer.reflectionBunny(time * 0.002);
                } else if (time < 270000) {
                    this.framebuffer.setCullFace(CullFace.BACK);
                    this.framebuffer.drawBlenderScene(time - 260000, this.texture4);
                } else if (time < 280000) {
                    this.framebuffer.drawStarField(time * 0.9);
                    this.framebuffer.setBob(this.spheremap);
                    this.framebuffer.setCullFace(CullFace.BACK);
                    this.framebuffer.reflectionBunny(time * 0.002);
                    this.framebuffer.scene7(time * 0.2, this.texture7);
                } else if (time < 290000) {
                    this.framebuffer.drawPlaneDeformation(time, this.metal);
                    this.framebuffer.drawTexture(32, 69, this.texture2, 1.0);
                } else if (time < 330000) {
                    this.framebuffer.drawLedTunnel(time, this.texture14);
                    this.framebuffer.setCullFace(CullFace.BACK);
                    this.framebuffer.shadingTorus5(time * 0.007, (Date.now() - this.start));
                    this.framebuffer.drawTexture(0, 75, this.hoodlumLogo, (Math.sin(time * 0.0003) + 1) * 0.5);
                } else if (time < 360000) {
                    this.framebuffer.drawParticleTorus(time, this.particleTexture);
                    this.framebuffer.drawTexture(0, 75, this.hoodlumLogo, (Math.sin(time * 0.0003) + 1) * 0.5);
                } else if (time < 380000) {
                    this.framebuffer.drawPlanedeformationTunnel(time, this.heightmap, this.metal);
                    const ukBasslineBpm = 140;
                    const ukBasslineClapMs = 60000 / ukBasslineBpm * 2;
                    const smashTime = (Date.now() - this.start) % ukBasslineClapMs;
                    const smash = (this.framebuffer.cosineInterpolate(0, 15, smashTime) -
                        this.framebuffer.cosineInterpolate(15, 200, smashTime) +
                        0.4 * this.framebuffer.cosineInterpolate(200, 300, smashTime) -
                        0.4 * this.framebuffer.cosineInterpolate(300, 400, smashTime)) * 35;
                    this.framebuffer.drawScaledTextureClipBi((320 / 2 - (this.hoodlumLogo.width + smash) / 2) | 0,
                        (200 / 2 - (this.hoodlumLogo.height - smash) / 2) | 0, this.hoodlumLogo.width + smash, (this.hoodlumLogo.height - smash) | 0, this.hoodlumLogo, 1.0);
                } else if (time < 400000) {
                    // THE NEXT LINE IS THE BOTTLENECK NOT THE SPHERE!
                    this.framebuffer.drawPlanedeformationTunnelV2(time, this.abstract, this.metal);
                    this.framebuffer.drawTexture(0, 75, this.hoodlumLogo, (Math.sin(time * 0.0003) + 1) * 0.5);
                } else if (time < 420000) {
                    this.framebuffer.setCullFace(CullFace.BACK);
                    this.framebuffer.setBob(this.spheremap);
                    this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.texture5.texture);
                    this.framebuffer.shadingSphereEnv(time * 0.0002);
                } else if (time < 440000) {
                    this.framebuffer.raveMoview(time, this.rave);
                    this.framebuffer.setCullFace(CullFace.BACK);
                    this.framebuffer.shadingTorus5(time * 0.007, (Date.now() - this.start));
                    this.framebuffer.glitchScreen(time, this.noise);
                    this.framebuffer.drawTexture(0, 75, this.hoodlumLogo, (Math.sin(time * 0.0003) + 1) * 0.5);
                } else if (time < 450000) {
                    this.framebuffer.drawVoxelLandscape3(this.heightmap, time);
                    let tempTexture = new Texture();
                    tempTexture.texture = new Uint32Array(256 * 256);
                    for (let y = 0; y < 256; y++) {
                        for (let x = 0; x < 256; x++) {
                            let ypos = Math.round(200 / 256 * x);
                            let xpos = Math.round(320 / 256 * y);
                            tempTexture.texture[x + y * 256] = this.framebuffer.framebuffer[xpos + ypos * 320];
                        }
                    }
                    this.framebuffer.drawPolarDistotion(time, tempTexture);
                } else if (time < 490000) {
                    this.framebuffer.drawVoxelLandscape4(this.heightmap, time);
                    let tempTexture = new Texture();
                    tempTexture.texture = new Uint32Array(256 * 256);
                    for (let y = 0; y < 256; y++) {
                        for (let x = 0; x < 256; x++) {
                            let ypos = 199 - Math.round(200 / 256 * x);
                            let xpos = Math.round(320 / 256 * y);
                            tempTexture.texture[x + y * 256] = this.framebuffer.framebuffer[xpos + ypos * 320];
                        }
                    }
                    this.framebuffer.drawPolarDistotion2(time, tempTexture);
                    this.framebuffer.noise(time, this.noise);
                } else if (time < 520000) {
                    this.framebuffer.drawPlanedeformationTunnelV2(time, this.abstract, this.metal);
                    this.framebuffer.noise(time, this.noise);
        
                    let scale = 1 / (99 - ((time * 0.02) % 100));
                    let width = (this.hoodlumLogo.width * scale * 10) | 0;
                    let height = (this.hoodlumLogo.height * scale * 10) | 0;
        
                    this.framebuffer.drawScaledTextureClipBi(
                        Math.round(320 / 2 - width / 2),
                        Math.round(200 / 2 - height / 2),
                        width, height, this.hoodlumLogo, 1.0);
                } else if (time < 550000) {
                    this.framebuffer.raveMoview(time, this.rave);
                    this.framebuffer.glitchScreen(time, this.noise);
                    this.framebuffer.setCullFace(CullFace.BACK);
                    this.framebuffer.setBob(this.spheremap);
                    this.framebuffer.shadingPlaneEnv(time * 0.0002);
                } else if (time < 570000) {
                    this.framebuffer.drawVoxelLandscape4(this.heightmap, time);
                    let tempTexture = new Texture();
                    tempTexture.texture = new Uint32Array(256 * 256);
                    for (let y = 0; y < 256; y++) {
                        for (let x = 0; x < 256; x++) {
                            let ypos = 199 - Math.round(200 / 256 * x);
                            let xpos = Math.round(320 / 256 * y);
                            tempTexture.texture[x + y * 256] = this.framebuffer.framebuffer[xpos + ypos * 320];
                        }
                    }
                    this.framebuffer.drawPolarDistotion2(time, tempTexture);
        
                    const ukBasslineBpm = 140;
                    const ukBasslineClapMs = 60000 / ukBasslineBpm * 2;
                    const smashTime = (Date.now() - this.start) % ukBasslineClapMs;
                    const smash = (this.framebuffer.cosineInterpolate(0, 15, smashTime) -
                        this.framebuffer.cosineInterpolate(15, 200, smashTime) +
                        0.4 * this.framebuffer.cosineInterpolate(200, 300, smashTime) -
                        0.4 * this.framebuffer.cosineInterpolate(300, 400, smashTime)) * 35;
        
        
                    let size = Math.round(1 * smash);
                    let size2 = Math.round(2 * smash);
                    this.framebuffer.drawScaledTextureClipAdd(
                        320 - (((time * 0.09) | 0) % (this.micro.width * 2 + 320)),
                        200 / 2 - 20 + size,
                        this.micro.width * 2, this.micro.height * 2, this.micro);
        
                    this.framebuffer.drawScaledTextureClipAdd(
                        320 - (((time * 0.05) | 0) % (this.micro.width + 320)) + size2,
                        200 / 2 - 60,
                        this.micro.width, this.micro.height, this.micro);
                    this.framebuffer.glitchScreen(time, this.noise);
                } else if (time < 590000) {
                    this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
                    this.framebuffer.drawParticleTorus(time, this.particleTexture2, true);
        
                    let tmpGlitch = new Uint32Array(320 * 200);
                    this.framebuffer.fastFramebufferCopy(tmpGlitch, this.framebuffer.framebuffer);
        
                    let texture = new Texture(tmpGlitch, 320, 200);
        
                    const ukBasslineBpm = 140;
                    const ukBasslineClapMs = 60000 / ukBasslineBpm * 2;
                    const smashTime = (Date.now() - this.start) % ukBasslineClapMs;
                    const smash = (this.framebuffer.cosineInterpolate(0, 20, smashTime) -
                        this.framebuffer.cosineInterpolate(20, 300, smashTime)) * 35;
                    let width = 320 + smash * 320 / 100;
                    let height = 200 + smash * 200 / 100;
        
                    this.framebuffer.drawScaledTextureClip(
                        Math.round(320 / 2 - width / 2),
                        Math.round(200 / 2 - height / 2),
                        width, height, texture, 1.0);
        
                    this.framebuffer.noise(time, this.noise);
                } else if (time < 650000) {
                    this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
        
                    this.framebuffer.setCullFace(CullFace.BACK);
                    this.framebuffer.shadingTorusDamp(time * 0.02, time * 0.00000002);
        
                    this.framebuffer.drawScaledTextureClipAdd(
                        320 - (((time * 0.09) | 0) % (this.micro.width * 2 + 320)),
                        200 / 2 - 20,
                        this.micro.width * 2, this.micro.height * 2, this.micro);
        
                    this.framebuffer.drawScaledTextureClipAdd(
                        320 - (((time * 0.05) | 0) % (this.micro.width + 320)),
                        200 / 2 - 60,
                        this.micro.width, this.micro.height, this.micro);
        
                    let tmpGlitch = new Uint32Array(320 * 200);
                    this.framebuffer.fastFramebufferCopy(tmpGlitch, this.framebuffer.framebuffer);
        
                    let texture = new Texture();
                    texture.texture = tmpGlitch;
                    texture.width = 320;
                    texture.height = 200;
        
                    const ukBasslineBpm = 140;
                    const ukBasslineClapMs = 60000 / ukBasslineBpm * 2;
                    const smashTime = (Date.now() - this.start) % ukBasslineClapMs;
                    const smash = (this.framebuffer.cosineInterpolate(0, 20, smashTime) -
                        this.framebuffer.cosineInterpolate(20, 300, smashTime)) * 35;
                    let width = Math.round(320 + smash * 320 / 50);
                    let height = Math.round(200 + smash * 200 / 50);
        
                    // slow
                    this.framebuffer.drawScaledTextureClip(
                        Math.round(320 / 2 - width / 2),
                        Math.round(200 / 2 - height / 2),
                        width, height, texture, 1.0);
        
                    this.framebuffer.noise(time, this.noise);
                } else if (time < 670000) {
                    this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
                    this.framebuffer.setCullFace(CullFace.BACK);
                    this.framebuffer.setBob(this.spheremap);
                    this.framebuffer.shadingTorusDamp(time * 0.02, time * 0.00000002);
        
                    let source: number = 0;
                    let dest: number = 319;
                    for (let y: number = 0; y < 200; y++) {
                        for (let x: number = 0; x < 160; x++) {
                            this.framebuffer.framebuffer[dest--] = this.framebuffer.framebuffer[source++];
                        }
                        source += 160;
                        dest += 320 + 160;
                    }
                    this.framebuffer.drawScaledTextureClipAdd(
                        320 - (((time * 0.09) | 0) % (this.micro.width * 2 + 320)),
                        200 / 2 - 20,
                        this.micro.width * 2, this.micro.height * 2, this.micro);
        
                    this.framebuffer.drawScaledTextureClipAdd(
                        320 - (((time * 0.05) | 0) % (this.micro.width + 320)),
                        200 / 2 - 60,
                        this.micro.width, this.micro.height, this.micro);
        
                    let tmpGlitch = new Uint32Array(320 * 200);
                    this.framebuffer.fastFramebufferCopy(tmpGlitch, this.framebuffer.framebuffer);
        
                    let texture = new Texture();
                    texture.texture = tmpGlitch;
                    texture.width = 320;
                    texture.height = 200;
        
                    const ukBasslineBpm = 140;
                    const ukBasslineClapMs = 60000 / ukBasslineBpm * 2;
                    const smashTime = (Date.now() - this.start) % ukBasslineClapMs;
                    const smash = (this.framebuffer.cosineInterpolate(0, 20, smashTime) -
                        this.framebuffer.cosineInterpolate(20, 300, smashTime)) * 35;
                    let width = Math.round(320 + smash * 320 / 50);
                    let height = Math.round(200 + smash * 200 / 50);
        
                    this.framebuffer.drawScaledTextureClip(
                        Math.round(320 / 2 - width / 2),
                        Math.round(200 / 2 - height / 2),
                        width, height, texture, 1.0);
        
                    for (let y = 0; y < 3; y++) {
                        for (let x = 0; x < 4; x++) {
                            let xx = Math.round(320 / 4 * x + 320 / 4 * 0.5 - this.cross.width / 2);
                            let yy = Math.round(200 / 3 * y + 200 / 3 * 0.5 - this.cross.height / 2);
        
                            this.framebuffer.drawTexture(xx, yy, this.cross, 0.45);
                        }
                    }
        
                    this.framebuffer.noise(time, this.noise);
                } else if (time < 690000) {
        
                    this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
                    this.framebuffer.setCullFace(CullFace.BACK);
                    this.framebuffer.setBob(this.spheremap);
        
                    this.framebuffer.shadingSphereEnv(time * 0.0002);
        
        
                    this.framebuffer.drawScaledTextureClipAdd(
                        320 - (((time * 0.09) | 0) % (this.micro.width * 2 + 320)),
                        200 / 2 - 20,
                        this.micro.width * 2, this.micro.height * 2, this.micro);
        
                    this.framebuffer.drawScaledTextureClipAdd(
                        320 - (((time * 0.05) | 0) % (this.micro.width + 320)),
                        200 / 2 - 60,
                        this.micro.width, this.micro.height, this.micro);
        
        
                    let source: number = 0;
                    let dest: number = 319;
                    for (let y: number = 0; y < 100; y++) {
                        for (let x: number = 0; x < 160; x++) {
                            this.framebuffer.framebuffer[dest--] = this.framebuffer.framebuffer[source++];
                        }
                        source += 160;
                        dest += 320 + 160;
                    }
        
                    source = 0;
                    dest = 199 * 320;
                    for (let y: number = 0; y < 100; y++) {
                        for (let x: number = 0; x < 320; x++) {
                            this.framebuffer.framebuffer[dest++] = this.framebuffer.framebuffer[source++];
                        }
                        dest -= 320 * 2;
                    }
        
                    let tmpGlitch = new Uint32Array(320 * 200);
                    this.framebuffer.fastFramebufferCopy(tmpGlitch, this.framebuffer.framebuffer);
        
                    let texture = new Texture();
                    texture.texture = tmpGlitch;
                    texture.width = 320;
                    texture.height = 200;
        
                    const ukBasslineBpm = 140;
                    const ukBasslineClapMs = 60000 / ukBasslineBpm * 2;
                    const smashTime = (Date.now() - this.start) % ukBasslineClapMs;
                    const smash = (this.framebuffer.cosineInterpolate(0, 20, smashTime) -
                        this.framebuffer.cosineInterpolate(20, 300, smashTime)) * 35;
                    let width = Math.round(320 + smash * 320 / 50);
                    let height = Math.round(200 + smash * 200 / 50);
        
                    this.framebuffer.drawScaledTextureClip(
                        Math.round(320 / 2 - width / 2),
                        Math.round(200 / 2 - height / 2),
                        width, height, texture, 1.0);
        
                    for (let y = 0; y < 3; y++) {
                        for (let x = 0; x < 4; x++) {
                            let xx = Math.round(320 / 4 * x + 320 / 4 * 0.5 - this.cross.width / 2);
                            let yy = Math.round(200 / 3 * y + 200 / 3 * 0.5 - this.cross.height / 2);
        
                            this.framebuffer.drawTexture(xx, yy, this.cross, 0.45);
                        }
                    }
        
                    this.framebuffer.noise(time, this.noise);
                } else if (time < 720000) {
                    // Rave video & Wobblin Cylinder
                    this.framebuffer.raveMoview(time, this.rave);
                    this.framebuffer.setCullFace(CullFace.FRONT);
                    this.framebuffer.setBob(this.spheremap);
                    this.framebuffer.shadingCylinderEnv(time * 0.0002);
        
                    // Crosses
                    for (let y = 0; y < 3; y++) {
                        for (let x = 0; x < 4; x++) {
                            let xx = Math.round(320 / 4 * x + 320 / 4 * 0.5 - this.cross.width / 2);
                            let yy = Math.round(200 / 3 * y + 200 / 3 * 0.5 - this.cross.height / 2);
                            this.framebuffer.drawTexture(xx, yy, this.cross, 0.2);
                        }
                    }
        
                    // Motion Blur
                    let texture = new Texture(this.accumulationBuffer, 320, 200);
                    this.framebuffer.drawTexture(0, 0, texture, 0.3 + 0.6 * (0.5 + 0.5 * Math.sin(time * 0.0003)));
                    this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
                    this.framebuffer.noise(time, this.noise);
                } else if (time < 750000) {
                    let rng = new RandomNumberGenerator();
                    rng.setSeed(666);
                    let texture = new Texture(new Uint32Array(32 * 32), 32, 32);
                    // FIXME:
                    // - remove realtime glow and put it pre baked into the texture insteadt!
                    for (let k = 0; k < 100; k++) {
                        let x = Math.round(rng.getFloat() * 32);
                        let y = Math.round(rng.getFloat() * 32);
                        if (k < 50)
                            texture.texture[x + y * 32] = 47 | 181 << 8 | 243 << 16;
                        else
                            texture.texture[x + y * 32] = 252 | 130 << 8 | 195 << 16;
                    }
        
                    this.framebuffer.drawPlanedeformationTunnelAnim(time, texture);
        
        
                    // GLOW
                    let glowBuffer = new Uint32Array(16 * 2 * 10 * 2);
                    let glowBuffer2 = new Uint32Array(16 * 2 * 10 * 2);
        
                    // todo filer onlyy brigh parts
                    // blur if too blocky
                    // clamp to border when filterting bilinear
                    // add and dont blend with alpha
                    for (let y = 0; y < 20; y++) {
                        for (let x = 0; x < 32; x++) {
                            let xx = Math.round(10 * x);
                            let yy = Math.round(10 * y);
                            let r = this.framebuffer.framebuffer[xx + yy * 320] & 0xff;
                            let g = this.framebuffer.framebuffer[xx + yy * 320] >> 8 & 0xff;
                            let b = this.framebuffer.framebuffer[xx + yy * 320] >> 16 & 0xff;
                            let intensity = (r + g + b) / 3;
                            let scale = this.framebuffer.cosineInterpolate(200, 130, intensity);
                            let color = r * scale | g * scale << 8 | b * scale << 16 | 255 << 24;
                            //  if (intensity > 138) {
                            glowBuffer[x + y * 32] = this.framebuffer.framebuffer[xx + yy * 320];//color ;
                            // } 
                        }
                    }
        
                    for (let y = 0; y < 20; y++) {
                        for (let x = 0; x < 32; x++) {
                            let col1 = glowBuffer[Math.max(x - 1, 0) + y * 32];
                            let col2 = glowBuffer[(x) % 32 + y * 32];
                            let col3 = glowBuffer[Math.min(x + 1, 31) + y * 32];
                            let r = (col1 & 0xff) * 1 / 4 + (col2 & 0xff) * 2 / 4 + (col3 & 0xff) * 1 / 4;
                            let g = (col1 >> 8 & 0xff) * 1 / 4 + (col2 >> 8 & 0xff) * 2 / 4 + (col3 >> 8 & 0xff) * 1 / 4;
                            let b = (col1 >> 16 & 0xff) * 1 / 4 + (col2 >> 16 & 0xff) * 2 / 4 + (col3 >> 16 & 0xff) * 1 / 4;
                            glowBuffer2[x + y * 32] = r | g << 8 | b << 16;
                        }
                    }
        
                    for (let y = 0; y < 20; y++) {
                        for (let x = 0; x < 32; x++) {
                            let col1 = glowBuffer2[(x) + Math.max(y - 1, 0) * 32];
                            let col2 = glowBuffer2[(x) + y % 20 * 32];
                            let col3 = glowBuffer2[(x) + Math.min(y + 1, 19) * 32];
                            let r = ((col1 & 0xff) * 1 / 4 + (col2 & 0xff) * 2 / 4 + (col3 & 0xff) * 1 / 4);
                            let g = ((col1 >> 8 & 0xff) * 1 / 4 + (col2 >> 8 & 0xff) * 2 / 4 + (col3 >> 8 & 0xff) * 1 / 4);
                            let b = ((col1 >> 16 & 0xff) * 1 / 4 + (col2 >> 16 & 0xff) * 2 / 4 + (col3 >> 16 & 0xff) * 1 / 4);
                            glowBuffer[x + y * 32] = r | g << 8 | b << 16;
                        }
                    }
        
                    let texture2 = new Texture();
                    texture2.texture = glowBuffer;
                    texture2.width = 32;
                    texture2.height = 20;
        
        
                    this.framebuffer.drawScaledTextureClipBiAdd(
                        0, 0,
                        320, 200, texture2, 0.75);
        
                    this.framebuffer.setCullFace(CullFace.BACK);
                    this.framebuffer.setBob(this.spheremap);
                    this.framebuffer.reflectionBunny(time * 0.002);
                    // Motion Blur
                    let texture3 = new Texture(this.accumulationBuffer, 320, 200);
                    this.framebuffer.drawTexture(0, 0, texture3, 0.8);
                    this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
                    this.framebuffer.noise(time, this.noise);
                } else {
                    this.framebuffer.raveMoview(time, this.rave);
                    this.framebuffer.setCullFace(CullFace.FRONT);
                    this.framebuffer.setBob(this.spheremap);
                    this.framebuffer.shadingCylinderEnvDisp(time * 0.0002);
                    this.framebuffer.drawTexture((320 / 2 - 256 / 2) | 0, (200 / 2 - 122 / 2) | 0, this.meth, Math.max(0, Math.sin(time * 0.0002)));
                    // Motion Blur
                    let texture3 = new Texture(this.accumulationBuffer, 320, 200);
                    this.framebuffer.drawTexture(0, 0, texture3, 0.8);
                    this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
        
        
                    let tmpGlitch = new Uint32Array(320 * 200);
                    this.framebuffer.fastFramebufferCopy(tmpGlitch, this.framebuffer.framebuffer);
        
                    let texture = new Texture();
                    texture.texture = tmpGlitch;
                    texture.width = 320;
                    texture.height = 200;
        
                    const ukBasslineBpm = 140;
                    const ukBasslineClapMs = 60000 / ukBasslineBpm * 2;
                    const smashTime = (Date.now() - this.start) % ukBasslineClapMs;
                    const smash = (this.framebuffer.cosineInterpolate(0, 20, smashTime) -
                        this.framebuffer.cosineInterpolate(20, 300, smashTime)) * 35;
                    let width = Math.round(320 + smash * 320 / 100);
                    let height = Math.round(200 + smash * 200 / 100);
        
                    this.framebuffer.drawScaledTextureClip(
                        Math.round(320 / 2 - width / 2),
                        Math.round(200 / 2 - height / 2),
                        width, height, texture, 1.0);
        
                    this.framebuffer.noise(time, this.noise);
                }
        */

        // music: https://youtu.be/XNUaoQeTu9U
/*
        if (time < 50000) {
            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
            this.framebuffer.setCullFace(CullFace.BACK);
            this.framebuffer.setBob(this.spheremap);
            this.framebuffer.shadingSphereEnvDisp(time * 0.0002);

            // Motion Blur
            const tmpGlitch: Uint32Array = new Uint32Array(320 * 200);
            this.framebuffer.fastFramebufferCopy(tmpGlitch, this.framebuffer.framebuffer);

            const texture: Texture = new Texture();
            texture.texture = tmpGlitch;
            texture.width = 320;
            texture.height = 200;

            const ukBasslineBpm: number = 140;
            const ukBasslineClapMs: number = 60000 / ukBasslineBpm * 2;
            const smashTime: number = (Date.now() - this.start) % ukBasslineClapMs;
            const smash: number = (this.framebuffer.cosineInterpolate(0, 20, smashTime) -
                this.framebuffer.cosineInterpolate(20, 300, smashTime)) * 35;
            const width: number = Math.round(320 + smash * 320 / 100);
            const height: number = Math.round(200 + smash * 200 / 100);

            this.framebuffer.drawScaledTextureClip(
                Math.round(320 / 2 - width / 2),
                Math.round(200 / 2 - height / 2),
                width, height, texture, 1.0);

            const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.85);

            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);

            this.framebuffer.noise(time, this.noise);
        } else if (time < 100000) {
            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
            this.framebuffer.setCullFace(CullFace.BACK);
            // this.framebuffer.setBob(this.spheremap);
            this.framebuffer.setBob(this.envmap);

            let scale: number = 3.7;
            let elapsedTime: number = (time - 50000) * 0.0002;

            let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.35)
                .multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.3)));

            modelViewMartrix = Matrix4f.constructTranslationMatrix(-0, -0,
                -10 - (Math.sin(elapsedTime * 0.3) * 0.5 + 0.5) * 6)
                .multiplyMatrix(modelViewMartrix);
            this.framebuffer.clearDepthBuffer();
            this.framebuffer.shadingSphereEnvDisp2((time - 50000) * 0.0002, modelViewMartrix);

            // Motion Blur
            const tmpGlitch: Uint32Array = new Uint32Array(320 * 200);
            this.framebuffer.fastFramebufferCopy(tmpGlitch, this.framebuffer.framebuffer);

            const texture: Texture = new Texture();
            texture.texture = tmpGlitch;
            texture.width = 320;
            texture.height = 200;

            const ukBasslineBpm: number = 140;
            const ukBasslineClapMs: number = 60000 / ukBasslineBpm * 2;
            const smashTime: number = (Date.now() - this.start) % ukBasslineClapMs;
            const smash: number = (this.framebuffer.cosineInterpolate(0, 20, smashTime) -
                this.framebuffer.cosineInterpolate(20, 300, smashTime)) * 35;
            const width: number = Math.round(320 + smash * 320 / 100);
            const height: number = Math.round(200 + smash * 200 / 100);

            this.framebuffer.drawScaledTextureClipBi(
                Math.round(320 / 2 - width / 2),
                Math.round(200 / 2 - height / 2),
                width, height, texture, 1.0);

            const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.85);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);

            this.framebuffer.noise(time, this.noise);
        } else if (time < 150000) {
            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
            this.framebuffer.drawParticleTorus(time, this.particleTexture2, true);

            const tmpGlitch: Uint32Array = new Uint32Array(320 * 200);
            this.framebuffer.fastFramebufferCopy(tmpGlitch, this.framebuffer.framebuffer);

            const texture: Texture = new Texture();
            texture.texture = tmpGlitch;
            texture.width = 320;
            texture.height = 200;

            const ukBasslineBpm: number = 140;
            const ukBasslineClapMs: number = 60000 / ukBasslineBpm * 2;
            const smashTime: number = (Date.now() - this.start) % ukBasslineClapMs;
            const smash: number = (this.framebuffer.cosineInterpolate(0, 20, smashTime) -
                this.framebuffer.cosineInterpolate(20, 300, smashTime)) * 35;
            const width: number = Math.round(320 + smash * 320 / 100);
            const height: number = Math.round(200 + smash * 200 / 100);

            this.framebuffer.drawScaledTextureClipBi(
                Math.round(320 / 2 - width / 2),
                Math.round(200 / 2 - height / 2),
                width, height, texture, 1.0);

            const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.85);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);

            this.framebuffer.noise(time, this.noise);
        } else if (time < 200000) {
            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
            this.framebuffer.setCullFace(CullFace.BACK);
            this.framebuffer.setBob(this.spheremap);
            this.framebuffer.shadingTorusDamp(time * 0.02, time * 0.00000002);

            const tmpGlitch: Uint32Array = new Uint32Array(320 * 200);
            this.framebuffer.fastFramebufferCopy(tmpGlitch, this.framebuffer.framebuffer);

            const texture: Texture = new Texture();
            texture.texture = tmpGlitch;
            texture.width = 320;
            texture.height = 200;

            const ukBasslineBpm = 140;
            const ukBasslineClapMs = 60000 / ukBasslineBpm * 2;
            const smashTime = (Date.now() - this.start) % ukBasslineClapMs;
            const smash = (this.framebuffer.cosineInterpolate(0, 20, smashTime) -
                this.framebuffer.cosineInterpolate(20, 300, smashTime)) * 35;
            const width = Math.round(320 + smash * 320 / 100);
            const height = Math.round(200 + smash * 200 / 100);

            this.framebuffer.drawScaledTextureClipBi(
                Math.round(320 / 2 - width / 2),
                Math.round(200 / 2 - height / 2),
                width, height, texture, 1.0);

            const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.85);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);

            this.framebuffer.noise(time, this.noise);
        } else if (time < 250000) {
            this.framebuffer.raveMoview(time, this.rave);
            this.framebuffer.glitchScreen(time, this.noise, false);
            this.framebuffer.setCullFace(CullFace.BACK);
            this.framebuffer.setBob(this.spheremap);
            this.framebuffer.shadingPlaneEnv(time * 0.0002);

            const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.85);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);

            this.framebuffer.noise(time, this.noise);
        } else if (time < 300000) {
            this.framebuffer.drawVoxelLandscape4(this.heightmap, time);
            const tempTexture: Texture = new Texture();
            tempTexture.texture = new Uint32Array(256 * 256);
            for (let y: number = 0; y < 256; y++) {
                for (let x: number = 0; x < 256; x++) {
                    const ypos: number = 199 - Math.round(200 / 256 * x);
                    const xpos: number = Math.round(320 / 256 * y);
                    tempTexture.texture[x + y * 256] = this.framebuffer.framebuffer[xpos + ypos * 320];
                }
            }

            this.framebuffer.drawPolarDistotion2(time, tempTexture);

            const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.65);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);

            this.framebuffer.noise(time, this.noise);
        } else if (time < 350000) {
            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
            this.framebuffer.setCullFace(CullFace.FRONT);
            this.framebuffer.setBob(this.spheremap);
            this.framebuffer.shadingCylinderEnvDisp(time * 0.0002);

            const texture3 = new Texture(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.85);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);

            this.framebuffer.noise(time, this.noise);
        } else if (time < 400000) {
            this.framebuffer.raveMoview(time, this.rave);
            this.framebuffer.setCullFace(CullFace.BACK);
            this.framebuffer.shadingTorus5(time * 0.007, (Date.now() - this.start));
            this.framebuffer.glitchScreen(time, this.noise);
        } else if (time < 450000) {

            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
            this.framebuffer.drawParticleWaves(time, this.particleTexture2, true);

            const texture3 = new Texture(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.85);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);

            this.framebuffer.noise(time, this.noise);

        } else if (time < 500000) {
            this.framebuffer.drawMetaballs();
            this.framebuffer.noise(time, this.noise, 0.1);
        } else if (time < 550000) {
            this.framebuffer.drawPlanedeformationTunnelV2(time, this.abstract, this.metal);
            this.framebuffer.noise(time, this.noise);
        } else if (time < 600000) {
            this.framebuffer.setCullFace(CullFace.BACK);
            this.framebuffer.reproduceRazorScene(time * 0.0018, [
                { tex: this.texture10, scale: 0.0, alpha: 1.0 },
                { tex: this.texture11, scale: 2.3, alpha: 0.5 },
                { tex: this.texture13, scale: 1.6, alpha: 0.25 },
                { tex: this.texture13, scale: 0.7, alpha: 0.22 },
                { tex: this.texture13, scale: -0.4, alpha: 0.22 },
            ], this.dirt);

            const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.75);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
            this.framebuffer.noise(time, this.noise, 0.04);
        } else if (time < 650000) {

            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
            this.framebuffer.drawParticleStreams(time, this.particleTexture2, true);
            const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.55);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
            this.framebuffer.noise(time, this.noise);
        } else if (time < 700000) {
            this.framebuffer.setCullFace(CullFace.FRONT);
            this.framebuffer.torusTunnel(time * 0.007, (Date.now() - this.start), this.particleTexture);

            const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.75);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);

            this.framebuffer.noise(time, this.noise);
        } else if (time < 750000) {
            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
            this.framebuffer.setCullFace(CullFace.BACK);
            this.framebuffer.drawBlenderScene2(time, this.texture4,
                [
                    { tex: this.texture10, scale: 0.0, alpha: 1.0 },
                    { tex: this.texture11, scale: 2.3, alpha: 0.5 },
                    { tex: this.texture13, scale: 1.6, alpha: 0.25 },
                    { tex: this.texture13, scale: 0.7, alpha: 0.22 },
                    { tex: this.texture13, scale: -0.4, alpha: 0.22 },
                ], this.dirt);
            const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.75);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);

            this.framebuffer.noise(time, this.noise);
        } else if (time < 800000) {
            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
            this.framebuffer.setCullFace(CullFace.FRONT);
            this.framebuffer.drawBlenderScene3(time, this.texture4,
                [
                    { tex: this.texture10, scale: 0.0, alpha: 1.0 },
                    { tex: this.texture11, scale: 2.3, alpha: 0.5 },
                    { tex: this.texture13, scale: 1.6, alpha: 0.25 },
                    { tex: this.texture13, scale: 0.7, alpha: 0.22 },
                    { tex: this.texture13, scale: -0.4, alpha: 0.22 },
                ], this.dirt);
            this.framebuffer.drawTexture(0, 75, this.hoodlumLogo, 0.6);

            const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.75);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);

            this.framebuffer.noise(time, this.noise);
        } else if (time < 850000) {

            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
            this.framebuffer.setCullFace(CullFace.FRONT);
            this.framebuffer.drawBlenderScene4(time, this.texture4,
                [
                    { tex: this.texture10, scale: 0.0, alpha: 1.0 },
                    { tex: this.texture11, scale: 2.3, alpha: 0.5 },
                    { tex: this.texture13, scale: 1.6, alpha: 0.25 },
                    { tex: this.texture13, scale: 0.7, alpha: 0.22 },
                    { tex: this.texture13, scale: -0.4, alpha: 0.22 },
                ], this.dirt);
            //this.framebuffer.drawTexture(0, 75, this.hoodlumLogo, 0.6);

            const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.75);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);

            this.framebuffer.noise(time, this.noise);
        } else if (time < 900000) {


            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
            this.framebuffer.setCullFace(CullFace.BACK);
            this.framebuffer.setBob(this.envmap);

            this.framebuffer.drawBlenderScene5(time, this.texture4,
                [
                    { tex: this.texture10, scale: 0.0, alpha: 1.0 },
                    { tex: this.texture11, scale: 2.3, alpha: 0.5 },
                    { tex: this.texture13, scale: 1.6, alpha: 0.25 },
                    { tex: this.texture13, scale: 0.7, alpha: 0.22 },
                    { tex: this.texture13, scale: -0.4, alpha: 0.22 },
                ], this.dirt);

            const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.75);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
            this.framebuffer.glitchScreen(time * 0.9, this.noise);
        } else if (time < 950000) {
            this.framebuffer.setCullFace(CullFace.BACK);
            this.framebuffer.setBob(this.envmap);

            this.framebuffer.drawBlenderScene6(time, this.particleTexture2,
                [
                    { tex: this.texture10, scale: 0.0, alpha: 1.0 },
                    { tex: this.texture11, scale: 2.3, alpha: 0.5 },
                    { tex: this.texture13, scale: 1.6, alpha: 0.25 },
                    { tex: this.texture13, scale: 0.7, alpha: 0.22 },
                    { tex: this.texture13, scale: -0.4, alpha: 0.22 },
                ], this.dirt);

            const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.85);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);

            this.framebuffer.noise(time, this.noise);
        } else if (time < 1000000) {

            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
            this.framebuffer.setCullFace(CullFace.BACK);
            this.framebuffer.setBob(this.baked);

            this.framebuffer.drawBlenderScene7(time, this.particleTexture2,
                [
                    { tex: this.texture10, scale: 0.0, alpha: 1.0 },
                    { tex: this.texture11, scale: 2.3, alpha: 0.5 },
                    { tex: this.texture13, scale: 1.6, alpha: 0.25 },
                    { tex: this.texture13, scale: 0.7, alpha: 0.22 },
                    { tex: this.texture13, scale: -0.4, alpha: 0.22 },
                ], this.dirt);

            const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.75);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
            //this.framebuffer.glitchScreen(time * 0.9, this.noise);
            this.framebuffer.noise(time, this.noise);
        } else if (time < 1050000) {

            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
            this.framebuffer.setCullFace(CullFace.BACK);
            this.framebuffer.setBob(this.platonian);

            this.framebuffer.drawBlenderScene8(time, this.particleTexture2,
                [
                    { tex: this.texture10, scale: 0.0, alpha: 1.0 },
                    { tex: this.texture11, scale: 2.3, alpha: 0.5 },
                    { tex: this.texture13, scale: 1.6, alpha: 0.25 },
                    { tex: this.texture13, scale: 0.7, alpha: 0.22 },
                    { tex: this.texture13, scale: -0.4, alpha: 0.22 },
                ], this.dirt);

            const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.75);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
            //this.framebuffer.glitchScreen(time * 0.9, this.noise);
            this.framebuffer.noise(time, this.noise);
        } else if (time < 1100000) {

            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
            this.framebuffer.setCullFace(CullFace.BACK);
            this.framebuffer.setBob(this.lab2);

            this.framebuffer.drawBlenderScene9(time, this.particleTexture2,
                [
                    { tex: this.texture10, scale: 0.0, alpha: 1.0 },
                    { tex: this.texture11, scale: 2.3, alpha: 0.5 },
                    { tex: this.texture13, scale: 1.6, alpha: 0.25 },
                    { tex: this.texture13, scale: 0.7, alpha: 0.22 },
                    { tex: this.texture13, scale: -0.4, alpha: 0.22 },
                ], this.dirt, this.skybox);

            const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.75);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);

            this.framebuffer.noise(time, this.noise);

        } else {

            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
            this.framebuffer.setCullFace(CullFace.BACK);
            this.framebuffer.setBob(this.baked);

            this.framebuffer.drawBlenderScene7(time - 1100000, this.particleTexture2,
                [
                    //   { tex: this.texture10, scale: 0.0, alpha: 1.0 },
                    { tex: this.texture11, scale: 2.3, alpha: 0.5 },
                    { tex: this.texture13, scale: 1.6, alpha: 0.25 },
                    { tex: this.texture13, scale: 0.7, alpha: 0.22 },
                    { tex: this.texture13, scale: -0.4, alpha: 0.22 },
                ], this.dirt, this.skybox);

            const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.75);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
            //this.framebuffer.glitchScreen(time * 0.9, this.noise);
            this.framebuffer.noise(time, this.noise);
        }
*/

/*
        this.framebuffer.setCullFace(CullFace.BACK);
        this.framebuffer.drawBlenderSceneM(time, this.particleTexture2,
            [
                //   { tex: this.texture10, scale: 0.0, alpha: 1.0 },
                { tex: this.texture11, scale: 2.3, alpha: 0.5 },
                { tex: this.texture13, scale: 1.6, alpha: 0.25 },
                { tex: this.texture13, scale: 0.7, alpha: 0.22 },
                { tex: this.texture13, scale: -0.4, alpha: 0.22 },
            ], this.dirt, this.skybox, this.metalheadz);

        const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
        this.framebuffer.drawTexture(0, 0, texture3, 0.75);
        this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
        this.framebuffer.noise(time, this.noise);
        */

       // this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
        this.framebuffer.setCullFace(CullFace.BACK);
        this.framebuffer.drawBlenderScene(time*0.5, this.texture4, null);

        // TODO: Front Mission Modell in Blender

        /**
         * TODO:
         * - Draw Vector ART in SVG Inkscape
         * - Vectorize with Blender and Display
         */
        //  this.framebuffer.drawTexture(0, 0, this.hlm, 0.50);

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

        // this.framebuffer.drawRadialBlur();

        this.framebuffer.drawText(8, 18, 'FPS: ' + this.fps.toString(), this.texture4);


        /*
        let bufferLength = this.analyzer.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);
        this.analyzer.getByteFrequencyData(dataArray);
    
        let pos1 = new Vector3f(0,0,0);
        let pos2 = new Vector3f(0,0,0);
        const STEPS = 100;
        for (let i = 0; i < STEPS; i++) {
            
            let x = Math.sin(Math.PI * 2 / STEPS * i+time*0.0003);
            let y = Math.cos(Math.PI * 2 / STEPS * i+time*0.0003);
            pos1.x = x*60 +320/2;
            pos1.y = y*60 + 200/2;
            pos2.y=  y*(60+dataArray[Math.floor(bufferLength/ STEPS * (i))]/255*40)+200/2;
            pos2.x = x*(60+dataArray[Math.floor(bufferLength/ STEPS * (i))]/255*40)+ 320/2;
            this.framebuffer.drawLineDDANoZ(pos1, pos2, 255);
        }
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

        //this.framebuffer.drawTexture(0, 0, this.displacementMap, 0.8);
        /*
        this.framebuffer.drawPolarDistotion3(time, this.revision);
        this.framebuffer.setCullFace(CullFace.FRONT);
        this.framebuffer.shadingSphere(time * 0.004);
        // Motion Blur
        let texture = new Texture(this.accumulationBuffer, 320, 200);
        //this.framebuffer.drawTexture(0, 0, texture, 0.75);
        this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
        this.framebuffer.glitchScreen(time, this.noise);
        */

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

        /*
              // SCALE
              let texture = new Texture();
              texture.texture = this.accumulationBuffer;
              texture.width = 320;
              texture.height = 200;
      
              let scale = 1 + (1+Math.sin(time*0.00006))*0.5*20;
              let width = 320 *  scale;
              let height = 200 * scale;
      
              // looks crappy with linear interpolation!
              // probably  bilinear is required here
         
              
                  this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
                  this.framebuffer.drawScaledTextureClipBi(
                      Math.round(320/2-width/2),
                      Math.round(200/2-height/2),
                      width, height, texture, 1.0);
                  */

        /*
            // RADIAL BLUR
    let texture = new Texture();
    texture.texture = this.accumulationBuffer;
    texture.width = 320;
    texture.height = 200;
    
    let scale = 1.05;
    let width = 320 *  scale;
    let height = 200 * scale;
    
    // looks crappy with linear interpolation!
    // probably  bilinear is required here
     
     
        this.framebuffer.drawScaledTextureClipBi(
            Math.round(320/2-width/2),
            Math.round(200/2-height/2),
            width, height, texture, 0.95);
     
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
            */


        //this.framebuffer.noise(time, this.noise);

        // https://github.com/ninjadev/nin/blob/38e80381415934136c7bd97233a2792df2bffa8d/nin/dasBoot/shims.js
        /*****/
        /*
    
        let scale =  (99-((time * 0.04) % 100))/99;
        let width = (this.micro.width * scale * 2) | 0;
        let height = (this.micro.height * scale * 2) | 0;
        let rng = new RandomNumberGenerator();
        rng.setSeed(22);
        let pos = [];
        for(let i=0; i < 100; i++) {
            pos.push({x:rng.getFloat(), y: rng.getFloat()});
        }
    
        let xpos = 20+(320-40) * pos[((time*0.04/99)%100)|0].x;
        let ypos = 20+(200-40) * pos[((time*0.04/99)%100)|0].y;
        this.framebuffer.drawScaledTextureClipAdd(
            Math.round(xpos - width / 2),
            Math.round(ypos - height / 2),
            width, height, this.micro, 1.0);
            */


        // this.framebuffer.drawRadialBlur();

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

        //this.framebuffer.clear();

        //this.framebuffer.wireFrameTerrain(time*0.01, this.texture3);
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

    getImageData(image: HTMLImageElement, withAlpha: boolean = false): Uint32Array {
        let canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        let context: CanvasRenderingContext2D = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        let data = context.getImageData(0, 0, image.width, image.height).data;
        let conv = new Uint32Array(data.length / 4);
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

    public createTexture(path: string, hasAlpha: boolean): Promise<Texture> {
        return new Promise((resolve) => {
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
        });
    }

    public createProceduralTexture(): Promise<Texture> {
        return new Promise((resolve) => {
            const texture = new Texture();
            texture.texture = new Uint32Array(256 * 256);

            let rng = new RandomNumberGenerator();
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

    public createProceduralTexture2(): Promise<Texture> {
        return new Promise((resolve) => {
            const texture = new Texture();
            texture.texture = new Uint32Array(256 * 256);

            let rng = new RandomNumberGenerator();
            rng.setSeed(100);

            for (let y = 0; y < 256; y++) {
                for (let x = 0; x < 256; x++) {
                    let dx = 127 - x
                    let dy = 127 - y
                    let r = Math.sqrt(dx * dx + dy * dy) / 127;
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

            let rng = new RandomNumberGenerator();
            rng.setSeed(100);

            for (let y = 0; y < 256; y++) {
                for (let x = 0; x < 256; x++) {
                    let dx = 127 - x
                    let dy = 127 - y
                    let r = Math.sqrt(dx * dx + dy * dy) / 127;
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

    public createProceduralDisplacementMap(): Promise<Texture> {
        return new Promise((resolve) => {
            const texture = new Texture();
            texture.texture = new Uint32Array(256 * 256);

            let rng = new RandomNumberGenerator();
            rng.setSeed(100);

            texture.texture.fill(128 | 255 << 24);

            for (let y = 0; y < 256; y++) {
                for (let x = 0; x < 256; x++) {
                    let dx = 127 - x
                    let dy = 127 - y
                    let r = Math.sqrt(dx * dx + dy * dy) / 127;
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

    public createProceduralTexture4(): Promise<Texture> {
        return new Promise((resolve) => {
            const texture = new Texture();
            texture.texture = new Uint32Array(256 * 256);

            const rng: RandomNumberGenerator = new RandomNumberGenerator();
            rng.setSeed(100);

            for (let i: number = 0; i < 256 * 256; i++) {
                const scale: number = rng.getFloat();
                texture.texture[i] = 200 * scale | 255 * scale << 8 | 205 * scale << 16 | 255 << 24;
            }

            texture.width = 256;
            texture.height = 256;
            resolve(texture);
        });
    }

    public init(): void {
        let fullscreen = false;
        let toggleFullscreen = function () {
            if (!fullscreen) {
                fullscreen = true;
                if ('requestFullscreen' in this) {
                    this['requestFullscreen']();
                } else if ('webkitRequestFullScreen' in this) {
                    this['webkitRequestFullScreen']();
                } else if ('mozRequestFullScreen' in this) {
                    this['mozRequestFullScreen']();
                } else if ('msRequestFullscreen' in this) {
                    this['msRequestFullscreen']();
                } else {
                    fullscreen = false;
                }
            } else {
                fullscreen = false;
                if ('exitFullscreen' in document) {
                    document['exitFullscreen']();
                } else if ('mozCancelFullScreen' in document) {
                    document['mozCancelFullScreen']();
                } else if ('webkitExitFullscreen' in document) {
                    document['webkitExitFullscreen']();
                } else if ('msExitFullScreen' in document) {
                    document['msExitFullScreen']();
                } else {
                    fullscreen = true;
                }
            }
        };
        let lastClick = 0;
        // click supported on mobile and desktop. dblclick only supported on browser
        // so emulate dblclick
        this.canvas.addEventListener('click', function (evt) {
            evt.preventDefault();
            let currentClick = Date.now();
            if (currentClick - lastClick < 200) {
                toggleFullscreen.bind(this)();
            }
            lastClick = currentClick;
        });

        Promise.all([
            this.createTexture(require('./assets/spheremap.png'), false).then(texture => this.spheremap = texture),
            this.createTexture(require('./assets/metall.png'), false).then(texture => this.metal = texture),
            this.createTexture(require('./assets/logo.png'), false).then(texture => this.texture = texture),
            this.createTexture(require('./assets/razor1911.png'), true).then(texture => this.texture2 = texture),
            this.createTexture(require('./assets/heightmap.png'), false).then(texture => this.heightmap = texture),
            this.createTexture(require('./assets/metalheadz.png'), false).then(texture => this.metalheadz = texture),
            this.createTexture(require('./assets/font.png'), true).then(texture => this.texture4 = texture),
            this.createTexture(require('./assets/atlantis.png'), false).then(texture => this.texture5 = texture),
            this.createTexture(require('./assets/lens.png'), true).then(texture => this.texture6 = texture),
            this.createTexture(require('./assets/ball2.png'), true).then(texture => this.texture7 = texture),
            this.createTexture(require('./assets/pandabear.png'), false).then(texture => this.texture8 = texture),
            this.createTexture(require('./assets/battleofilona.png'), false).then(texture => this.texture9 = texture),
            this.createTexture(require('./assets/spark.png'), true).then(texture => this.texture10 = texture),
            this.createTexture(require('./assets/ring.png'), true).then(texture => this.texture11 = texture),
            this.createTexture(require('./assets/sky.png'), true).then(texture => this.texture12 = texture),
            this.createTexture(require('./assets/bokeh.png'), true).then(texture => this.texture13 = texture),
            this.createTexture(require('./assets/led.png'), false).then(texture => this.texture14 = texture),
            this.createTexture(require('./assets/revision.png'), false).then(texture => this.revision = texture),
            this.createTexture(require('./assets/lab2.png'), false).then(texture => this.lab2 = texture),

            this.createTexture(require('./assets/skybox/skybox_back.png'), false).then(texture => this.skybox.back = texture),
            this.createTexture(require('./assets/skybox/skybox_down.png'), false).then(texture => this.skybox.down = texture),
            this.createTexture(require('./assets/skybox/skybox_front.png'), false).then(texture => this.skybox.front = texture),
            this.createTexture(require('./assets/skybox/skybox_left.png'), false).then(texture => this.skybox.left = texture),
            this.createTexture(require('./assets/skybox/skybox_right.png'), false).then(texture => this.skybox.right = texture),
            this.createTexture(require('./assets/skybox/skybox_up.png'), false).then(texture => this.skybox.up = texture),

            this.createTexture(require('./assets/platonian_baked.png'), false).then(texture => this.platonian = texture),
            this.createTexture(require('./assets/meth.png'), true).then(texture => this.meth = texture),
            this.createProceduralTexture().then(texture => this.texture15 = texture),
            this.createProceduralTexture2().then(texture => this.particleTexture = texture),
            this.createProceduralTexture3().then(texture => this.particleTexture2 = texture),
            this.createProceduralTexture4().then(texture => this.noise = texture),
            this.createProceduralDisplacementMap().then(texture => this.displacementMap = texture),
            this.createTexture(require('./assets/hoodlumLogo.png'), true).then(texture => this.hoodlumLogo = texture),
            this.createTexture(require('./assets/abstract.png'), false).then(texture => this.abstract = texture),
            this.createTexture(require('./assets/rave.png'), false).then(texture => this.rave = texture),
            this.createTexture(require('./assets/microstrange.png'), false).then(texture => this.micro = texture),
            this.createTexture(require('./assets/Backed.png'), false).then(texture => this.baked = texture),
            this.createTexture(require('./assets/blurredBackground.png'), false).then(texture => this.blurred = texture),
            this.createTexture(require('./assets/hlm.png'), true).then(texture => this.hlm = texture),
            this.createTexture(require('./assets/cross.png'), true).then(texture => this.cross = texture),
            this.createTexture(require('./assets/envmap.png'), false).then(texture => this.envmap = texture),
            this.createTexture(require('./assets/heightmapSphere.png'), false).then(texture => this.heightmapSphere = texture),
            this.createTexture(require('./assets/mask.png'), true).then(texture => this.mask = texture),
            this.createTexture(require('./assets/dirt.png'), true).then(texture => this.dirt = texture),
        ]).then(() => {
            // Web Audio API
            // FIXME: put this into a Player Class
            this.framebuffer.precompute(this.heightmap, this.heightmapSphere);

            let audioContext = new AudioContext();
            let request = new XMLHttpRequest();
            request.open('GET', require('./assets/xmix_q2_final.ogg'), true);
            request.responseType = 'arraybuffer';
            request.onload = () => {
                let undecodedAudio = request.response;
                audioContext.decodeAudioData(undecodedAudio,
                    (buffer) => {
                        const sourceBuffer = audioContext.createBufferSource();
                        sourceBuffer.buffer = buffer;
                        sourceBuffer.connect(audioContext.destination);
                        sourceBuffer.loop = true;
                        sourceBuffer.start(audioContext.currentTime);
                        this.start = Date.now();
                        this.renderLoop(0);
                    });
            };

            request.send();
        });
    }

    public renderLoop(time: number): void {
        this.render();
        this.flipBackbuffer();
        requestAnimationFrame(this.boundRenderLoop);
    }

    public flipBackbuffer(): void {
        this.context.putImageData(this.framebuffer.getImageData(), 0, 0);
    }

    public appendTo(element: HTMLElement): void {
        element.appendChild(this.canvas);
    }

}
