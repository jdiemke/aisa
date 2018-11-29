import { Canvas } from '../../Canvas';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Matrix4f, Vector3f, Vector4f } from '../../math';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { TorusKnot } from '../../geometrical-objects/TorusKnot';

export class TorusKnotTunnelScene extends AbstractScene {

    private noise: Texture;
    private particleTexture: Texture;
    private torusKnot = new TorusKnot();

    private accumulationBuffer: Uint32Array = new Uint32Array(320 * 200);

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.renderingPipeline.setCullFace(CullFace.FRONT);
        return Promise.all([
            TextureUtils.generateProceduralNoise().then((texture: Texture) => this.noise = texture),
            TextureUtils.generateProceduralParticleTexture2().then((texture: Texture) => this.particleTexture = texture),
        ]);
    }

    /**
     * TODO:
     * * move stackig geometry into mesh
     * * particles into particle system class
     * * remove old renderObject method
     */
    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();

        this.torusTunnel(framebuffer, time * 0.02, Date.now(), this.particleTexture);

        const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
        framebuffer.drawTexture(0, 0, texture3, 0.75);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);
        framebuffer.noise(time, this.noise);
    }

    public torusTunnel(framebuffer: Framebuffer, elapsedTime: number, sync: number, texture: Texture): void {
        framebuffer.clearDepthBuffer();

        let scale = 1.0;

        let frame = this.torusFunction3(elapsedTime * 0.02);
        let frame2 = this.torusFunction3(elapsedTime * 0.02 + 0.01);

        let tangent = frame2.sub(frame).normalize();
        let up = frame.add(frame2).normalize();
        let right = tangent.cross(up).normalize();
        up = right.cross(tangent).normalize();

        let translation = Matrix4f.constructIdentityMatrix();
        // translation vector
        translation.m14 = -frame.x;
        translation.m24 = -frame.y;
        translation.m34 = -frame.z;

        let rotation = Matrix4f.constructIdentityMatrix();
        // x vector
        rotation.m11 = right.x;
        rotation.m21 = right.y;
        rotation.m31 = right.z;

        // y vector
        rotation.m12 = up.x;
        rotation.m22 = up.y;
        rotation.m32 = up.z;

        // z vector
        rotation.m13 = -tangent.x;
        rotation.m23 = -tangent.y;
        rotation.m33 = -tangent.z;

        let finalMatrix = rotation.transpose().multiplyMatrix(translation);

        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.035));
        modelViewMartrix = Matrix4f.constructTranslationMatrix(0, 0, -10).multiplyMatrix(modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.04)));
        modelViewMartrix = Matrix4f.constructZRotationMatrix(elapsedTime * 0.01).multiplyMatrix(finalMatrix);

        framebuffer.renderingPipeline.draw(this.torusKnot.getMesh(), modelViewMartrix, 221, 96, 48);

        let ppoints = new Array<Vector3f>();
        const num = 40;
        const STEPS22 = 8 * 2;
        for (let j = 0; j < num; j++) {
            let frame = this.torusFunction3(j * 2 * Math.PI / num);
            let frame2 = this.torusFunction3(j * 2 * Math.PI / num + 0.1);

            let tangent = frame2.sub(frame);
            let up = frame.add(frame2).normalize()
            let right = tangent.cross(up).normalize().mul(10.4);
            up = right.cross(tangent).normalize().mul(10.4);

            for (let r = 0; r < STEPS22; r++) {
                let pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS22)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS22))).add(frame);
                ppoints.push(new Vector3f(pos.x, pos.y, pos.z));
            }

        }

        let ppoints2: Array<Vector3f> = new Array<Vector3f>(ppoints.length);
        ppoints.forEach(element => {
            let transformed = framebuffer.project(modelViewMartrix.multiply(element));
            ppoints2.push(transformed);
        });

        ppoints2.sort(function (a, b) {
            return a.z - b.z;
        });

        ppoints2.forEach(element => {
            //let size = -(2.0 * 192 / (element.z));
            let size = -(2.3 * 192 / (element.z));
            if (element.z < -4)
            framebuffer.drawParticle(
                    Math.round(element.x - size / 2),
                    Math.round(element.y - size / 2),
                    Math.round(size), Math.round(size), texture, 1 / element.z, framebuffer.interpolate(-90, -55, element.z));
        });
    }

    private torusFunction3(alpha: number): Vector4f {
        let p = 2, q = 3;
        let r = 0.5 * (2 + Math.sin(q * alpha));
        return new Vector4f(r * Math.cos(p * alpha),
            r * Math.cos(q * alpha),
            r * Math.sin(p * alpha)).mul(70);
    }

}
