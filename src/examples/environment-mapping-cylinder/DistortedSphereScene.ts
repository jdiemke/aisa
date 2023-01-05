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

    private blurred: Texture;
    private noise: Texture;
    private heightmap: Texture;
    private accumulationBuffer: Uint32Array;
    private env: Texture;
    private obj: IndexMesh;
    private texturedRenderingPipeline: TexturingRenderingPipeline;
    private plane: {
        points: Vector4f[];
        points2: Vector4f[];
        normals: Vector4f[];
        normals2: Vector4f[];
        index:Array<number>;
    };


    public init(framebuffer: Framebuffer): Promise<any> {
        this.accumulationBuffer = new Uint32Array(framebuffer.width * framebuffer.height);
        this.texturedRenderingPipeline = new TexturingRenderingPipeline(framebuffer);
        return Promise.all([
            TextureUtils.load(require('../../assets/flood.png'), false).then(
                texture => this.blurred = texture
            ),
            TextureUtils.load(require('../../assets/envmap.png'), false).then(
                texture => this.env = texture
            ),
            TextureUtils.load(require('../../assets/heightmap.png'), false).then(texture => this.heightmap = texture),,
            TextureUtils.generateProceduralNoise().then(texture => this.noise = texture),
        ]).then(() => this.plane = this.createCylinder2(this.heightmap));
    }

    public render(framebuffer: Framebuffer, time: number): void {
        framebuffer.setCullFace(CullFace.FRONT);
        framebuffer.setTexture(this.env);
        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);
        this.shadingCylinderEnvDisp(framebuffer, time*0.002, this.plane);
       

        const texture3: Texture = new Texture(this.accumulationBuffer, framebuffer.width, framebuffer.height);
        framebuffer.drawTexture(0, 0, texture3, 0.75);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);
        framebuffer.noise(time, this.noise);
    }


   
    public shadingCylinderEnvDisp(framebuffer: Framebuffer, elapsedTime: number, cylinder: IndexMesh): void {

        framebuffer.wBuffer.fill(100);

        let result = cylinder;

        let scale2 = (Math.sin(elapsedTime * 1.8) + 1) * 0.5;
        for (let i = 0; i < result.points.length; i++) {
            let y = result.points[i].z;
            let x = result.points[i].x;
            let length = Math.sqrt(x * x + y * y);
            let rot = Math.sin(result.points[i].y * 0.039 + (10 - length) * 0.02 + elapsedTime * 0.6) * 4;
            result.points2[i].y = result.points[i].y;
            result.points2[i].x = result.points[i].x * Math.cos(rot) - result.points[i].z * Math.sin(rot);
            result.points2[i].z = result.points[i].x * Math.sin(rot) + result.points[i].z * Math.cos(rot);

            result.normals[i].x = 0;
            result.normals[i].y = 0;
            result.normals[i].z = 0;
        }

        let points = result.points2;
        let index = result.index;
        let normals = result.normals;

        let norm: Vector4f = new Vector4f(0, 0, 0);
        let norm2: Vector4f = new Vector4f(0, 0, 0);
        let cross: Vector4f = new Vector4f(0, 0, 0);
        for (let i = 0; i < index.length; i += 3) {
            let v1: Vector4f = points[index[i]];
            let v2: Vector4f = points[index[i + 1]];
            let v3: Vector4f = points[index[i + 2]];
            norm.sub2(v2, v1);
            norm2.sub2(v3, v1);
            cross.cross2(norm, norm2);
            let normal = cross;
            normals[index[i]].add2(normals[index[i]], normal);
            normals[index[i + 1]].add2(normals[index[i + 1]], normal);
            normals[index[i + 2]].add2(normals[index[i + 2]], normal);
        }

        for (let i = 0; i < normals.length; i++) {
            normals[i].normalize2();
        }

        let scale = 3.7;

        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(0)
            .multiplyMatrix(Matrix4f.constructXRotationMatrix(0.2 * Math.sin(elapsedTime * 1.2)).multiplyMatrix(Matrix4f.constructTranslationMatrix(0, 0
                , 0))));

        modelViewMartrix = Matrix4f.constructTranslationMatrix(-0, -210,
            -290)
            .multiplyMatrix(modelViewMartrix);

        let points2: Array<Vector4f> = result.points2;
        let normals2: Array<Vector4f> = result.normals2;

        let normalMatrix = modelViewMartrix.computeNormalMatrix();

        for (let n = 0; n < normals.length; n++) {
            normalMatrix.multiplyHomArr(normals[n], normals2[n]);
        }

        for (let p = 0; p < points.length; p++) {
            let transformed = modelViewMartrix.multiplyHom(points[p]);

            points2[p].x = Math.round((framebuffer.width * 0.5) + (transformed.x / (-transformed.z * 0.0078)));
            points2[p].y = Math.round((framebuffer.height * 0.5) - (transformed.y / (-transformed.z * 0.0078)));
            points2[p].z = transformed.z;
        }

        let vertex1 = new Vertex();
        vertex1.textureCoordinate = new TextureCoordinate();
        let vertex2 = new Vertex();
        vertex2.textureCoordinate = new TextureCoordinate();
        let vertex3 = new Vertex();
        vertex3.textureCoordinate = new TextureCoordinate();
        let vertexArray = new Array<Vertex>(vertex1, vertex2, vertex3);
        for (let i = 0; i < index.length; i += 3) {

            let v1 = points2[index[i]];
            let n1 = normals2[index[i]];

            let v2 = points2[index[i + 1]];
            let n2 = normals2[index[i + 1]];

            let v3 = points2[index[i + 2]];
            let n3 = normals2[index[i + 2]];

            if (framebuffer.isTriangleCCW(v1, v2, v3)) {

                let color = 255 << 24 | 255 << 16 | 255 << 8 | 255;

                vertexArray[0].projection = v1;
                framebuffer.fakeSphere(n1, vertex1);

                vertexArray[1].projection = v2;
                framebuffer.fakeSphere(n2, vertex2);

                vertexArray[2].projection = v3;
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
                        this.texturedRenderingPipeline.clipConvexPolygon2(framebuffer, vertexArray);
                   // this.clipConvexPolygon2(vertexArray, color);
                } else {
                    framebuffer.texturedTriangleRasterizer.drawTriangleDDA(framebuffer, vertexArray[0], vertexArray[1], vertexArray[2]);
            }
            }
        }
    }

    public createCylinder2(texture: Texture) {
        const k = {
            points: []
        };

        const LOOPX = 50;
        const LOOPY = 110;
        for (let y = 0; y < LOOPY; y++) {
            for (let x = 0; x < LOOPX; x++) {
                const xpos = (x / LOOPX * 256) & 0xff;
                const xpos2 = ((x + 1) / LOOPX * 256) & 0xff;
                const ypos = (y * 0.9 / LOOPY * 256) & 0xff;
                const ypos2 = ((y + 1) * 0.9 / LOOPY * 256) & 0xff;

                const x0y0 = 1 + 0.9 * ((texture.texture[xpos + ypos * 256] & 0xff) / 255);
                const x1y0 = 1 + 0.9 * ((texture.texture[xpos2 + ypos * 256] & 0xff) / 255);
                const x0y1 = 1 + 0.9 * ((texture.texture[xpos + ypos2 * 256] & 0xff) / 255);
                const x1y1 = 1 + 0.9 * ((texture.texture[xpos2 + ypos2 * 256] & 0xff) / 255);

                const x0 = Math.sin(2 * Math.PI / LOOPX * x) * 30;
                const z0 = Math.cos(2 * Math.PI / LOOPX * x) * 30;

                const x1 = Math.sin(2 * Math.PI / LOOPX * (x + 1)) * 30;
                const z1 = Math.cos(2 * Math.PI / LOOPX * (x + 1)) * 30;

                k.points.push(new Vector4f(x0 * x0y0, 0 + y, z0 * x0y0));
                k.points.push(new Vector4f(x0 * x0y1, 1 + y, z0 * x0y1));
                k.points.push(new Vector4f(x1 * x1y0, 0 + y, z1 * x1y0));

                k.points.push(new Vector4f(x1 * x1y0, 0 + y, z1 * x1y0));
                k.points.push(new Vector4f(x0 * x0y1, 1 + y, z0 * x0y1));
                k.points.push(new Vector4f(x1 * x1y1, 1 + y, z1 * x1y1));
            }
        }
        // optimize
        const points: Array<Vector4f> = [];
        const points2: Array<Vector4f> = [];
        const normals: Array<Vector4f> = [];
        const normals2: Array<Vector4f> = [];

        const index: Array<number> = [];

        k.points.forEach((i) => {
            const p = i;

            const point = points.find((pointVar) => pointVar.sub(p).length() < 0.001);

            if (point) {
                const idx = points.indexOf(point);
                index.push(idx);
            } else {
                index.push(points.push(p) - 1);
            }
        });

        points.forEach(() => {
            normals.push(new Vector4f(0, 0, 0));
            normals2.push(new Vector4f(0, 0, 0));
            points2.push(new Vector4f(0, 0, 0));
        });

        return {
            points,
            points2,
            normals,
            normals2,
            index
        };
    }


}
