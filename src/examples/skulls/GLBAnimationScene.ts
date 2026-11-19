import { Color, AbstractScene, RandomNumberGenerator } from '@core';
import { CullFace } from '@engine/geometry/primitives';
import { Framebuffer } from '@engine/rendering/Framebuffer';
import { FlatshadedMesh } from '@engine/geometry/objects';
import { Matrix4f, ModelViewMatrix, Vector4f } from '@engine/math';
import { GLBAnimatedModel, GLBLoader } from '@engine/model/formats/glb';
import { FlatShadingRenderingPipeline, GouraudShadingRenderingPipeline, SubPixelRenderingPipeline, WireFrameRenderingPipeline } from '@engine/rendering/pipelines';
import { Material } from '@engine/rendering/shading/material/Material';
import { PointLight } from '@engine/rendering/shading/light/PointLight';
import { Texture } from '@engine/texture/Texture';
import { TextureUtils } from '@engine/texture/TextureUtils';

export class GLBAnimationScene extends AbstractScene {

    private model: GLBAnimatedModel;
    private renderingPipeline: WireFrameRenderingPipeline;
    private renderingPipeline2: FlatShadingRenderingPipeline;

    private mv: ModelViewMatrix = new ModelViewMatrix();
    private clipIndex: number = 0;
    private accumulationBuffer: Uint32Array;
    private tmpGlitch: Uint32Array;
    private noise: Texture;
    mesh: FlatshadedMesh;
    framebuffer2: Framebuffer;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.framebuffer2 = new Framebuffer(320, 200);
        this.accumulationBuffer = new Uint32Array(framebuffer.width * framebuffer.height);
        this.tmpGlitch = new Uint32Array(framebuffer.width * framebuffer.height);


        this.renderingPipeline = new WireFrameRenderingPipeline(this.framebuffer2);
        this.renderingPipeline2 = new GouraudShadingRenderingPipeline(framebuffer);
        this.renderingPipeline2.setCullFace(CullFace.BACK);
        this.renderingPipeline2.enableLighting(true);

        const rimLight = new PointLight();
        rimLight.ambientIntensity = new Vector4f(0.2, 0.2, 0.2, 1);
        rimLight.diffuseIntensity = new Vector4f(0.6, 0.6, 0.6, 1);
        rimLight.specularIntensity = new Vector4f(0.59, 0.55, 0.35, 1);
        rimLight.position = new Vector4f(-70, 80, 100, 1);

        this.renderingPipeline2.setLights([rimLight]);

        const mat = new Material();
        mat.ambientColor = new Vector4f(1, 1, 1);
        mat.diffuseColor = new Vector4f(0.5, 1, 1);
        mat.emissiveColor = new Vector4f(0, 0, 0);
        mat.specularColor = new Vector4f(0.8, 0.8, 0.8);
        mat.shininess = 5;
        this.renderingPipeline2.setMaterial(mat);
        this.renderingPipeline.setOutlineColor(Color.BLACK.toPackedFormat());
        this.renderingPipeline.setBackgroundColor(Color.WHITE.toPackedFormat());


        return Promise.all([
            TextureUtils.generateProceduralNoise().then((texture: Texture) => this.noise = texture),
            GLBLoader.loadRaw(
                require('@assets/glb/skull2.glb')
            ).then(({ gltf, binChunk }) => {
                this.model = new GLBAnimatedModel(gltf, binChunk);


                // Select the walk animation by name (falls back to clip 0)
                const walkIdx = this.model.getAnimationIndex('Armature|TRex_Walk');
                this.clipIndex = walkIdx >= 0 ? walkIdx : 0;

                // Pose the model at t=0 so computeBounds measures the
                // actual animated geometry rather than raw bind-pose vertices.
                this.model.getMesh(0, this.clipIndex);

                this.mesh = FlatshadedMesh.explode(this.model.mergedMesh);
                // this.mesh = this.model.mergedMesh;
                // Compute surface IDs once from the mesh topology.
                // Use a tight threshold (30°) so that only truly coplanar faces
                // (e.g. triangles within the same pentagonal face) are merged.
                // The default 80° is too wide for the dodecahedron whose adjacent
                // face normals differ by only ~63°.
                this.renderingPipeline.computeSurfaceIds(this.mesh, 1);

                this.mv.autoFit(this.mesh.points)
            })]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.framebuffer2.clearColorBuffer(Color.DARK_GRAY.mul(2.0).toPackedFormat());
        this.framebuffer2.clearDepthBuffer();
        this.renderingPipeline.clearBuffers();

        // Animate the skeleton (time in ms → seconds)
        const animTime = time * 0.001;

        const s = this.mv.scale * 1.2;
        const SKULLS_PER_ROW = 4;
        const ONE_ROUND = Math.PI * 2;

          framebuffer.clearColorBuffer(Color.DARK_GRAY.mul(2.0).toPackedFormat());
        framebuffer.clearDepthBuffer();

        for (let j = 0; j < 5; j++) {
            const Y_OFFSET = j * 3 + (time * 0.01 % 100) / 99 * 6;
            const ROTATION = Y_OFFSET + (j % 2 ? 0 : ONE_ROUND / SKULLS_PER_ROW * 0.5);
            for (let i = 0; i < SKULLS_PER_ROW; i++) {
                const modelViewMatrix = Matrix4f.constructIdentityMatrix()
                    .multiplyMatrix(Matrix4f.constructTranslationMatrix(0, -9, -12))
                    .multiplyMatrix(Matrix4f.constructYRotationMatrix(ONE_ROUND * i / SKULLS_PER_ROW + ROTATION))
                    .multiplyMatrix(Matrix4f.constructTranslationMatrix(0, Y_OFFSET, +3))
                    .multiplyMatrix(Matrix4f.constructScaleMatrix(s, s, s))
                    .multiplyMatrix(Matrix4f.constructTranslationMatrix(
                        -this.mv.center.x, -this.mv.center.y, -this.mv.center.z
                    ));

                this.renderingPipeline.setFramebuffer(framebuffer);

                this.renderingPipeline2.draw(framebuffer, this.mesh, modelViewMatrix);
                //  this.renderingPipeline.drawOutline(framebuffer, this.mesh, modelViewMatrix, false);

            }
        }

        for (let j = 0; j < 5; j++) {
            const Y_OFFSET = j * 3 + (time * 0.01 % 100) / 99 * 6;
            const ROTATION = Y_OFFSET + (j % 2 ? 0 : ONE_ROUND / SKULLS_PER_ROW * 0.5);
            for (let i = 0; i < SKULLS_PER_ROW; i++) {
                const modelViewMatrix = Matrix4f.constructIdentityMatrix()
                    .multiplyMatrix(Matrix4f.constructTranslationMatrix(0, -9, -12))
                    .multiplyMatrix(Matrix4f.constructYRotationMatrix(ONE_ROUND * i / SKULLS_PER_ROW + ROTATION))
                    .multiplyMatrix(Matrix4f.constructTranslationMatrix(0, Y_OFFSET, +3))
                    .multiplyMatrix(Matrix4f.constructScaleMatrix(s, s, s))
                    .multiplyMatrix(Matrix4f.constructTranslationMatrix(
                        -this.mv.center.x, -this.mv.center.y, -this.mv.center.z
                    ));


                // this.renderingPipeline2.draw(framebuffer, this.mesh, modelViewMatrix);
                this.renderingPipeline.drawOutline(this.framebuffer2, this.mesh, modelViewMatrix, true);

            }
        }

        const tex = new Texture(this.framebuffer2.framebuffer, 320,200);
       framebuffer.drawTextureFullscreenMul(tex, 0)
        /*
        const texture3: Texture = new Texture(this.accumulationBuffer, framebuffer.width, framebuffer.height);
        framebuffer.drawTexture(0, 0, texture3, 0.35);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);
        */

        this.glitchScreen(framebuffer, time * 3, this.noise);
    }

    public glitchScreen(framebuffer: Framebuffer, elapsedTime: number, texture: Texture, noise: boolean = true): void {

        const glitchFactor = (Math.sin(elapsedTime * 0.00002) * 0.9 + 0.1);
        const rng = new RandomNumberGenerator();
        rng.setSeed((elapsedTime / 250) | 0);
        const texture2 = new Texture();
        texture2.height = framebuffer.height;
        texture2.width = framebuffer.width;
        texture2.texture = framebuffer.framebuffer;


        const blockWidth = 20;
        const horizontalUnits = Math.floor(framebuffer.width / blockWidth);
        const verticalUnits = Math.floor(framebuffer.height / blockWidth);

        for (let x = 0; x < horizontalUnits; x++) {
            for (let y = 0; y < verticalUnits; y++) {
                if (rng.getFloat() > 0.25) {
                    continue;
                }

                framebuffer.drawTextureRect(blockWidth * (horizontalUnits - x), blockWidth * ((horizontalUnits * rng.getFloat()) | 0), blockWidth * x, blockWidth * y, blockWidth, blockWidth, texture2.texture, texture2.width, 0.03 + 0.35 * glitchFactor);
            }
        }

        if (noise) {
            for (let x = 0; x < horizontalUnits; x++) {
                for (let y = 0; y < verticalUnits; y++) {
                    framebuffer.drawTextureRect(x * blockWidth, y * blockWidth, blockWidth * (Math.round(elapsedTime / 100 + x + y) % 12), 0, blockWidth, blockWidth, texture.texture, texture.width, 0.1 + 0.3 * glitchFactor);
                }
            }
        }

        framebuffer.fastFramebufferCopy(this.tmpGlitch, framebuffer.framebuffer);

        // now distort the tmpGlitch buffer and render to framebuffer again

        const rng2 = new RandomNumberGenerator();

        for (let k = 0; k < 8; k++) {
            let yStart = Math.round(rng.getFloat() * 180);
            const size = 3 + Math.round(rng.getFloat() * 20);
            rng2.setSeed((elapsedTime / 250) | 0);
            const scale = rng2.getFloat() * glitchFactor;
            const off = rng.getFloat() * glitchFactor;
            for (let y = 0; y < size; y++) {
                const offset = Math.abs(Math.round(off * 25) + Math.round(rng2.getFloat() * 3)
                    + Math.round(Math.cos(y * 0.01 + elapsedTime * 0.002 + off) * scale * 5));

                let index = yStart * framebuffer.width;
                let glIndex = yStart * framebuffer.width + framebuffer.width - offset;

                for (let i = 0; i < Math.max(0, offset); i++) {
                    framebuffer.framebuffer[index++] = this.tmpGlitch[glIndex++];
                }

                glIndex = yStart * framebuffer.width;
                const count = framebuffer.width - offset;

                for (let i = 0; i < count; i++) {
                    framebuffer.framebuffer[index++] = this.tmpGlitch[glIndex++];
                }
                yStart++;
            }
        }
    }

}
