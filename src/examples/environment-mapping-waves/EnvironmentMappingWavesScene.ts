import { Framebuffer } from '../../Framebuffer';
import { Matrix4f, Vector4f } from '../../math';
import { ComputationalGeometryUtils } from '../../math/Geometry';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { Vertex } from '../../Vertex';
import { TextureCoordinate } from '../../TextureCoordinate';
import { CullFace } from '../../CullFace';
import { TexturingRenderingPipeline } from '../../rendering-pipelines/TexturingRenderingPipeline';

interface IndexMesh {
    vertices: Array<Vector4f>,
    deformedVertices: Array<Vector4f>,
    transformedVertices: Array<Vector4f>,
    normals: Array<Vector4f>,
    normals2: Array<Vector4f>,
    index: Array<number>
}

export class EnvironmentMappingScene extends AbstractScene {

    private blurred: Texture;

    private env: Texture;
    private obj: IndexMesh;
    private texturedRenderingPipeline: TexturingRenderingPipeline;
    private plane: {
        vertices: Vector4f[];
        deformedVertices: Vector4f[];
        transformedVertices: Array<Vector4f>;
        normals: Vector4f[];
        normals2: Vector4f[];
        index:Array<number>;
    };


    public init(framebuffer: Framebuffer): Promise<any> {
        this.texturedRenderingPipeline = new TexturingRenderingPipeline(framebuffer);
        return Promise.all([

            TextureUtils.load(require('@assets/flood.png'), false).then(
                texture => this.blurred = texture
            ),
            TextureUtils.load(require('@assets/envmap.png'), false).then(
                texture => {
                    this.env = texture;
                   // this.env.setClamp(true)
                   // this.env.colorize(0.8,0.8,1)
                }
            ),
        ]).then(() => this.plane = this.createPlane());
    }

    public render(framebuffer: Framebuffer, time: number): void {
        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);

        //framebuffer.texturedRenderingPipeline.setAlpha(Math.abs(Math.sin(Date.now()*0.00012)));
        framebuffer.setCullFace(CullFace.BACK);
        framebuffer.setTexture(this.env);
        this.shadingPlaneEnv(framebuffer, time * 0.001, this.plane);
    }

    public shadingPlaneEnv(framebuffer: Framebuffer, elapsedTime: number, plane: IndexMesh): void {

        framebuffer.wBuffer.fill(100);


        const result = plane;

        const elapsedTime2 = elapsedTime *1.2;

        for (let i = 0; i < result.vertices.length; i++) {
            const y = result.vertices[i].y - 30;
            const x = result.vertices[i].x - 50;
            const length = Math.sqrt(x * x + y * y);
            result.deformedVertices[i].y = result.vertices[i].y;
            result.deformedVertices[i].x = result.vertices[i].x;
            result.deformedVertices[i].z = result.vertices[i].z + (
                Math.sin(result.vertices[i].y * 0.08 + elapsedTime2 * 2.83) * 5.6
                + Math.sin(result.vertices[i].x * 0.1 + elapsedTime2 * 2.83) * 5.9)
                + Math.sin(length * 0.4 - elapsedTime2 * 3.83) * 3.3 * 0.56;

            result.normals[i].x = 0;
            result.normals[i].y = 0;
            result.normals[i].z = 0;
        }
        elapsedTime *= 1;

        const points = result.deformedVertices;
        const index = result.index;
        const normals = result.normals;

        const norm: Vector4f = new Vector4f(0, 0, 0);
        const norm2: Vector4f = new Vector4f(0, 0, 0);
        const cross: Vector4f = new Vector4f(0, 0, 0);
        for (let i = 0; i < index.length; i += 3) {
            const v1: Vector4f = points[index[i]];
            const v2: Vector4f = points[index[i + 1]];
            const v3: Vector4f = points[index[i + 2]];
            norm.sub2(v2, v1);
            norm2.sub2(v3, v1);
            cross.cross2(norm, norm2);
            const normal = cross;
            normals[index[i]].add2(normals[index[i]], normal);
            normals[index[i + 1]].add2(normals[index[i + 1]], normal);
            normals[index[i + 2]].add2(normals[index[i + 2]], normal);
        }

        // FIXME: speed up
        // - remove normalie from lighting
        // - remove normalize after normal transformation!
        // - precreate array for transformed vertices and normals

        for (let i = 0; i < normals.length; i++) {
            normals[i].normalize2();
        }

        const scale = 3.7;

        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(Math.PI + Math.sin(elapsedTime * 3.75) * 0.25)
            .multiplyMatrix(Matrix4f.constructXRotationMatrix(Math.PI / 5 + Math.sin(elapsedTime * 1.25) * 0.35).multiplyMatrix(Matrix4f.constructTranslationMatrix(-50, -25
                , 0))));

        modelViewMartrix = Matrix4f.constructTranslationMatrix(0, 0,
            -310 + Math.sin(elapsedTime * 1.9) * 0)
            .multiplyMatrix(modelViewMartrix);

        const projectedPoints: Array<Vector4f> = result.deformedVertices;
        const transformedPoints: Array<Vector4f> = result.transformedVertices;
        const normals2: Array<Vector4f> = result.normals2;

        const normalMatrix = modelViewMartrix.computeNormalMatrix();

        // TODO: merge normal and point into one loop!!!
        for (let n = 0; n < normals.length; n++) {
            normalMatrix.multiplyHomArr(normals[n], normals2[n]);
        }

        for (let p = 0; p < points.length; p++) {
            modelViewMartrix.multiplyHomArr2(points[p], transformedPoints[p]);
            const transformed = transformedPoints[p];

            projectedPoints[p].x = Math.round((framebuffer.width * 0.5) + (transformed.x / (-transformed.z * 0.0038)));
            projectedPoints[p].y = Math.round((framebuffer.height * 0.5) - (transformed.y / (-transformed.z * 0.0038)));
            projectedPoints[p].z = transformed.z;
        }

        const vertex1 = new Vertex();
        vertex1.textureCoordinate = new TextureCoordinate();
        const vertex2 = new Vertex();
        vertex2.textureCoordinate = new TextureCoordinate();
        const vertex3 = new Vertex();
        vertex3.textureCoordinate = new TextureCoordinate();
        const vertexArray = new Array<Vertex>(vertex1, vertex2, vertex3);
        for (let i = 0; i < index.length; i += 3) {

            // Only render triangles with CCW-ordered vertices
            //
            // Reference:
            // David H. Eberly (this.height6).
            // 3D Game Engine Design: A Practical Approach to Real-Time Computer Graphics,
            // p. 69. Morgan Kaufmann Publishers, United States.
            //
            const v1 = projectedPoints[index[i]];
            const e1 = transformedPoints[index[i]];
            const n1 = normals2[index[i]];

            const v2 = projectedPoints[index[i + 1]];
            const e2 = transformedPoints[index[i + 1]];
            const n2 = normals2[index[i + 1]];

            const v3 = projectedPoints[index[i + 2]];
            const e3 = transformedPoints[index[i + 2]];
            const n3 = normals2[index[i + 2]];

            if (framebuffer.isTriangleCCW(v1, v2, v3)) {

                // const color = 255 << 24 | 255 << 16 | 255 << 8 | 255;

                // TODO: precompute texture coordinate only once for each vertex instead of multiple times per triangle!!!
                vertexArray[0].projection = v1;
                const reflection1 = ComputationalGeometryUtils.reflectionVector(n1, e1);
                const uv1 = ComputationalGeometryUtils.sphereMapCoords(reflection1);
                vertex1.textureCoordinate.u = uv1.u;
                vertex1.textureCoordinate.v = uv1.v;

                vertexArray[1].projection = v2;
                const reflection2 = ComputationalGeometryUtils.reflectionVector(n2, e2);
                const uv2 = ComputationalGeometryUtils.sphereMapCoords(reflection2);
                vertex2.textureCoordinate.u = uv2.u;
                vertex2.textureCoordinate.v = uv2.v;

                vertexArray[2].projection = v3;
                const reflection3 = ComputationalGeometryUtils.reflectionVector(n3, e3);
                const uv3 = ComputationalGeometryUtils.sphereMapCoords(reflection3);
                vertex3.textureCoordinate.u = uv3.u;
                vertex3.textureCoordinate.v = uv3.v;
/*
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

                    this.clipConvexPolygon2(vertexArray, color);
                } else {*/
                framebuffer.texturedTriangleRasterizer.drawTriangleDDA(framebuffer, vertexArray[0], vertexArray[1], vertexArray[2]);
               // }
            }
        }
    }



    public createPlane() {

        const k = {
            points: []
        };
        for (let y = 0; y < 60; y++) {
            for (let x = 0; x < 100; x++) {
                k.points.push(new Vector4f(0 + x, 0 + y, 0));
                k.points.push(new Vector4f(0 + x, 1 + y, 0));
                k.points.push(new Vector4f(1 + x, 0 + y, 0));

                k.points.push(new Vector4f(1 + x, 0 + y, 0));
                k.points.push(new Vector4f(0 + x, 1 + y, 0));
                k.points.push(new Vector4f(1 + x, 1 + y, 0));
            }
        }
        // optimize
        const vertices: Array<Vector4f> = [];
        const deformedVertices: Array<Vector4f> = [];
        const transformedVertices: Array<Vector4f>  = [];
        const normals: Array<Vector4f> = [];
        const normals2: Array<Vector4f> = [];

        const index: Array<number> = [];

        k.points.forEach((i) => {
            const p = i;

            const point = vertices.find((pointVar) => pointVar.sub(p).length() < 0.001);

            if (point) {
                const idx = vertices.indexOf(point);
                index.push(idx);
            } else {
                index.push(vertices.push(p) - 1);
            }
        });

        vertices.forEach(() => {
            normals.push(new Vector4f(0, 0, 0));
            normals2.push(new Vector4f(0, 0, 0));
            deformedVertices.push(new Vector4f(0, 0, 0));
            transformedVertices.push(new Vector4f(0, 0, 0));
        });

        return {
            vertices,
            deformedVertices,
            transformedVertices,
            normals,
            normals2,
            index
        };
    }

}
