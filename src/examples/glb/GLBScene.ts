import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';
import { Matrix4f, Vector4f } from '../../math';
import { GLBLoader } from '../../model/glb/GLBLoader';
import { GLBModel } from '../../model/glb/GLBModel';
import { SubPixelRenderingPipeline } from '../../rendering-pipelines/SubPixelRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Material } from '../../shading/material/Material';
import { PointLight } from '../../shading/light/PointLight';

/**
 * A software-rendered, flat-shaded, sub-pixel-accurate, depth-sorted,
 * back-face-culled, two-point-lit, multi-material, perspective-projected,
 * near-plane-clipped, normal-matrix-corrected, GLB-loaded 3D model.
 *
 * Demonstrates loading a GLB (Binary glTF 2.0) file.  Each mesh
 * primitive is rendered with Phong-lit sub-pixel shading using PBR
 * material properties approximated from the glTF metallic-roughness
 * model.
 *
 * Material conversion and depth-sorting are handled by
 * {@link GLBModel}; the scene only owns the rendering
 * pipeline, lights, and camera.
 */
export class GLBScene extends AbstractScene {

    private model: GLBModel;
    private renderingPipeline: SubPixelRenderingPipeline;

    // Auto-fit camera parameters (computed from model bounds)
    private modelCenter: Vector4f;
    private autoScale: number;
    private cameraZ: number;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.renderingPipeline = new SubPixelRenderingPipeline(framebuffer);
        this.renderingPipeline.setCullFace(CullFace.BACK);
        this.renderingPipeline.enableLighting(true);

        // Set up scene lights
        const keyLight: PointLight = new PointLight();
        keyLight.ambientIntensity = new Vector4f(0.7, 0.7, 0.7, 1);
        keyLight.diffuseIntensity = new Vector4f(1.2, 1.15, 1.1, 1);
        keyLight.specularIntensity = new Vector4f(1.2, 1.2, 1.2, 1);
        keyLight.position = new Vector4f(80, -120, -180, 1);

        const fillLight: PointLight = new PointLight();
        fillLight.ambientIntensity = new Vector4f(0.4, 0.4, 0.45, 1);
        fillLight.diffuseIntensity = new Vector4f(0.8, 0.8, 0.9, 1);
        fillLight.specularIntensity = new Vector4f(0.5, 0.5, 0.5, 1);
        fillLight.position = new Vector4f(-120, -60, -80, 1);

        const rimLight: PointLight = new PointLight();
        rimLight.ambientIntensity = new Vector4f(0.15, 0.15, 0.2, 1);
        rimLight.diffuseIntensity = new Vector4f(0.5, 0.5, 0.6, 1);
        rimLight.specularIntensity = new Vector4f(0.4, 0.4, 0.4, 1);
        rimLight.position = new Vector4f(0, -180, 100, 1);

        this.renderingPipeline.setLights([keyLight, fillLight, rimLight]);

        return GLBLoader.load(
            require('@assets/glb/computer.glb')
        ).then((meshGroups) => {
            this.model = new GLBModel(meshGroups);

            // Auto-fit camera to model bounds so every part stays in
            // front of the near-plane during rotation.
            const bounds = this.model.computeBounds();
            this.modelCenter = bounds.center;
            const radius = Math.max(bounds.radius, 0.001);

            // Scale model so bounding-sphere radius becomes ~3 view-space units.
            const targetRadius = 3.0;
            this.autoScale = targetRadius / radius;

            // Place camera at 2.8× the scaled radius — guarantees the
            // nearest point (centre − radius) is well past the default
            // NEAR_PLANE_Z (−1.7).
            //   front = −cameraZ + targetRadius  must be < NEAR_PLANE_Z
            //   i.e. cameraZ > targetRadius − |NEAR_PLANE_Z|
            //   2.8 * 3 = 8.4;  front = −8.4 + 3 = −5.4 ≪ −1.7 ✓
            this.cameraZ = -(2.8 * targetRadius);
        });
    }

    public render(framebuffer: Framebuffer, time: number): void {
        framebuffer.clearColorBuffer(Color.SLATE_GRAY.toPackedFormat());
        framebuffer.clearDepthBuffer();

        const modelViewMatrix: Matrix4f = this.getModelViewMatrix(time);
        this.renderingPipeline.setFramebuffer(framebuffer);

        // Transform all vertices and normals once
        const normalMatrix: Matrix4f = modelViewMatrix.computeNormalMatrix();
        const mesh: FlatshadedMesh = this.model.mergedMesh;

        for (let i = 0; i < mesh.normals.length; i++) {
            normalMatrix.multiplyHomArr(mesh.normals[i], mesh.transformedNormals[i]);
        }
        for (let i = 0; i < mesh.points.length; i++) {
            modelViewMatrix.multiplyHomArr(mesh.points[i], mesh.transformedPoints[i]);
        }

        // Sort faces back-to-front and draw with per-face material switching
        const faceOrder: Array<number> = this.model.sortFacesByDepth();

        let currentMaterial: string = '';
        let currentDoubleSided: boolean = false;
        for (const fi of faceOrder) {
            const matName: string = this.model.getMaterialNameForFace(fi);
            if (matName !== currentMaterial) {
                currentMaterial = matName;
                const engineMat: Material | undefined = this.model.getMaterialForFace(fi);
                if (engineMat) {
                    this.renderingPipeline.setMaterial(engineMat);
                }
            }

            // Toggle back-face culling for doubleSided materials
            const ds: boolean = this.model.isFaceDoubleSided(fi);
            if (ds !== currentDoubleSided) {
                currentDoubleSided = ds;
                this.renderingPipeline.setCullFace(ds ? CullFace.DISABLED : CullFace.BACK);
            }

            this.renderingPipeline.drawFace(framebuffer, mesh, fi);
        }
    }

    private getModelViewMatrix(elapsedTime: number): Matrix4f {
        // Pipeline (applied right-to-left):
        //   1. Translate model centre to origin
        //   2. Uniform scale so radius ≈ 3 units
        //   3. Rotate around Y
        //   4. Translate into view (camera position)
        return Matrix4f.constructTranslationMatrix(0, 0, this.cameraZ)
            .multiplyMatrix(Matrix4f.constructYRotationMatrix(-elapsedTime * 0.0006))
            .multiplyMatrix(Matrix4f.constructScaleMatrix(this.autoScale, this.autoScale, this.autoScale))
            .multiplyMatrix(Matrix4f.constructTranslationMatrix(
                -this.modelCenter.x, -this.modelCenter.y, -this.modelCenter.z
            ));
    }

}
