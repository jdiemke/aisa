import { CameraAnimator } from '../../animation/CameraAnimator';
import { CameraKeyFrame } from '../../animation/CameraKeyFrame';
import { BlenderJsonParser } from '../../blender/BlenderJsonParser';
import { Canvas } from '../../Canvas';
import { BoundingVolumeExpander } from '../../clustered-culling/BoundingVolumeExpander';
import { FrustumCuller } from '../../clustered-culling/FrustumCuller';
import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';
import { Matrix4f, Vector3f } from '../../math';
import { Sphere } from '../../math/Sphere';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { FlatShadingRenderingPipeline } from '../../rendering-pipelines/FlatShadingRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';

export class FrustumCullingScene extends AbstractScene {

    private world: Array<[FlatshadedMesh, Sphere]>;

    private accumulationBuffer: Uint32Array = new Uint32Array(320 * 200);
    private renderingPipeline: FlatShadingRenderingPipeline;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.renderingPipeline = new FlatShadingRenderingPipeline(framebuffer);
        this.renderingPipeline.setCullFace(CullFace.BACK);

        this.world = BoundingVolumeExpander.expand(BlenderJsonParser.parse(require('../../assets/world2.json')));

        return Promise.all([
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();

        this.drawBlenderScene(framebuffer, time - 260000, null);
    }

    public drawBlenderScene(framebuffer: Framebuffer, elapsedTime: number, texture: Texture, texture2?: Texture): void {
        // camerea:
        // http://graphicsrunner.blogspot.de/search/label/Water
        framebuffer.clearColorBuffer(72 | 56 << 8 | 48 << 16 | 255 << 24);
        framebuffer.clearDepthBuffer();

        let keyFrames: Array<CameraKeyFrame> = [
            new CameraKeyFrame(new Vector3f(-5, 3, 10), new Vector3f(0, 0, 0)),
            new CameraKeyFrame(new Vector3f(5, 10, 10), new Vector3f(0, 0, 0.1)),
            new CameraKeyFrame(new Vector3f(5, 10, 0), new Vector3f(1.5, -1, -0.2)),
            new CameraKeyFrame(new Vector3f(5, 3, -10), new Vector3f(2.5, 0, -0.09)),
            new CameraKeyFrame(new Vector3f(-5, 7, -10), new Vector3f(3.5, 0, 1)),
            new CameraKeyFrame(new Vector3f(-5, 3, 10), new Vector3f(4, 0, 0.)),
            new CameraKeyFrame(new Vector3f(5, 3, -2), new Vector3f(3, -0.2, 0.)),
            new CameraKeyFrame(new Vector3f(18, 2, -0), new Vector3f(2, -0.4, 0.)),
            new CameraKeyFrame(new Vector3f(15, 4, -0), new Vector3f(2, -0.5, 0.)),
            new CameraKeyFrame(new Vector3f(5, 7, -10), new Vector3f(2.5, 0, -0.09)),
        ];

        let cameraAnimator = new CameraAnimator();
        cameraAnimator.setKeyFrames(keyFrames);

        let modelViewMartrix: Matrix4f = cameraAnimator.getViewMatrix(elapsedTime);

        let count = 0;

        let frustumCuller = new FrustumCuller();
        frustumCuller.updateFrustum(modelViewMartrix, cameraAnimator.pos);
        let i = 0;

        for (let j = 0; j <  this.world.length; j++) {

            const model: [FlatshadedMesh, Sphere] =  this.world[j];

            if (frustumCuller.isPotentiallyVisible(model[1])) {
                this.renderingPipeline.draw(model[0], modelViewMartrix, 144, 165, 116);
                let colLine = 255 << 24 | 255 << 8;
                framebuffer.drawBoundingSphere(model[1], modelViewMartrix, colLine);
                count++;
            } else {
                let colLine = 255 << 24 | 255;
                framebuffer.drawBoundingSphere(model[1], modelViewMartrix, colLine);
            }
        }

        if (texture2) {
            let points: Array<Vector3f> = new Array<Vector3f>();

            let rng = new RandomNumberGenerator();
            rng.setSeed(66);
            for (let i = 0; i < 640; i++) {
                //points.push(new Vector3f(rng.getFloat() * 30 - 15, rng.getFloat() * 10 - 1, rng.getFloat() * 30 - 15));
                let x = rng.getFloat() * 30 - 15;
                x += Math.sin(elapsedTime * 0.0008 + x) * 2;
                let y = rng.getFloat() * 30 - 15;
                y += Math.sin(elapsedTime * 0.0009 + y) * 2;
                let z = rng.getFloat() * 30 - 15;
                z += Math.sin(elapsedTime * 0.0011 + z) * 2;
                points.push(new Vector3f(x, y, z));
            }

            let points2: Array<Vector3f> = new Array<Vector3f>(points.length);
            points.forEach(element => {
                let transformed = framebuffer.project(modelViewMartrix.multiply(element));
                points2.push(transformed);
            });

            points2.sort(function (a, b) {
                return a.z - b.z;
            });

            points2.forEach(element => {
                let size = -(3.1 * 192 / (element.z));
                framebuffer.drawSoftParticle(
                    Math.round(element.x - size * 0.5),
                    Math.round(element.y - size * 0.5),
                    Math.round(size), Math.round(size), texture2, 1 / element.z, 1.0);
            });
        }
        // framebuffer.drawText(8, 18 + 8, 'RENDERED OBJECTS: ' + count + '/' + this.world.length, texture);
        framebuffer.drawScreenBounds(framebuffer);
    }

}
