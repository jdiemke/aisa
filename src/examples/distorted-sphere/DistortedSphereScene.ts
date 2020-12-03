import { Framebuffer } from '../../Framebuffer';
import { Matrix4f, Vector4f, Vector3f } from '../../math';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { Vertex } from '../../Vertex';
import { TextureCoordinate } from '../../TextureCoordinate';
import { Color } from '../../core/Color';

/**
 * TODO: extract lens into effect class
 */
export class DistortedSphereScene extends AbstractScene {

    private heightmapSphere: Texture;

    private env: Texture;
    private obj: any;

    public init(framebuffer: Framebuffer): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('../../assets/heightmapSphere.png'), false).then(
                texture => this.heightmapSphere = texture
            ),
            TextureUtils.load(require('../../assets/envmap.png'), false).then(
                texture => this.env = texture
            ),
        ]).then(
            () => {
                this.obj = this.createSphereDistplaced(this.heightmapSphere);
            });
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();

        /*
        this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
        this.framebuffer.setCullFace(CullFace.BACK);
        // this.framebuffer.setBob(this.spheremap);
        this.framebuffer.setBob(this.envmap);
*/
        framebuffer.setTexture(this.env);
        const scale: number = 3.7;
        const elapsedTime: number = (time) * 0.002;

        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale)
            .multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.35)
                .multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.3)));

        modelViewMartrix = Matrix4f.constructTranslationMatrix(-0, -0,
            -10 - (Math.sin(elapsedTime * 0.3) * 0.5 + 0.5) * 6)
            .multiplyMatrix(modelViewMartrix);
        framebuffer.clearDepthBuffer();
        framebuffer.clearColorBuffer(Color.BLACK.toPackedFormat());
        this.shadingSphereEnvDisp2(framebuffer, time * 0.0002, modelViewMartrix);
    }


    public createSphere() {

        const pointsA: Array<Vector4f> = [
            new Vector4f(0.0, -1.0, 0.0),
            new Vector4f(1.0, 0.0, 0.0),
            new Vector4f(0.0, 0.0, 1.0),
            new Vector4f(-1.0, 0.0, 0.0),
            new Vector4f(0.0, 0.0, -1.0),
            new Vector4f(0.0, 1.0, 0.0)
        ];

        const indexA: Array<number> = [
            0, 1, 2,
            0, 2, 3,
            0, 3, 4,
            0, 4, 1,
            1, 5, 2,
            2, 5, 3,
            3, 5, 4,
            4, 5, 1
        ];

        const k = this.divideSphere(pointsA, indexA, 4);

        // optimize
        const points: Array<Vector4f> = [];
        const points2: Array<Vector4f> = [];
        const normals: Array<Vector4f> = [];
        const normals2: Array<Vector4f> = [];

        const index: Array<number> = [];

        k.index.forEach(i => {
            const p = k.points[i];

            const point = points.find(findPoint => findPoint.sub(p).length() < 0.001);

            if (point) {
                const idx = points.indexOf(point);
                index.push(idx);
            } else {
                index.push(points.push(p) - 1);
            }
        });

        points.forEach(p => {
            normals.push(new Vector4f(0, 0, 0));
            normals2.push(new Vector4f(0, 0, 0));
            points2.push(new Vector4f(0, 0, 0));
        })

        return {
            points,
            points2,
            normals,
            normals2,
            index
        }
    }

    public divideSphere(points: Array<Vector4f>, index: Array<number>, steps: number) {

        const points2: Array<Vector4f> = [];
        const normals2: Array<Vector4f> = [];
        const index2: Array<number> = [];

        let c = 0;
        for (let i = 0; i < index.length; i += 3) {
            const v1 = points[index[i]];
            const v2 = points[index[i + 1]];
            const v3 = points[index[i + 2]];

            const vn1 = v2.sub(v1).mul(0.5).add(v1).normalize();
            const vn2 = v3.sub(v2).mul(0.5).add(v2).normalize();
            const vn3 = v1.sub(v3).mul(0.5).add(v3).normalize();

            points2.push(v1); points2.push(vn1); points2.push(vn3);
            normals2.push(v1); normals2.push(vn1); normals2.push(vn3);
            index2.push(c++); index2.push(c++); index2.push(c++);

            points2.push(vn1); points2.push(v2); points2.push(vn2);
            normals2.push(vn1); normals2.push(v2); normals2.push(vn2);
            index2.push(c++); index2.push(c++); index2.push(c++);

            points2.push(vn1); points2.push(vn2); points2.push(vn3);
            normals2.push(vn1); normals2.push(vn2); normals2.push(vn3);
            index2.push(c++); index2.push(c++); index2.push(c++);

            points2.push(vn3); points2.push(vn2); points2.push(v3);
            normals2.push(vn3); normals2.push(vn2); normals2.push(v3);
            index2.push(c++); index2.push(c++); index2.push(c++);
        }

        if (steps > 0) {
            return this.divideSphere(points2, index2, --steps);
        } else {
            return {
                points: points2,
                normals: normals2,
                index: index2
            }
        }
    }


    public createSphereDistplaced(texture: Texture) {
        const sphere: {
            points: Array<Vector4f>,
            points2: Array<Vector4f>,
            normals: Array<Vector4f>,
            normals2: Array<Vector4f>,
            index: Array<number>
        } = this.createSphere();
        const newPoints: Array<Vector4f> = new Array<Vector4f>();
        sphere.points.forEach((point) => {
            const x = point.x;
            const y = point.y;
            const z = point.z;
            const radius = 1.0;
            const u = Math.floor((0.5 + Math.atan2(z, x) / (2 * Math.PI)) * 255);
            const v = Math.floor((0.5 - Math.asin(y) / Math.PI) * 255);
            const disp = 1 + 1.4 * ((texture.texture[u + v * 256] & 0xff) / 255);
            newPoints.push(point.mul(disp));
        });
        sphere.points = newPoints;
        return sphere;
    }

    public shadingSphereEnvDisp2(framebuffer: Framebuffer, elapsedTime: number, modelViewMartrix: Matrix4f): void {
        const result = this.obj;

        const scale2 = (Math.sin(elapsedTime * 1.8) + 1) * 0.5;
        for (let i = 0; i < result.points.length; i++) {
            const y = result.points[i].z;
            const x = result.points[i].x;
            const length = Math.sqrt(x * x + y * y);
            let rot = Math.sin(result.points[i].y * 0.539 + (10 - length) * 0.05 + elapsedTime * 0.9) * 4.5;
            rot *= Math.sin(elapsedTime * 0.25) * 0.5 + 0.5;
            result.points2[i].y = result.points[i].y;
            result.points2[i].x = result.points[i].x * Math.cos(rot) - result.points[i].z * Math.sin(rot);
            result.points2[i].z = result.points[i].x * Math.sin(rot) + result.points[i].z * Math.cos(rot);

            result.normals[i].x = 0;
            result.normals[i].y = 0;
            result.normals[i].z = 0;
        }

        const points = result.points2;
        const index = result.index;
        const normals = result.normals;

        const norm: Vector4f = new Vector4f(0, 0, 0);
        const norm2: Vector4f = new Vector4f(0, 0, 0);
        const cross: Vector4f = new Vector4f(0, 0, 0);
        for (let i = 0; i < index.length; i += 3) {
            const v1: Vector4f = points[index[i]];
            const v2: Vector4f = points[index[i + 1]];
            const v3: Vector4f = points[index[i + 2]];


            const normal = v2.sub(v1).cross(v3.sub(v1));
            normals[index[i]] = normals[index[i]].add(normal);
            normals[index[i + 1]] = normals[index[i + 1]].add(normal);
            normals[index[i + 2]] = normals[index[i + 2]].add(normal);
        }

        for (let i = 0; i < normals.length; i++) {
            normals[i] = normals[i].normalize();
        }

        const points2: Array<Vector4f> = result.points2;
        const normals2: Array<Vector4f> = result.normals2;

        const normalMatrix = modelViewMartrix.computeNormalMatrix();

        for (let n = 0; n < normals.length; n++) {
            normalMatrix.multiplyHomArr(normals[n], normals2[n]);
        }

        for (let p = 0; p < points.length; p++) {
            const transformed = modelViewMartrix.multiplyHom(points[p]);

            points2[p].x = Math.round((framebuffer.width * 0.5) + (transformed.x / (-transformed.z * 0.0078)));
            points2[p].y = Math.round((framebuffer.height * 0.5) - (transformed.y / (-transformed.z * 0.0078)));
            points2[p].z = transformed.z;
        }

        const vertex1 = new Vertex();
        vertex1.textureCoordinate = new TextureCoordinate();
        const vertex2 = new Vertex();
        vertex2.textureCoordinate = new TextureCoordinate();
        const vertex3 = new Vertex();
        vertex3.textureCoordinate = new TextureCoordinate();
        const vertexArray = new Array<Vertex>(vertex1, vertex2, vertex3);
        for (let i = 0; i < index.length; i += 3) {

            const v1 = points2[index[i]];
            const n1 = normals2[index[i]];

            const v2 = points2[index[i + 1]];
            const n2 = normals2[index[i + 1]];

            const v3 = points2[index[i + 2]];
            const n3 = normals2[index[i + 2]];

            if (framebuffer.isTriangleCCW(v1, v2, v3)) {

                const color = 255 << 24 | 255 << 16 | 255 << 8 | 255;

                vertexArray[0].position = v1;
                framebuffer.fakeSphere(n1, vertex1);

                vertexArray[1].position = v2;
                framebuffer.fakeSphere(n2, vertex2);

                vertexArray[2].position = v3;
                framebuffer.fakeSphere(n3, vertex3);

                if (v1.x < Framebuffer.minWindow.x ||
                    v2.x < Framebuffer.minWindow.x ||
                    v3.x < Framebuffer.minWindow.x ||
                    v1.x > Framebuffer.maxWindow.x ||
                    v2.x > Framebuffer.maxWindow.x ||
                    v3.x > Framebuffer.maxWindow.x ||
                    v1.y < Framebuffer.minWindow.y ||
                    v2.y < Framebuffer.minWindow.y ||
                    v3.y < Framebuffer.minWindow.y ||
                    v1.y > Framebuffer.maxWindow.y ||
                    v2.y > Framebuffer.maxWindow.y ||
                    v3.y > Framebuffer.maxWindow.y) {


                    framebuffer.texturedRenderingPipeline.clipConvexPolygon2(vertexArray);
                } else {
                    framebuffer.texturedTriangleRasterizer.drawTriangleDDA(vertexArray[0], vertexArray[1], vertexArray[2]);
                }
            }
        }
    }

}