import { Framebuffer } from '../../Framebuffer';
import { Matrix4f, Vector3f, Vector4f } from '../../math';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { Vertex } from '../../Vertex';
import { TextureCoordinate } from '../../TextureCoordinate';
import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { TexturingRenderingPipeline } from '../../rendering-pipelines/TexturingRenderingPipeline';

interface IndexMesh {
    points: Array<Vector4f>,
    points2: Array<Vector4f>,
    normals: Array<Vector4f>,
    normals2: Array<Vector4f>,
    index: Array<number>
}

export class EnvironmentMappingScene extends AbstractScene {

    private flood: Texture;
    public env: Texture;
    private texturedRenderingPipeline: TexturingRenderingPipeline;

    points: Array<Vector4f> = [];
    textCoords: Array<TextureCoordinate> = [];
    index: Array<number> = [];
    normals: Array<Vector4f> = new Array<Vector4f>();
    public init(framebuffer: Framebuffer): Promise<any> {
        this.texturedRenderingPipeline = new TexturingRenderingPipeline(framebuffer);
        this.buildTorusMesh();

        return Promise.all([
            TextureUtils.load(require('../../assets/flood.png'), false).then(
                texture => this.flood = texture
            ),
            TextureUtils.load(require('../../assets/envmap.png'), false).then(
                texture => this.env = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        framebuffer.setCullFace(CullFace.FRONT);
        framebuffer.clearColorBuffer(Color.BLACK.toPackedFormat());
        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.flood.texture);
        framebuffer.setTexture(this.env);

        let scale = 2.1;
        const elapsedTime =  time * 0.008;
        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.25));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.3));
        modelViewMartrix = Matrix4f.constructTranslationMatrix(Math.sin(elapsedTime * 0.09) * 10+20, Math.sin(elapsedTime * 0.1) * 10
            , -65)
            .multiplyMatrix(modelViewMartrix);

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
                let pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS2)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS2))).add(frame);
                this.points.push(new Vector4f(pos.x, pos.y, pos.z));
                let normal = frame.sub(pos).normalize();
                this.normals.push(new Vector4f(normal.x, normal.y, normal.z, 0));
                let t = new TextureCoordinate();
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


        let points2: Array<Vector4f> = new Array<Vector4f>();
        let normals2: Array<Vector4f> = new Array<Vector4f>();

        framebuffer.wBuffer.fill(100);

        for (let n = 0; n < this.normals.length; n++) {
            normals2.push(modelViewMartrix.multiplyHom(this.normals[n]));
        }


        for (let p = 0; p < this.points.length; p++) {
            let transformed = modelViewMartrix.multiplyHom(this.points[p]);

            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z; // TODO: use translation matrix!

            let xx = (framebuffer.width * 0.5) + (x / (-z * 0.0078));
            let yy = (framebuffer.height * 0.5) + (y / (-z * 0.0078));
            // commented out because it breaks the winding. inversion
            // of y has to be done after back-face culling in the
            // viewport transform
            // yy =(this.height * 0.5) - (y / (-z * 0.0078));

            points2.push(new Vector4f(Math.round(xx), Math.round(yy), z));
        }

        let vertex1 = new Vertex();
        vertex1.textureCoordinate = new TextureCoordinate();
        let vertex2 = new Vertex();
        vertex2.textureCoordinate = new TextureCoordinate();
        let vertex3 = new Vertex();
        vertex3.textureCoordinate = new TextureCoordinate();
        let vertexArray = new Array<Vertex>(vertex1, vertex2, vertex3);
        for (let i = 0; i < this.index.length; i += 3) {

            // Only render triangles with CCW-ordered vertices
            //
            // Reference:
            // David H. Eberly (this.height6).
            // 3D Game Engine Design: A Practical Approach to Real-Time Computer Graphics,
            // p. 69. Morgan Kaufmann Publishers, United States.
            //
            let v1 = points2[this.index[i]];
            let n1 = normals2[this.index[i]].normalize();

            let v2 = points2[this.index[i + 1]];
            let n2 = normals2[this.index[i + 1]].normalize();

            let v3 = points2[this.index[i + 2]];
            let n3 = normals2[this.index[i + 2]].normalize();

            if (framebuffer.isTriangleCCW(v1, v2, v3)) {

                let normal = n3;
                let scalar = Math.min((Math.max(0.0, normal.normalize().dot(new Vector4f(0.1, 0.1, -1).normalize())) * 205 + 50), 255);
                let color = 255 << 24 | scalar << 16 | scalar << 8 | scalar;

                //let color = 255 << 24 | 255 << 16 | 150 << 8 | 255;

                vertexArray[0].position = v1;
                framebuffer.fakeSphere(n1, vertex1);

                vertexArray[1].position = v2;
                framebuffer.fakeSphere(n2, vertex2);

                vertexArray[2].position = v3;
                framebuffer.fakeSphere(n3, vertex3);

                if (v1.x < framebuffer.minWindow.x ||
                    v2.x < framebuffer.minWindow.x ||
                    v3.x < framebuffer.minWindow.x ||
                    v1.x > framebuffer.maxWindow.x ||
                    v2.x > framebuffer.maxWindow.x ||
                    v3.x > framebuffer.maxWindow.x ||
                    v1.y < framebuffer.minWindow.y ||
                    v2.y < framebuffer.minWindow.y ||
                    v3.y < framebuffer.minWindow.y ||
                    v1.y > framebuffer.maxWindow.y ||
                    v2.y > framebuffer.maxWindow.y ||
                    v3.y > framebuffer.maxWindow.y) {

                   framebuffer.texturedRenderingPipeline.clipConvexPolygon2(framebuffer, vertexArray);
                } else {
                framebuffer.texturedTriangleRasterizer.drawTriangleDDA(framebuffer,vertexArray[0], vertexArray[1], vertexArray[2]);
               }
            }
        }
    }


}