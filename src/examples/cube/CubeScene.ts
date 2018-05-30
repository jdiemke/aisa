import { Canvas } from '../../Canvas';
import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Matrix3f, Vector3f } from '../../math';
import { TriangleRasterizer } from '../../rasterizer/TriangleRasterizer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';

/**
 * TODO: use cube mesh and draw using drawObject2
 */
export class CubeScene extends AbstractScene {

    private static BACKGROUND_COLOR: number = Color.BLACK.toPackedFormat();
    private triangleRasterizer: TriangleRasterizer;

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.setCullFace(CullFace.FRONT);
        this.triangleRasterizer = new TriangleRasterizer(framebuffer);
        return super.init(framebuffer);
    }

    public render(framebuffer: Framebuffer): void {
        framebuffer.clearColorBuffer(CubeScene.BACKGROUND_COLOR);
        this.shadingDemo(framebuffer, Date.now() * 0.02);
    }

        /**
     * Full Pipeline:
     * https://www.ntu.edu.sg/home/ehchua/programming/opengl/CG_BasicsTheory.html
     * http://www.songho.ca/index.html
     * https://en.wikipedia.org/wiki/Graphics_pipeline
     * https://en.wikipedia.org/wiki/Clipping_(computer_graphics)
     * https://www.ntu.edu.sg/home/ehchua/programming/opengl/CG_BasicsTheory.html
     * http://www.gamasutra.com/blogs/MichaelKissner/20160112/263097/Writing_a_Game_Engine_from_Scratch__Part_4_Graphics_Library.php
     * culling:
     * https://developer.tizen.org/development/guides/native-application/graphics/opengl-es/primitive-assembly-and-rasterization
     * assumption:
     * By default, vertices of every 3D triangle are in a counter-clockwise (CCW) order
     */
    public shadingDemo(framebuffer: Framebuffer, elapsedTime: number): void {

        framebuffer.wBuffer.fill(100);

        let index: Array<number> = [
            1, 2, 3, 4, 1, 3,
            5, 7, 6, 8, 7, 5,

            2, 6, 7, 7, 3, 2,
            5, 1, 4, 4, 8, 5,

            4, 3, 7, 7, 8, 4,
            1, 6, 2, 5, 6, 1
        ];

        let points: Array<Vector3f> = [
            new Vector3f(-1.0, -1.0, 1.0), new Vector3f(1.0, -1.0, 1.0),
            new Vector3f(1.0, 1.0, 1.0), new Vector3f(-1.0, 1.0, 1.0),
            new Vector3f(-1.0, -1.0, -1.0), new Vector3f(1.0, -1.0, -1.0),
            new Vector3f(1.0, 1.0, -1.0), new Vector3f(-1.0, 1.0, -1.0),
        ];

        // compute normals
        let normals: Array<Vector3f> = new Array<Vector3f>();

        for (let i = 0; i < index.length; i += 3) {
            let normal = points[index[i + 1] - 1].sub(points[index[i] - 1]).cross(points[index[i + 2] - 1].sub(points[index[i] - 1]));
            normals.push(normal);
        }


        let colorAr: Array<number> = [
            255 << 24 | 255 << 0,
            255 << 24 | 255 << 8,
            255 << 24 | 255 << 16,
            255 << 24 | 255 << 16 | 255,
            255 << 24 | 255 << 16 | 255 << 8,
            255 << 24 | 255 << 8 | 128,
        ];

        let scale = 3.2;

        let modelViewMartrix = Matrix3f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix3f.constructYRotationMatrix(elapsedTime * 0.05));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix3f.constructXRotationMatrix(elapsedTime * 0.08));

        /**
         * Vertex Shader Stage:
         * 1. Local Space -> World Space -> Eye Space -> Clip Space -> NDC Space -> Screen Space
         * 2. Computes Lighting per Vertex
         */
        let points2: Array<Vector3f> = new Array<Vector3f>();

        let normals2: Array<Vector3f> = new Array<Vector3f>();
        normals.forEach(element => {
            normals2.push(modelViewMartrix.multiply(element));
        });

        points.forEach(element => {
            let transformed = modelViewMartrix.multiply(element);

            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z - 9; // TODO: use translation matrix!

            let xx = (320 * 0.5) + (x / (-z * 0.0078));
            let yy = (200 * 0.5) + (y / (-z * 0.0078));
            // commented out because it breaks the winding. inversion
            // of y has to be done after back-face culling in the
            // viewport transform
            // yy =(200 * 0.5) - (y / (-z * 0.0078));

            points2.push(new Vector3f(Math.round(xx), Math.round(yy), z));
        });

        /**
         * Primitive Assembly and Rasterization Stage:
         * 1. back-face culling
         * 2. viewport transform
         * 3. scan conversion (rasterization)
         */
        for (let i = 0; i < index.length; i += 3) {
            /**
             * Only render triangles with CCW-ordered vertices
             * 
             * Reference:
             * David H. Eberly (2006).
             * 3D Game Engine Design: A Practical Approach to Real-Time Computer Graphics,
             * p. 69. Morgan Kaufmann Publishers, United States.
             */
            let v1 = points2[index[i] - 1];
            let v2 = points2[index[i + 1] - 1];
            let v3 = points2[index[i + 2] - 1];

            if (framebuffer.isTriangleCCW(v1, v2, v3)) {
                let normal = normals2[i / 3];

                let light = new Vector3f(0.5, 0.5, 0.5);
                let ambient = new Vector3f(50, 100, 50);
                let diffuse = new Vector3f(90, 90, 90).mul(Math.max(0.0, normal.normalize().dot(light.normalize())));
                let reflection = new Vector3f(0, 0, 1).sub(light.mul(-1).normalize());
                // http://www.lighthouse3d.com/tutorials/glsl-tutorial/directional-lights-per-vertex-ii/
                let specular = new Vector3f(0, 0, 0);
                let phong: Vector3f = ambient.add(diffuse).add(specular);
                let color = 255 << 24 | (phong.z & 0xff) << 16 | (phong.y & 0xff) << 8 | (phong.x & 0xff);
                this.triangleRasterizer.drawTriangleDDA(v1, v2, v3, color);
            }
        }
    }

}
