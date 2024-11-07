import { Framebuffer } from '../../Framebuffer';
import { Matrix4f, Vector3f, Vector4f } from '../../math';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { TextureCoordinate } from '../../TextureCoordinate';
import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { TexturingRenderingPipeline } from '../../rendering-pipelines/TexturingRenderingPipeline';
import { TexturedMesh } from '../../rendering-pipelines/TexturedMesh';


export class EnvironmentMappingScene extends AbstractScene {

    private flood: Texture;
    public env: Texture;
    private texturedRenderingPipeline: TexturingRenderingPipeline;
    private mesh: TexturedMesh ;
    points: Array<Vector4f> = [];
    textCoords: Array<TextureCoordinate> = [];
    index: Array<number> = [];
    normals: Array<Vector4f> = new Array<Vector4f>();
    public init(framebuffer: Framebuffer): Promise<any> {
        this.texturedRenderingPipeline = new TexturingRenderingPipeline(framebuffer);
        this.buildTorusMesh();

        return Promise.all([
            TextureUtils.load(require('@assets/flood.png'), false).then(
                texture => this.flood = texture
            ),
            TextureUtils.load(require('@assets/envmap.png'), false).then(
                texture => this.env = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        framebuffer.setCullFace(CullFace.FRONT);
        framebuffer.clearColorBuffer(Color.BLACK.toPackedFormat());
        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.flood.texture);
        framebuffer.setTexture(this.env);

        const scale = 2.1;
        const elapsedTime =  time * 0.008;
        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.25));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.3));
        modelViewMartrix = Matrix4f.constructTranslationMatrix(Math.sin(elapsedTime * 0.09) * 10+20, Math.sin(elapsedTime * 0.1) * 10
            , -85)
            .multiplyMatrix(modelViewMartrix);

            framebuffer.wBuffer.fill(100);
           
        this.shadingTorusENvironment(framebuffer,modelViewMartrix);
     
    }

    private buildTorusMesh(): void {
        const STEPS = 35 * 2;
        const STEPS2 = 8 * 2;
        for (let i = 0; i < STEPS + 1; i++) {
        const frame = this.torusFunction3(i * 2 * Math.PI / STEPS);
            const frame2 = this.torusFunction3(i * 2 * Math.PI / STEPS + 0.01);
            const tangent = frame2.sub(frame);
            let up = frame.add(frame2).normalize();
            const right = tangent.cross(up).normalize().mul(4.4);
            up = right.cross(tangent).normalize().mul(4.4);

            for (let r = 0; r < STEPS2 + 1; r++) {
                const pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS2)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS2))).add(frame);
                this.points.push(new Vector4f(pos.x, pos.y, pos.z));
                const normal = frame.sub(pos).normalize();
                this.normals.push(new Vector4f(normal.x, normal.y, normal.z, 0));
                const t = new TextureCoordinate();
                t.u = 1 / (STEPS2) * r;
                t.v = 1 / (STEPS) * i;
                this.textCoords.push(t);
            }
        }

        for (let j = 0; j < STEPS; j++) {
            for (let i = 0; i < STEPS2; i++) {
                this.index.push((((STEPS2 + 1) * j) + (1 + i))); // 2
                this.index.push((((STEPS2 + 1) * j) + (0 + i))); // 1
                this.index.push((((STEPS2 + 1) * j) + (STEPS2 + 1) + (1 + i))); //3

                this.index.push((((STEPS2 + 1) * j) + (STEPS2 + 1) + (0 + i))); //4
                this.index.push((((STEPS2 + 1) * j) + (STEPS2 + 1) + (1 + i))); //3
                this.index.push((((STEPS2 + 1) * j) + (0 + i))); // 5
            }
        }
    
      this.mesh = new TexturedMesh();
      this.mesh.points = this.points;
      this.mesh.normals = this.normals;
      this.mesh.normals2 = this.normals.map(() => new Vector4f(0,0,0));
      this.mesh.points2 = this.points.map(() => new Vector4f(0,0,0));
      this.mesh.uv = this.points.map(() => new TextureCoordinate());
     const faces = [];
      for (let i = 0; i < this.index.length; i += 3) {




        const face = {
            vertices: [this.index[i], this.index[i+1], this.index[i+2]],
            uv: null,
            normals: [this.index[i], this.index[i+1], this.index[i+2]]
        };
        faces.push(face);
      }
      this.mesh.faces = faces;
    }

    private torusFunction3(alpha: number): Vector3f {
        const p = 2
        const q = 3;
        const r = 0.5 * (2 + Math.sin(q * alpha));
        return new Vector3f(r * Math.cos(p * alpha),
            r * Math.cos(q * alpha),
            r * Math.sin(p * alpha)).mul(10);
    }


    public shadingTorusENvironment(framebuffer: Framebuffer,modelViewMartrix: Matrix4f): void {
   
      

        
        this.texturedRenderingPipeline.setSphereMapping(true);
        framebuffer.setCullFace(CullFace.BACK);
        this.texturedRenderingPipeline.setModelViewMatrix(modelViewMartrix);
       this.texturedRenderingPipeline.draw(framebuffer, this.mesh);
    }


}