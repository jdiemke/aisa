import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Starfield } from '@effects/starfield/Starfield';
import { Framebuffer } from '../../Framebuffer';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';
import { Matrix4f, ModelViewMatrix, Vector4f } from '../../math';
import { GLBLoader } from '../../model/glb/GLBLoader';
import { GLBModel } from '../../model/glb/GLBModel';
import { SubPixelRenderingPipeline } from '../../rendering-pipelines/SubPixelRenderingPipeline';
import { TexturedMesh } from '../../rendering-pipelines/TexturedMesh';
import { TexturingRenderingPipeline } from '../../rendering-pipelines/TexturingRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Material } from '../../shading/material/Material';
import { PointLight } from '../../shading/light/PointLight';
import { Texture } from '../../texture/Texture';
import { TextureCoordinate } from '../../TextureCoordinate';
import { CubeScene } from '../cube/CubeScene';

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
    private mv: ModelViewMatrix = new ModelViewMatrix();
    private starfield: Starfield = new Starfield();
    private cubeScene: CubeScene = new CubeScene();
    private screenFramebuffer: Framebuffer;
    private screenTexture: Texture;
    private screenMesh: TexturedMesh;
    private screenPipeline: TexturingRenderingPipeline;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.screenFramebuffer = new Framebuffer(256, 200);
        this.screenTexture = new Texture(this.screenFramebuffer.framebuffer, 256, 200);
        this.screenPipeline = new TexturingRenderingPipeline(framebuffer);
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

        return Promise.all([
            GLBLoader.load(require('@assets/glb/computer.glb')),
            this.cubeScene.init(this.screenFramebuffer),
            this.starfield.init()
        ]).then(([meshGroups]) => {
            const screen = meshGroups.find(group => group.materialName === 'M_screen_brightblue');
            if (!screen) {
                throw new Error('GLBScene: computer screen material not found');
            }
            const points = screen.mesh.points;
            const minX = Math.min(...points.map(point => point.x));
            const maxX = Math.max(...points.map(point => point.x));
            const minY = Math.min(...points.map(point => point.y));
            const maxY = Math.max(...points.map(point => point.y));
            this.screenMesh = {
                points,
                points2: screen.mesh.transformedPoints,
                uv: points.map(point => new TextureCoordinate(
                    (point.x - minX) / (maxX - minX),
                    (maxY - point.y) / (maxY - minY)
                )),
                faces: screen.mesh.faces.map(face => ({
                    vertices: [face.v1, face.v2, face.v3],
                    uv: [face.v1, face.v2, face.v3]
                }))
            };
            this.model = new GLBModel(meshGroups.filter(
                group => group.materialName !== 'M_screen_whitetext'
            ));
            this.mv.xSpeed = 0;
            this.mv.distanceFactor = 2.0;
            this.mv.autoFit(this.model.mergedMesh.points);
        });
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.renderBackground(framebuffer, time);

        const modelViewMatrix: Matrix4f = this.createModelViewMatrix(time);
        this.transformModel(modelViewMatrix);
        this.renderComputer(framebuffer);
        this.renderScreen(framebuffer, time, modelViewMatrix);
    }

    private renderBackground(framebuffer: Framebuffer, time: number): void {
        this.starfield.render3D(framebuffer, time);
        framebuffer.clearDepthBuffer();
    }

    private createModelViewMatrix(time: number): Matrix4f {
        const yaw: number = Math.sin(time * 0.0006) * Math.PI / 6;
        const scale: number = this.mv.scale * this.mv.extraScale;
        const cameraZ = this.mv.cameraZ + (1 - Math.cos(time * Math.PI * 2 / 16000)) * 1.25;
        return Matrix4f.constructTranslationMatrix(0, -0.05, cameraZ)
            .multiplyMatrix(Matrix4f.constructYRotationMatrix(yaw))
            .multiplyMatrix(Matrix4f.constructScaleMatrix(scale, scale, scale))
            .multiplyMatrix(Matrix4f.constructTranslationMatrix(
            -this.mv.center.x, -this.mv.center.y, -this.mv.center.z
            ));
    }

    private transformModel(modelViewMatrix: Matrix4f): void {
        const normalMatrix: Matrix4f = modelViewMatrix.computeNormalMatrix();
        const mesh: FlatshadedMesh = this.model.mergedMesh;

        for (let i = 0; i < mesh.normals.length; i++) {
            normalMatrix.multiplyHomArr(mesh.normals[i], mesh.transformedNormals[i]);
        }
        for (let i = 0; i < mesh.points.length; i++) {
            modelViewMatrix.multiplyHomArr(mesh.points[i], mesh.transformedPoints[i]);
        }
    }

    private renderComputer(framebuffer: Framebuffer): void {
        this.renderingPipeline.setFramebuffer(framebuffer);
        const mesh: FlatshadedMesh = this.model.mergedMesh;
        const faceOrder: Array<number> = this.model.sortFacesByDepth();

        let currentMaterial: string = '';
        let currentDoubleSided: boolean = false;
        for (const fi of faceOrder) {
            const matName: string = this.model.getMaterialNameForFace(fi);
            if (matName === 'M_screen_brightblue') {
                continue;
            }
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

    private renderScreen(framebuffer: Framebuffer, time: number, modelViewMatrix: Matrix4f): void {
        this.cubeScene.render(this.screenFramebuffer, time);
        framebuffer.setTexture(this.screenTexture);
        framebuffer.setCullFace(CullFace.BACK);
        this.screenPipeline.setFramebuffer(framebuffer);
        this.screenPipeline.setModelViewMatrix(modelViewMatrix);
        this.screenPipeline.draw(framebuffer, this.screenMesh);
    }


}
