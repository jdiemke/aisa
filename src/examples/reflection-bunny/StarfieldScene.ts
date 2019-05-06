import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Matrix3f, Matrix4f, Vector3f } from '../../math';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { TextureCoordinate } from '../../TextureCoordinate';
import { Vertex } from '../../Vertex';

let bunnyJson = require('./../../assets/bunny.json') as any;

/**
 * TODO: extract lens into effect class
 */
export class StarfieldScene extends AbstractScene {

    private spheremap: Texture;
    private texture7: Texture;
    private bunnyObj: any;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.bunnyObj = this.createBunny();
        return Promise.all([
            TextureUtils.load(require('../../assets/spheremap.png'), false).then(
                texture => this.spheremap = texture
            ),
            TextureUtils.load(require('../../assets/ball2.png'), true).then(
                texture => this.texture7 = texture
            ),
        ]);
    }


    public createBunny(): any {
        let points: Array<Vector3f> = new Array<Vector3f>();

        bunnyJson.vertices.forEach(x => {
            points.push(new Vector3f(x.x, x.y, x.z));
        });

        let normals: Array<Vector3f> = new Array<Vector3f>();

        bunnyJson.normals.forEach(x => {
            normals.push(new Vector3f(x.x, x.y, x.z).normalize());
        });

        let index: Array<number> = bunnyJson.faces;

        let points2: Array<Vector3f> = new Array<Vector3f>();
        let normals2: Array<Vector3f> = new Array<Vector3f>();

        for (let i = 0; i < points.length; i++) {
            points2.push(new Vector3f(0, 0, 0));
        }

        for (let i = 0; i < normals.length; i++) {
            normals2.push(new Vector3f(0, 0, 0));
        }

        let object = {
            index: index,
            points: points,
            normals: normals,
            points2: points2,
            normals2: normals2
        };

        return object;
    }


    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();
        framebuffer.clearColorBuffer(Color.BLACK.toPackedFormat());
        framebuffer.setTexture(this.spheremap);
        framebuffer.setCullFace(CullFace.BACK);
        this.reflectionBunny(framebuffer, time * 0.002);
        this.scene7(framebuffer, time * 0.2, this.texture7);
    }

        /**
     * this rountine is pretty slow:
     * - optimize scaled blittinh
     * - optimize geometry stage by reusing arrays
     * - dont us forEach!
     */
    public scene7(framebuffer: Framebuffer, elapsedTime: number, texture: Texture): void {
        let points: Array<Vector3f> = new Array<Vector3f>();

        for (let i = 0; i < 120; i++) {
            points.push(new Vector3f(Math.sin(i * 0.25) * 8, i * 0.3 - 18, Math.cos(i * 0.25) * 8));
        }

        points.push(new Vector3f(0, 0, 5));

        let rotMat = Matrix3f.constructYRotationMatrix(elapsedTime * 0.0005);
        rotMat = rotMat.multiplyMatrix(Matrix3f.constructXRotationMatrix(elapsedTime * 0.0002));

        let points2: Array<Vector3f> = new Array<Vector3f>(points.length);
        points.forEach(element => {
            let alpha = -elapsedTime * 0.0013;

            let transformed = rotMat.multiply(element);

            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z - 10;
            let xx = 320 / 2 + (x / (z * 0.0058));
            let yy = 200 / 2 + (y / (z * 0.0058));
            points2.push(new Vector3f(xx, yy, z));
        });

        points2.sort(function (a, b) {
            return a.z - b.z;
        });

        points2.forEach(element => {
            let size = -(1.9 / (element.z * 0.0058)) | 0;
            framebuffer.drawSoftParticle((element.x - size / 2) | 0, (element.y - size / 2) | 0, size, size, texture, 1 / element.z, 1.0);
        });
    }


    public reflectionBunny(framebuffer: Framebuffer, elapsedTime: number): void {
        framebuffer.clearDepthBuffer();

        let obj = this.bunnyObj;

        let scale = 64.1;
        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.30));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.3));
        modelViewMartrix = Matrix4f.constructTranslationMatrix(0, 0, -8).multiplyMatrix(modelViewMartrix);

        let normalMatrix = modelViewMartrix.computeNormalMatrix();

        for (let n = 0; n < obj.normals.length; n++) {
            normalMatrix.multiplyArr(obj.normals[n], obj.normals2[n]);
        }

        for (let p = 0; p < obj.points.length; p++) {
            let transformed = modelViewMartrix.multiply(obj.points[p]);

            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z; // TODO: use translation matrix!

            let xx = (320 * 0.5) + (x / (-z * 0.0078));
            let yy = (200 * 0.5) - (y / (-z * 0.0078));

            obj.points2[p].x = Math.round(xx);
            obj.points2[p].y = Math.round(yy);
            obj.points2[p].z = z;
        }

        let vertex1 = new Vertex();
        vertex1.textureCoordinate = new TextureCoordinate();
        let vertex2 = new Vertex();
        vertex2.textureCoordinate = new TextureCoordinate();
        let vertex3 = new Vertex();
        vertex3.textureCoordinate = new TextureCoordinate();
        let vertexArray = new Array<Vertex>(vertex1, vertex2, vertex3);

        for (let i = 0; i < obj.index.length; i += 6) {
            let v1 = obj.points2[obj.index[i]];
            let v2 = obj.points2[obj.index[i + 1]];
            let v3 = obj.points2[obj.index[i + 2]];

            if (framebuffer.isTriangleCCW(v1, v2, v3)) {
                vertexArray[0].position = v1;
                framebuffer.fakeSphere(obj.normals2[obj.index[i + 3]], vertex1);

                vertexArray[1].position = v2;
                framebuffer.fakeSphere(obj.normals2[obj.index[i + 4]], vertex2);

                vertexArray[2].position = v3;
                framebuffer.fakeSphere(obj.normals2[obj.index[i + 5]], vertex3);

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
                    framebuffer.texturedTriangleRasterizer.drawTriangleDDA(
                        vertexArray[0], vertexArray[1], vertexArray[2]
                    );
                }
            }
        }
    }

}
