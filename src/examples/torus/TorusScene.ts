import { Canvas } from '../../Canvas';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { Vector3f, Matrix4f } from '../../math';

export class TorusScene extends AbstractScene {

    private razorLogo: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.setCullFace(CullFace.FRONT);

        return Promise.all([
            TextureUtils.load(require('./assets/razor1911.png'), true).then(
                (texture: Texture) => this.razorLogo = texture
            )
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();
        const elapsedTime: number = 0.02 * time;
        this.drawTitanEffect(framebuffer);
        this.shadingTorus(framebuffer, elapsedTime);
        framebuffer.drawTexture(32, 1, this.razorLogo, 1.0);
    }
    
    public shadingTorus(framebuffer: Framebuffer, elapsedTime: number): void {

        framebuffer.wBuffer.fill(100);

        let points: Array<Vector3f> = [];

        const STEPS = 15;
        const STEPS2 = 12;
        for (let i = 0; i < STEPS; i++) {
            let frame = framebuffer.torusFunction(i * 2 * Math.PI / STEPS);
            let frame2 = framebuffer.torusFunction(i * 2 * Math.PI / STEPS + 0.1);
            let up = new Vector3f(0.0, 4.0, 0);
            let right = frame2.sub(frame).cross(up);

            for (let r = 0; r < STEPS2; r++) {
                let pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS2)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS2))).add(frame);
                points.push(pos);
            }
        }

        let index: Array<number> = [];

        for (let j = 0; j < STEPS; j++) {
            for (let i = 0; i < STEPS2; i++) {
                index.push(((STEPS2 * j) + (1 + i) % STEPS2) % points.length); // 2
                index.push(((STEPS2 * j) + (0 + i) % STEPS2) % points.length); // 1
                index.push(((STEPS2 * j) + STEPS2 + (1 + i) % STEPS2) % points.length); //3

                index.push(((STEPS2 * j) + STEPS2 + (0 + i) % STEPS2) % points.length); //4
                index.push(((STEPS2 * j) + STEPS2 + (1 + i) % STEPS2) % points.length); //3
                index.push(((STEPS2 * j) + (0 + i) % STEPS2) % points.length); // 5
            }
        }

        // compute normals
        let normals: Array<Vector3f> = new Array<Vector3f>();

        for (let i = 0; i < index.length; i += 3) {
            let normal = points[index[i + 1]].sub(points[index[i]]).cross(points[index[i + 2]].sub(points[index[i]]));
            normals.push(normal);
        }

        let scale = 1.0;

        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.05));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.08));

        /**
         * Vertex Shader Stage
         */
        let points2: Array<Vector3f> = new Array<Vector3f>();

        let normals2: Array<Vector3f> = new Array<Vector3f>();
        for (let n = 0; n < normals.length; n++) {
            normals2.push(modelViewMartrix.multiply(normals[n]));
        }

        modelViewMartrix = Matrix4f.constructTranslationMatrix(0, 0, -24).multiplyMatrix(modelViewMartrix);

        for (let p = 0; p < points.length; p++) {
            let transformed = modelViewMartrix.multiply(points[p]);

            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z; // TODO: use translation matrix!

            let xx = (320 * 0.5) + (x / (-z * 0.0078));
            let yy = (200 * 0.5) + (y / (-z * 0.0078));
            // commented out because it breaks the winding. inversion
            // of y has to be done after back-face culling in the
            // viewport transform
            // yy =(200 * 0.5) - (y / (-z * 0.0078));

            points2.push(new Vector3f(Math.round(xx), Math.round(yy), z));
        }

        /**
         * Primitive Assembly and Rasterization Stage:
         * 1. back-face culling
         * 2. viewport transform
         * 3. scan conversion (rasterization)
         */
        for (let i = 0; i < index.length; i += 3) {

            // Only render triangles with CCW-ordered vertices
            // 
            // Reference:
            // David H. Eberly (2006).
            // 3D Game Engine Design: A Practical Approach to Real-Time Computer Graphics,
            // p. 69. Morgan Kaufmann Publishers, United States.
            //
            let v1 = points2[index[i]];
            let v2 = points2[index[i + 1]];
            let v3 = points2[index[i + 2]];

            if (framebuffer.isTriangleCCW(v1, v2, v3)) {
                let normal = normals2[i / 3];
                let scalar = Math.min((Math.max(0.0, normal.normalize().dot(new Vector3f(0.5, 0.5, 0.5).normalize())) * 100), 255) + 50;
                let color = 255 << 24 | scalar << 16 | scalar << 8 | scalar + 100;
                framebuffer.drawTriangleDDA(v1, v2, v3, color);
            }
        }
    }


    private drawTitanEffect(framebuffer: Framebuffer) {
        framebuffer.clear();
        const horizontalNum = 320 / 20;
        const verticalNum = 200 / 20;

        for (let x = 0; x < horizontalNum; x++) {
            for (let y = 0; y < verticalNum; y++) {

                let scale = ((Math.sin(Date.now() * 0.004 + x * 0.7 + y * 0.4) + 1) / 2);
                let size = Math.round(scale * 8 + 1) * 2;
                let offset = (20 / 2 - size / 2) | 0;
                let color = 255 << 24 | (85 * scale) << 16 | (55 * scale) << 8 | (55 * scale);
                framebuffer.drawBox2(x * 20 + offset, y * 20 + offset, size, size, color);
            }
        }

    }

}
