import { Framebuffer } from '../../Framebuffer';
import { Matrix3f, Vector3f } from '../../math';
import { AbstractScene } from '../../scenes/AbstractScene';
import { CohenSutherlandLineClipper } from '../../screen-space-clipping/CohenSutherlandLineClipper';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';

/**
 * TODO: extract twister into effect class
 */
export class TwisterScene extends AbstractScene {

    private backgroundTexture: Texture;
    private logoTexture: Texture;
    private greets: Texture;
    private linerClipper ;
    private framebuffer: Framebuffer;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.framebuffer = framebuffer;
        this.linerClipper = new CohenSutherlandLineClipper(framebuffer);
        return Promise.all([
            TextureUtils.load(require('@assets/atlantis.png'), false).then(
                (texture: Texture) => this.backgroundTexture = texture
            ),
            TextureUtils.load(require('@assets/logo.png'), false).then(
                (texture: Texture) => this.logoTexture = texture
            ),
            TextureUtils.load(require('@assets/atlantis.png'), false).then(
                (texture: Texture) => this.backgroundTexture = texture
            ),
            TextureUtils.load(require('@assets/logo.png'), false).then(
                (texture: Texture) => this.logoTexture = texture
            ),
            TextureUtils.load(require('@assets/haujobb-overlay.png'), true).then(
                (texture: Texture) => this.greets = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        framebuffer.clearColorBuffer(0);
        framebuffer.drawTexture(0,0,  this.greets,1.0);
        framebuffer.clearDepthBuffer();
     
            const color = 105 | 255 << 8 |  105<< 16| 255 <<24;
            this.scene8(time*0.03, color);
      
    }

        // TODO:
    // - implement scale and translate using homogenous 4x4 matrices
    //   instead of fucking around with the projection formular
    public scene8(elapsedTime: number, color: number): void {

        const index: Array<number> = [
            0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6,
            6, 7, 7, 4, 0, 7, 1, 6, 2, 5, 3, 4,
        ];

        const points: Array<Vector3f> = [
            new Vector3f(1.0, 1.0, -1.0), new Vector3f(-1.0, 1.0, -1.0),
            new Vector3f(-1.0, 1.0, 1.0), new Vector3f(1.0, 1.0, 1.0),
            new Vector3f(1.0, -1.0, 1.0), new Vector3f(-1.0, -1.0, 1.0),
            new Vector3f(-1.0, -1.0, -1.0), new Vector3f(1.0, -1.0, -1.0)
        ];

        const scale = 0.8;

        let modelViewMartrix = Matrix3f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix3f.constructYRotationMatrix(elapsedTime * 0.05));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix3f.constructXRotationMatrix(elapsedTime * 0.05));

        const points2: Array<Vector3f> = new Array<Vector3f>();
        points.forEach((element) => {
            const transformed = modelViewMartrix.multiply(element);

            const x = transformed.x+0.6;
            const y = transformed.y;
            const z = transformed.z - 5 + Math.sin(elapsedTime * 0.09) * 1; // TODO: use translation matrix!

            points2.push(new Vector3f(x, y, z));
        });

        for (let i = 0; i < index.length; i += 2) {
           
            this.nearPlaneClipping(points2[index[i]], points2[index[i + 1]], color);
        }
    }

     // https://math.stackexchange.com/questions/859454/maximum-number-of-vertices-in-intersection-of-triangle-with-box/
     public nearPlaneClipping(t1: Vector3f, t2: Vector3f, color: number): void {
        const NEAR_PLANE_Z = -1.7;

        if (t1.z < NEAR_PLANE_Z && t2.z < NEAR_PLANE_Z) {
            this.linerClipper.cohenSutherlandLineClipper(this.project(t1), this.project(t2), color);
        } else if (t1.z > NEAR_PLANE_Z && t2.z > NEAR_PLANE_Z) {
            return;
        } else if (t1.z < NEAR_PLANE_Z) {
            const ratio = (NEAR_PLANE_Z - t1.z) / (t2.z - t1.z);
            const t3 = new Vector3f(ratio * (t2.x - t1.x) + t1.x, ratio * (t2.y - t1.y) + t1.y, NEAR_PLANE_Z);
            this.linerClipper.cohenSutherlandLineClipper(this.project(t1), this.project(t3), color);
        } else if (t2.z < NEAR_PLANE_Z) {
            const ratio = (NEAR_PLANE_Z - t2.z) / (t1.z - t2.z);
            const t3 = new Vector3f(ratio * (t1.x - t2.x) + t2.x, ratio * (t1.y - t2.y) + t2.y, NEAR_PLANE_Z);
            this.linerClipper.cohenSutherlandLineClipper(this.project(t2), this.project(t3), color);
        }
    }

    public project(t1: { x: number, y: number, z: number }): Vector3f {
        return new Vector3f(Math.round((this.framebuffer.width / 2) + (292 * t1.x / (-t1.z))),
            Math.round((this.framebuffer.height / 2) - (t1.y * 292 / (-t1.z))),
            t1.z);
    }


}
