import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Matrix4f, Vector3f, Vector4f } from '../../math';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { TextureCoordinate } from '../../TextureCoordinate';
import { TexturingRenderingPipeline } from '../../rendering-pipelines/TexturingRenderingPipeline';
import { TexturedMesh } from '../../rendering-pipelines/TexturedMesh';
import { Interpolator } from '../../math/Interpolator';

export class TexturedTorusScene extends AbstractScene {

    private texture5: Texture;
    private abstract: Texture;
    private texture4: Texture;

    private torusMesh: TexturedMesh;

    private texturedRenderingPipleine: TexturingRenderingPipeline;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.texturedRenderingPipleine = new TexturingRenderingPipeline(framebuffer);
        this.texturedRenderingPipleine.setCullFace(CullFace.BACK);
        this.texturedRenderingPipleine.setFramebuffer(framebuffer);

        this.torusMesh = this.computeTexturedTorusMesh();

        return Promise.all([
            TextureUtils.load(require('../../assets/font.png'), true).then(texture => this.texture4 = texture),
            TextureUtils.load(require('../../assets/cyber.png'), false).then(texture => this.abstract = texture),
            TextureUtils.load(require('../../assets/atlantis.png'), false).then(texture => this.texture5 = texture),
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();

        framebuffer.setTexture(this.abstract);
        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.texture5.texture);
        this.shadingTorus4(framebuffer, time * 0.002);
        this.cinematicScroller(framebuffer, this.texture4, time);
    }

    public shadingTorus4(framebuffer: Framebuffer, elapsedTime: number): void {

        framebuffer.clearDepthBuffer();

        const scale = 0.3;

        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.35));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.4));
        modelViewMartrix = Matrix4f.constructTranslationMatrix(Math.sin(elapsedTime * 0.3) * 26, Math.sin(elapsedTime * 0.2) * 10
            , -55)
            .multiplyMatrix(modelViewMartrix);

        this.texturedRenderingPipleine.setModelViewMatrix(modelViewMartrix);
        this.texturedRenderingPipleine.draw(framebuffer, this.torusMesh);
    }


    public torusFunction(alpha: number): Vector3f {
        return new Vector3f(Math.sin(alpha) * 10, 0, Math.cos(alpha) * 10);
    }

    private torusFunction3(alpha: number): Vector3f {
        const p = 2
        const q = 3;
        const r = 0.5 * (2 + Math.sin(q * alpha));
        return new Vector3f(r * Math.cos(p * alpha),
            r * Math.cos(q * alpha),
            r * Math.sin(p * alpha)).mul(50);
    }

    private computeTexturedTorusMesh(): TexturedMesh {
        const points: Array<Vector4f> = [];
        const textCoords: Array<TextureCoordinate> = [];

        const STEPS = 75;
        const STEPS2 = 30;
        for (let i = 0; i < STEPS + 1; i++) {
            const frame = this.torusFunction3(i * 2 * Math.PI / STEPS);
            const frame2 = this.torusFunction3(i * 2 * Math.PI / STEPS + 0.01);

           // const up = new Vector3f(0.0, 16.0, 0);
          //  const right = frame2.sub(frame).cross(up).normalize().mul(16);


            const tangent = frame2.sub(frame);
            let up = frame.add(frame2).normalize();
            const right = tangent.cross(up).normalize().mul(18.4);
            up = right.cross(tangent).normalize().mul(18.4);



            for (let r = 0; r < STEPS2 + 1; r++) {
                const pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS2)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS2))).add(frame);
                points.push(new Vector4f(pos.x, pos.y, pos.z));
                const t = new TextureCoordinate();
                t.u = 1 / (STEPS2) * r;
                t.v = 7 / (STEPS) * i;
                textCoords.push(t);
            }
        }

        const faces: Array<{
            vertices: Array<number>;
            uv: Array<number>
        }> = [];

        for (let j = 0; j < STEPS; j++) {
            for (let i = 0; i < STEPS2; i++) {
                faces.push({
                    uv: [
                        (((STEPS2 + 1) * j) + (1 + i)),
                        (((STEPS2 + 1) * j) + (0 + i)),
                        (((STEPS2 + 1) * j) + (STEPS2 + 1) + (1 + i))
                    ],
                    vertices: [
                        (((STEPS2 + 1) * j) + (1 + i)),
                        (((STEPS2 + 1) * j) + (0 + i)),
                        (((STEPS2 + 1) * j) + (STEPS2 + 1) + (1 + i))
                    ]
                });

                faces.push({
                    uv: [
                        (((STEPS2 + 1) * j) + (STEPS2 + 1) + (0 + i)),
                        (((STEPS2 + 1) * j) + (STEPS2 + 1) + (1 + i)),
                        (((STEPS2 + 1) * j) + (0 + i))
                    ],
                    vertices: [
                        (((STEPS2 + 1) * j) + (STEPS2 + 1) + (0 + i)),
                        (((STEPS2 + 1) * j) + (STEPS2 + 1) + (1 + i)),
                        (((STEPS2 + 1) * j) + (0 + i))
                    ]
                });
            }
        }

        const torus: TexturedMesh = {
            points,
            points2: points.map(() => new Vector4f(0, 0, 0)),
            uv: textCoords,
            faces
        };

        return torus;

    }

    public cinematicScroller(framebuffer: Framebuffer, texture: Texture, time: number) {
        const scrollText: Array<string> = [
            '', '', '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '', '', '',
            '', '', '', '', '',
            'YOU HAVE BEEN WATCHING',
            '',
            'D A R K   M A T T E R',
            '',
            'A JAVASCRIPT DEMO MADE FOR',
            'NORDLICHT 2018',
            '',
            'CREDITS',
            '',
            'CODE BY',
            'TRIGGER',
            '',
            'GRAFICS BY',
            'PREMIUM',
            '',
            'MUSIC BY',
            'VIRGILL'
        ];
        time = time * 0.6;

        const scrollerOffset = Math.round(Interpolator.interpolate(0, 250, time & 0xff) * 8);

        for (let i = 1; i < framebuffer.height / 8; i++) {
            const text = scrollText[Math.floor((i + (time / 256))) % scrollText.length];
            const x = (framebuffer.width / 2 - text.length * 8 / 2) | 0;
            const y = 8 * i - scrollerOffset;
            // TODO: proper text clipping to rect
            // maybe just for first and last row
            framebuffer.drawText(x, y, text, texture);
        }
    }


}
