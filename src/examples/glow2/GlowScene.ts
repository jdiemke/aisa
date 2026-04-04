import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';
import { ModelViewMatrix, Vector4f } from '../../math';
import { GLBAnimatedModel } from '../../model/glb/GLBAnimatedModel';
import { GLBLoader } from '../../model/glb/GLBLoader';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { SubPixelRenderingPipeline } from '../../rendering-pipelines/SubPixelRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';
import { PointLight } from '../../shading/light/PointLight';
import { Material } from '../../shading/material/Material';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { CubeScene } from '../cube/CubeScene';
import { PlatonianScene } from '../platonian/PlatonianScene';

export class GlowScene extends AbstractScene {

    private ledTexture: Texture;
    private noise: Texture; private accumulationBuffer: Uint32Array;
    private scene: PlatonianScene;

    private static readonly GLOW_TEXTURE_WIDTH = 16;
    private static readonly GLOW_TEXTURE_HEIGHT = 8;
    // GLOW
    glowBuffer = new Uint32Array(GlowScene.GLOW_TEXTURE_WIDTH * GlowScene.GLOW_TEXTURE_HEIGHT);
    glowBuffer2 = new Uint32Array(GlowScene.GLOW_TEXTURE_WIDTH * GlowScene.GLOW_TEXTURE_HEIGHT);

    private model: GLBAnimatedModel;
    private renderingPipeline: SubPixelRenderingPipeline;

    private mv: ModelViewMatrix = new ModelViewMatrix();
    private clipIndex: number = 0;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.scene = new PlatonianScene();
        this.accumulationBuffer = new Uint32Array(framebuffer.width * framebuffer.height);


        this.renderingPipeline = new SubPixelRenderingPipeline(framebuffer);
        this.renderingPipeline.setCullFace(CullFace.BACK);
        this.renderingPipeline.enableLighting(true);

        const keyLight = new PointLight();
        keyLight.ambientIntensity = new Vector4f(1.1, 1.1, 1.1, 1);
        keyLight.diffuseIntensity = new Vector4f(1.6, 1.55, 1.5, 1);
        keyLight.specularIntensity = new Vector4f(1.3, 1.3, 1.3, 1);
        keyLight.position = new Vector4f(80, -120, -180, 1);

        const fillLight = new PointLight();
        fillLight.ambientIntensity = new Vector4f(0.75, 0.75, 0.8, 1);
        fillLight.diffuseIntensity = new Vector4f(1.2, 1.2, 1.3, 1);
        fillLight.specularIntensity = new Vector4f(0.7, 0.7, 0.7, 1);
        fillLight.position = new Vector4f(-120, -60, -80, 1);

        const rimLight = new PointLight();
        rimLight.ambientIntensity = new Vector4f(0.4, 0.4, 0.45, 1);
        rimLight.diffuseIntensity = new Vector4f(0.9, 0.9, 1.0, 1);
        rimLight.specularIntensity = new Vector4f(0.6, 0.6, 0.6, 1);
        rimLight.position = new Vector4f(0, -180, 100, 1);

        this.renderingPipeline.setLights([ rimLight,fillLight,keyLight]);

        return Promise.all([
            this.scene.init(framebuffer),
            TextureUtils.load(require('@assets/led.png'), false).then(
                (texture: Texture) => this.ledTexture = texture
            ),
            TextureUtils.generateProceduralNoise().then(texture => this.noise = texture),
            GLBLoader.loadRaw(
                require('@assets/glb/T-Rex.glb')
            ).then(({ gltf, binChunk }) => {
                this.model = new GLBAnimatedModel(gltf, binChunk);

                // Select the walk animation by name (falls back to clip 0)
                const walkIdx = this.model.getAnimationIndex('Armature|TRex_Walk');
                this.clipIndex = walkIdx >= 0 ? walkIdx : 0;

                // Pose the model at t=0 so computeBounds measures the
                // actual animated geometry rather than raw bind-pose vertices.
                this.model.getMesh(0, this.clipIndex);

                this.mv.xSpeed = 0;
               // this.mv.ySpeed=0;
                this.mv.extraScale = 2.5;
                this.mv.autoFit(this.model.mergedMesh.points);
            })
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        const rng = new RandomNumberGenerator();
        rng.setSeed(666);
        rng.setSeed((time / 1000) | 0)
        const texture = new Texture(new Uint32Array(32 * 32), 32, 32);
        // FIXME:
        // - remove realtime glow and put it pre baked into the texture insteadt!
        for (let k = 0; k < 100; k++) {
            const x = Math.round(rng.getFloat() * 32);
            const y = Math.round(rng.getFloat() * 32);
            if (k < 50)
                texture.texture[x + y * 32] = 47 | 181 << 8 | 243 << 16;
            else
                texture.texture[x + y * 32] = 252 | 130 << 8 | 195 << 16;
        }

        framebuffer.drawPlanedeformationTunnelAnim(time, texture);





        // todo filer onlyy brigh parts
        // blur if too blocky
        // clamp to border when filterting bilinear
        // add and dont blend with alpha
        for (let y = 0; y < GlowScene.GLOW_TEXTURE_HEIGHT; y++) {
            for (let x = 0; x < GlowScene.GLOW_TEXTURE_WIDTH; x++) {
                const xx = Math.round(320 / GlowScene.GLOW_TEXTURE_WIDTH * (x + 0.5));
                const yy = Math.round(200 / GlowScene.GLOW_TEXTURE_HEIGHT * (y + 0.5));

                this.glowBuffer[x + y * GlowScene.GLOW_TEXTURE_WIDTH] = framebuffer.framebuffer[xx + yy * 320];//color ;
            }
        }

        for (let y = 0; y < GlowScene.GLOW_TEXTURE_HEIGHT; y++) {
            for (let x = 0; x < GlowScene.GLOW_TEXTURE_WIDTH; x++) {
                const col1 = this.glowBuffer[Math.max(x - 1, 0) + y * GlowScene.GLOW_TEXTURE_WIDTH];
                const col2 = this.glowBuffer[(x) % GlowScene.GLOW_TEXTURE_WIDTH + y * GlowScene.GLOW_TEXTURE_WIDTH];
                const col3 = this.glowBuffer[Math.min(x + 1, GlowScene.GLOW_TEXTURE_WIDTH - 1) + y * GlowScene.GLOW_TEXTURE_WIDTH];
                const r = (col1 & 0xff) * 1 / 4 + (col2 & 0xff) * 2 / 4 + (col3 & 0xff) * 1 / 4;
                const g = (col1 >> 8 & 0xff) * 1 / 4 + (col2 >> 8 & 0xff) * 2 / 4 + (col3 >> 8 & 0xff) * 1 / 4;
                const b = (col1 >> 16 & 0xff) * 1 / 4 + (col2 >> 16 & 0xff) * 2 / 4 + (col3 >> 16 & 0xff) * 1 / 4;
                this.glowBuffer2[x + y * GlowScene.GLOW_TEXTURE_WIDTH] = r | g << 8 | b << 16;
            }
        }

        for (let y = 0; y < GlowScene.GLOW_TEXTURE_HEIGHT; y++) {
            for (let x = 0; x < GlowScene.GLOW_TEXTURE_WIDTH; x++) {
                const col1 = this.glowBuffer2[(x) + Math.max(y - 1, 0) * GlowScene.GLOW_TEXTURE_WIDTH];
                const col2 = this.glowBuffer2[(x) + y % GlowScene.GLOW_TEXTURE_HEIGHT * GlowScene.GLOW_TEXTURE_WIDTH];
                const col3 = this.glowBuffer2[(x) + Math.min(y + 1, GlowScene.GLOW_TEXTURE_WIDTH - 1) * GlowScene.GLOW_TEXTURE_WIDTH];
                const r = ((col1 & 0xff) * 1 / 4 + (col2 & 0xff) * 2 / 4 + (col3 & 0xff) * 1 / 4);
                const g = ((col1 >> 8 & 0xff) * 1 / 4 + (col2 >> 8 & 0xff) * 2 / 4 + (col3 >> 8 & 0xff) * 1 / 4);
                const b = ((col1 >> 16 & 0xff) * 1 / 4 + (col2 >> 16 & 0xff) * 2 / 4 + (col3 >> 16 & 0xff) * 1 / 4);
                this.glowBuffer[x + y * GlowScene.GLOW_TEXTURE_WIDTH] = r | g << 8 | b << 16;
            }
        }

        // draw Glow
        const glowTexture = new Texture();
        glowTexture.texture = this.glowBuffer;
        glowTexture.width = GlowScene.GLOW_TEXTURE_WIDTH;
        glowTexture.height = GlowScene.GLOW_TEXTURE_HEIGHT;
        glowTexture.setClamp(true);


        framebuffer.drawScaledTextureClipBiAdd(0, 0, 320, 200, glowTexture, 0.70);
        // Cube


        // Motion Blur
        const texture3 = new Texture(this.accumulationBuffer, 320, 200);
        framebuffer.drawTexture(0, 0, texture3, 0.80);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);

         framebuffer.clearDepthBuffer();
           // Animate the skeleton (time in ms → seconds)
                const animTime = time * 0.0015;
                this.model.getMesh(animTime, this.clipIndex);

                const modelViewMatrix = this.mv.getMatrix(time);
                this.renderingPipeline.setFramebuffer(framebuffer);

                const normalMatrix = modelViewMatrix.computeNormalMatrix();
                const mesh: FlatshadedMesh = this.model.mergedMesh;

                for (let i = 0; i < mesh.normals.length; i++) {
                    normalMatrix.multiplyHomArr(mesh.normals[i], mesh.transformedNormals[i]);
                }
                for (let i = 0; i < mesh.points.length; i++) {
                    modelViewMatrix.multiplyHomArr(mesh.points[i], mesh.transformedPoints[i]);
                }

                const faceOrder = this.model.sortFacesByDepth();

                let currentMaterial = '';
                let currentDoubleSided = false;
                for (const fi of faceOrder) {
                    const matName = this.model.getMaterialNameForFace(fi);
                    if (matName !== currentMaterial) {
                        currentMaterial = matName;
                        const engineMat: Material | undefined = this.model.getMaterialForFace(fi);
                        if (engineMat) {
                            this.renderingPipeline.setMaterial(engineMat);
                        }
                    }

                    const ds = this.model.isFaceDoubleSided(fi);
                    if (ds !== currentDoubleSided) {
                        currentDoubleSided = ds;
                        this.renderingPipeline.setCullFace(ds ? CullFace.DISABLED : CullFace.BACK);
                    }

                    this.renderingPipeline.drawFace(framebuffer, mesh, fi);
                }

        framebuffer.noise(time, this.noise);


    }



}
