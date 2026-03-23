import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';
import { Matrix4f, ModelViewMatrix, Vector4f } from '../../math';
import { GLBAnimatedModel } from '../../model/glb/GLBAnimatedModel';
import { GLBLoader } from '../../model/glb/GLBLoader';
import { SubPixelRenderingPipeline } from '../../rendering-pipelines/SubPixelRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Material } from '../../shading/material/Material';
import { PointLight } from '../../shading/light/PointLight';

export class GLBAnimationScene extends AbstractScene {

    private model: GLBAnimatedModel;
    private renderingPipeline: SubPixelRenderingPipeline;

    private mv: ModelViewMatrix = new ModelViewMatrix();
    private clipIndex: number = 0;

    public init(framebuffer: Framebuffer): Promise<any> {
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

        this.renderingPipeline.setLights([keyLight, fillLight, rimLight]);

        return GLBLoader.loadRaw(
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
            this.mv.extraScale = 2.50;
            this.mv.autoFit(this.model.mergedMesh.points);
        });
    }

    public render(framebuffer: Framebuffer, time: number): void {
        framebuffer.clearColorBuffer(Color.SLATE_GRAY.toPackedFormat());
        framebuffer.clearDepthBuffer();

        // Animate the skeleton (time in ms → seconds)
        const animTime = time * 0.001;
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
    }


}
