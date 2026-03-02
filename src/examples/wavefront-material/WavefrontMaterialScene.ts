import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';
import { Matrix4f, Vector4f } from '../../math';
import { WavefrontLoader } from '../../model/wavefront-obj/WavefrontLoader';
import { WavefrontMaterialModel } from '../../model/wavefront-obj/WavefrontMaterialModel';
import { SubPixelRenderingPipeline } from '../../rendering-pipelines/SubPixelRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Material } from '../../shading/material/Material';
import { PointLight } from '../../shading/light/PointLight';

/**
 * Demonstrates loading a Wavefront OBJ file with its companion MTL
 * material library.  Each mesh group is rendered with Phong-lit
 * sub-pixel shading, using the Ka / Kd / Ks / Ns properties from the MTL.
 *
 * Merge, material conversion and depth-sorting are handled by
 * {@link WavefrontMaterialModel}; the scene only owns the rendering
 * pipeline, lights, and camera.
 */
export class WavefrontMaterialScene extends AbstractScene {

    private model: WavefrontMaterialModel;
    private renderingPipeline: SubPixelRenderingPipeline;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.renderingPipeline = new SubPixelRenderingPipeline(framebuffer);
        this.renderingPipeline.setCullFace(CullFace.BACK);
        this.renderingPipeline.enableLighting(true);

        // Set up scene lights
        const keyLight: PointLight = new PointLight();
        keyLight.ambientIntensity = new Vector4f(0.3, 0.3, 0.3, 1);
        keyLight.diffuseIntensity = new Vector4f(0.9, 0.85, 0.8, 1);
        keyLight.specularIntensity = new Vector4f(1.0, 1.0, 1.0, 1);
        keyLight.position = new Vector4f(100, -150, -200, 1);

        const fillLight: PointLight = new PointLight();
        fillLight.ambientIntensity = new Vector4f(0.1, 0.1, 0.15, 1);
        fillLight.diffuseIntensity = new Vector4f(0.3, 0.35, 0.5, 1);
        fillLight.specularIntensity = new Vector4f(0.2, 0.2, 0.2, 1);
        fillLight.position = new Vector4f(-150, -80, -100, 1);

        this.renderingPipeline.setLights([keyLight, fillLight]);

        return WavefrontLoader.loadWithMaterial(
            require('@assets/wavefront/chicken/Chicken_01.obj'),
            require('@assets/wavefront/chicken/Chicken_01.mtl')
        ).then((model: WavefrontMaterialModel) => {
            this.model = model;
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
        for (const fi of faceOrder) {
            const matName: string = this.model.getMaterialNameForFace(fi);
            if (matName !== currentMaterial) {
                currentMaterial = matName;
                const engineMat: Material | undefined = this.model.getMaterialForFace(fi);
                if (engineMat) {
                    this.renderingPipeline.setMaterial(engineMat);
                }
            }
            this.renderingPipeline.drawFace(framebuffer, mesh, fi);
        }
    }

    private getModelViewMatrix(elapsedTime: number): Matrix4f {
        const camera: Matrix4f = Matrix4f.constructTranslationMatrix(0, -95, -350).multiplyMatrix(
            Matrix4f.constructYRotationMatrix(-elapsedTime * 0.0006)
        );

        return camera.multiplyMatrix(Matrix4f.constructScaleMatrix(1, 1, 1));
    }

}
