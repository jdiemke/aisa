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
export class FloodFillScene extends AbstractScene {

    private heightmapSphere: Texture;

    private env: Texture;
    private obj: any;

    public init(framebuffer: Framebuffer): Promise<any> {
        console.log('hello');

        return Promise.all([
           TextureUtils.load(require('../../assets/heightmapSphere.png'), false).then(
                texture => this.heightmapSphere = texture
           ),
           TextureUtils.load(require('../../assets/envmap.png'), false).then(
            texture => this.env = texture
       ),
        ]);
    }

    onInit() {
        this.obj = this.createSphereDistplaced(this.heightmapSphere);
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
        let scale: number = 3.7;
        let elapsedTime: number = (time ) * 0.002;

        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale)
            .multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.35)
                .multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.3)));

        modelViewMartrix = Matrix4f.constructTranslationMatrix(-0, -0,
            -10 - (Math.sin(elapsedTime * 0.3) * 0.5 + 0.5) * 6)
            .multiplyMatrix(modelViewMartrix);
        framebuffer.clearDepthBuffer();
        framebuffer.clearColorBuffer(Color.BLACK.toPackedFormat());
        this.shadingSphereEnvDisp2(framebuffer, time * 0.0002, modelViewMartrix);
        /*
                // Motion Blur
                const tmpGlitch: Uint32Array = new Uint32Array(320 * 200);
                this.framebuffer.fastFramebufferCopy(tmpGlitch, this.framebuffer.framebuffer);

                const texture: Texture = new Texture();
                texture.texture = tmpGlitch;
                texture.width = 320;
                texture.height = 200;

                const ukBasslineBpm: number = 140;
                const ukBasslineClapMs: number = 60000 / ukBasslineBpm * 2;
                const smashTime: number = (Date.now() - this.start) % ukBasslineClapMs;
                const smash: number = (this.framebuffer.cosineInterpolate(0, 20, smashTime) -
                    this.framebuffer.cosineInterpolate(20, 300, smashTime)) * 35;
                const width: number = Math.round(320 + smash * 320 / 100);
                const height: number = Math.round(200 + smash * 200 / 100);

                this.framebuffer.drawScaledTextureClipBi(
                    Math.round(320 / 2 - width / 2),
                    Math.round(200 / 2 - height / 2),
                    width, height, texture, 1.0);

                const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
                this.framebuffer.drawTexture(0, 0, texture3, 0.85);
                this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);

                this.framebuffer.noise(time, this.noise);
                */
    }


    public createSphere() {

        let pointsA: Array<Vector4f> = [
            new Vector4f(0.0, -1.0, 0.0),
            new Vector4f(1.0, 0.0, 0.0),
            new Vector4f(0.0, 0.0, 1.0),
            new Vector4f(-1.0, 0.0, 0.0),
            new Vector4f(0.0, 0.0, -1.0),
            new Vector4f(0.0, 1.0, 0.0)
        ];

        let indexA: Array<number> = [
            0, 1, 2,
            0, 2, 3,
            0, 3, 4,
            0, 4, 1,
            1, 5, 2,
            2, 5, 3,
            3, 5, 4,
            4, 5, 1
        ];

        let k = this.divideSphere(pointsA, indexA, 4);

        // optimize
        let points: Array<Vector4f> = [];
        let points2: Array<Vector4f> = [];
        let normals: Array<Vector4f> = [];
        let normals2: Array<Vector4f> = [];

        let index: Array<number> = [];

        k.index.forEach(i => {
            let p = k.points[i];

            let point = points.find(point => point.sub(p).length() < 0.001);

            if (point) {
                let idx = points.indexOf(point);
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

        let points2: Array<Vector4f> = [];
        let normals2: Array<Vector4f> = [];
        let index2: Array<number> = [];

        let c = 0;
        for (let i = 0; i < index.length; i += 3) {
            let v1 = points[index[i]];
            let v2 = points[index[i + 1]];
            let v3 = points[index[i + 2]];

            let vn1 = v2.sub(v1).mul(0.5).add(v1).normalize();
            let vn2 = v3.sub(v2).mul(0.5).add(v2).normalize();
            let vn3 = v1.sub(v3).mul(0.5).add(v3).normalize();

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
        let sphere: {
            points: Array<Vector4f>,
            points2: Array<Vector4f>,
            normals: Array<Vector4f>,
            normals2: Array<Vector4f>,
            index: Array<number>
        } = this.createSphere();
        let newPoints: Array<Vector4f> = new Array<Vector4f>();
        sphere.points.forEach((point) => {
            let x = point.x;
            let y = point.y;
            let z = point.z;
            const radius = 1.0;
            let u = Math.floor((0.5 + Math.atan2(z, x) / (2 * Math.PI)) * 255);
            let v = Math.floor((0.5 - Math.asin(y) / Math.PI) * 255);
            let disp = 1 + 1.4 * ((texture.texture[u + v * 256] & 0xff) / 255);
            newPoints.push(point.mul(disp));
        });
        sphere.points = newPoints;
        return sphere;
    }

    public shadingSphereEnvDisp2(framebuffer: Framebuffer, elapsedTime: number, modelViewMartrix: Matrix4f): void {
        let result = this.obj;

        let scale2 = (Math.sin(elapsedTime * 1.8) + 1) * 0.5;
        for (let i = 0; i < result.points.length; i++) {
            let y = result.points[i].z;
            let x = result.points[i].x;
            let length = Math.sqrt(x * x + y * y);
            let rot = Math.sin(result.points[i].y * 0.539 + (10 - length) * 0.05 + elapsedTime * 0.9) * 4.5;
            rot *= Math.sin(elapsedTime * 0.25) * 0.5 + 0.5;
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


            let normal = v2.sub(v1).cross(v3.sub(v1));
            normals[index[i]] = normals[index[i]].add(normal);
            normals[index[i + 1]] = normals[index[i + 1]].add(normal);
            normals[index[i + 2]] = normals[index[i + 2]].add(normal);
        }

        for (let i = 0; i < normals.length; i++) {
            normals[i] = normals[i].normalize();
        }

        let points2: Array<Vector4f> = result.points2;
        let normals2: Array<Vector4f> = result.normals2;

        let normalMatrix = modelViewMartrix.computeNormalMatrix();

        for (let n = 0; n < normals.length; n++) {
            normalMatrix.multiplyHomArr(normals[n], normals2[n]);
        }

        for (let p = 0; p < points.length; p++) {
            let transformed = modelViewMartrix.multiplyHom(points[p]);

            points2[p].x = Math.round((320 * 0.5) + (transformed.x / (-transformed.z * 0.0078)));
            points2[p].y = Math.round((200 * 0.5) - (transformed.y / (-transformed.z * 0.0078)));
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
