import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';
import { ModelViewMatrix as GlbModelViewMatrix, Matrix4f, Vector4f } from '../../math/index';
import { GLBLoader } from '../../model/glb/GLBLoader';
import { GLBModel } from '../../model/glb/GLBModel';
import { SubPixelRenderingPipeline } from '../../rendering-pipelines/SubPixelRenderingPipeline';
import { TexturedMesh } from '../../rendering-pipelines/TexturedMesh';
import { TexturingRenderingPipeline } from '../../rendering-pipelines/TexturingRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';
import { PointLight } from '../../shading/light/PointLight';
import { Material } from '../../shading/material/Material';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { TextureCoordinate } from '../../TextureCoordinate';
import { ModelViewMatrix } from '../md2/ModelViewMatrix';


export class ThirdPersonCameraScene extends AbstractScene {

    private static readonly CLEAR_COLOR: number = Color.SLATE_GRAY.toPackedFormat();

    private ground: Texture;
    private modelViewMatrix: ModelViewMatrix = new ModelViewMatrix();
        private modelViewMatrix2: ModelViewMatrix = new ModelViewMatrix();
    private floor: TexturedMesh;
    private texturedRenderingPipeline: TexturingRenderingPipeline;

    private model: GLBModel;
    private renderingPipeline: SubPixelRenderingPipeline;
    private mv: GlbModelViewMatrix = new GlbModelViewMatrix();

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
               rimLight.specularIntensity = new Vector4f(0.9, 0.9, 0.9, 1);
               rimLight.position = new Vector4f(0, -180, 100, 1);

               this.renderingPipeline.setLights([rimLight]);
        this.texturedRenderingPipeline = new TexturingRenderingPipeline(framebuffer);

        this.texturedRenderingPipeline.setCullFace(CullFace.BACK);

        return Promise.all([
            TextureUtils.load(require('@assets/starwars.png'), true).then(
                (texture: Texture) => this.ground = texture),
            GLBLoader.load(
                require('@assets/glb/x-wing.glb')
            ).then((meshGroups) => {
                this.model = new GLBModel(meshGroups);
                this.mv.xSpeed = 0;
                this.mv.scale = 6;

                //this.mv.autoFit(this.model.mergedMesh.points);
            })
        ]);
    }

    public onInit(): void {


        const mesh: TexturedMesh = new TexturedMesh();
        const size = 40;
        const height = 3;
        mesh.points = [
            new Vector4f(-size, -height, size),
            new Vector4f(size, -height, size),
            new Vector4f(size, -height, -size),
            new Vector4f(-size, -height, -size),

            new Vector4f(-size, height, size),
            new Vector4f(size, height, size),
            new Vector4f(size, height, -size),
            new Vector4f(-size, height, -size),
        ];
        mesh.uv = [
            new TextureCoordinate(0, 0),
            new TextureCoordinate(4.0, 0),
            new TextureCoordinate(4.0, 4.0),
            new TextureCoordinate(0, 4.0)
        ];
        mesh.points2 = mesh.points.map(() => new Vector4f(0, 0, 0, 0));
        mesh.faces = [
            {
                uv: [0, 1, 2],
                vertices: [0, 1, 2]
            },
            {
                uv: [2, 3, 0],
                vertices: [2, 3, 0]
            },/*
            {
                uv: [0, 3, 2],
                vertices: [4, 7, 6]
            },
            {
                uv: [2, 1, 0],
                vertices: [6, 5, 4]
            },*/

        ];
        this.floor = mesh;
    }

    public render(framebuffer: Framebuffer, time: number): void {
        time *= 1.9;
        framebuffer.clearColorBuffer(ThirdPersonCameraScene.CLEAR_COLOR);
        framebuffer.clearDepthBuffer();

        this.computeModelViewTransformation(time);
        this.computeModelViewTransformation2(time);
        this.displaceTextureCoordinates(time);

        this.texturedRenderingPipeline.setModelViewMatrix(this.modelViewMatrix.getMatrix());
        framebuffer.setTexture(this.ground);
        this.texturedRenderingPipeline.draw(framebuffer, this.floor);
   framebuffer.drawFog(new Color(20, 20, 20, 45), 0.038, 0.03);
        //
                const modelViewMatrix: Matrix4f = this.modelViewMatrix2.getMatrix();//this.mv.getMatrix(time);
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

    private computeModelViewTransformation(time: number): void {
       // time=1;
        this.modelViewMatrix.setIdentity();
         this.modelViewMatrix.translate(0, 0, -5);
    // this.modelViewMatrix.rotate(0, 0, 1, time * 0.03);
 // this.modelViewMatrix.rotate(1, 0, 0, Math.sin(time * 0.004)*30+30);

        this.modelViewMatrix.rotate(0, 1, 0, time * 0.035);

    }
        private computeModelViewTransformation2(time: number): void {
       // time=1;
        this.modelViewMatrix2.setIdentity();
     this.modelViewMatrix2.translate(0,0, -6.8);


     //this.modelViewMatrix.rotate(0, 0, 1, Math.sin( time * 0.0003)*90);
      //this.modelViewMatrix2.rotate(1, 0, 0, Math.sin(time * 0.004)*30+30);





 this.modelViewMatrix2.rotate(0, 1, 0, time * 0.035);

    this.modelViewMatrix2.rotate(0, 0, 1, Math.sin(time * 0.0004)*30);
     this.modelViewMatrix2.rotate(0, 1, 0, -28);
    }

    private displaceTextureCoordinates(time: number): void {
        const disp = ((time*0.2) %100)/100;
        const dispu = 0;
        this.floor.uv = [
            new TextureCoordinate(0 + dispu, 0 + disp),
            new TextureCoordinate(8.0 + dispu, 0 + disp),
            new TextureCoordinate(8.0 + dispu, 8.0 + disp),
            new TextureCoordinate(0 + dispu, 8.0 + disp)
        ];
    }

}
