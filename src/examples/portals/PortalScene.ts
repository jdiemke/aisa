import { ControllableCamera } from '../../camera';
import { FrustumCuller } from '../../clustered-culling/FrustumCuller';
import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Matrix4f, Vector3f, Vector4f } from '../../math';
import { Area, Polygon, Portal, PortalRenderer } from '../../portal-system';
import { AbstractScene } from '../../scenes/AbstractScene';

export class PortalScene extends AbstractScene {

    private static readonly BACKGROUND_COLOR: number = Color.SLATE_GRAY.toPackedFormat();

    private controllableCamera: ControllableCamera;
    private area: Area;
    private frustumCuller: FrustumCuller;
    private portalRenderer: PortalRenderer;

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.setCullFace(CullFace.BACK);

        this.controllableCamera = new ControllableCamera(new Vector3f(14.84, 0, -19.25), -3.54, 0, 0);
        this.area = this.generateAreaPortalNetwork();
        this.frustumCuller = new FrustumCuller(framebuffer);
        this.portalRenderer = new PortalRenderer();

        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.which === 38) {
                this.controllableCamera.moveForward(0.2, 1.0);
            }
            if (e.which === 40) {
                this.controllableCamera.moveBackward(0.2, 1.0);
            }
            if (e.which === 37) {
                this.controllableCamera.turnLeft(0.05, 1.0);
            }
            if (e.which === 39) {
                this.controllableCamera.turnRight(0.05, 1.0);
            }
        });

        return Promise.all([]);
    }

    /**
     * TODO:
     * * move parameters or renderVisibleAreas into constructor
     * * move computation of starting area into portal renderer
     */
    public render(framebuffer: Framebuffer): void {
        framebuffer.clearColorBuffer(PortalScene.BACKGROUND_COLOR);
        framebuffer.clearDepthBuffer();

        const modelViewMartrix: Matrix4f = this.controllableCamera.getViewMatrix();
        this.frustumCuller.updateFrustum(modelViewMartrix, this.controllableCamera.getPosition());

        this.drawScreenBounds(framebuffer);
        // TODO:
        // * find the area to start the portal flooding in
        // * const area: Area = getStartArea(position);
        this.portalRenderer.renderVisibleAreas(
            framebuffer,
            modelViewMartrix,
            this.area,
            this.frustumCuller.getPlanes(),
            this.controllableCamera
        );
    }

    /**
     * Idea:
     * * use blender to build level
     * * use special naming convention to identify portals and their connectivity
     * * "portal:area-name:into-area-name"
     * * problem: how to identify the first area?
     *
     * @private
     * @returns {Area}
     * @memberof PortalScene
     */
    private generateAreaPortalNetwork(): Area {
        const polygon2: Polygon = new Polygon();
        polygon2.vertices = [new Vector4f(0, 5 - 2, 3), new Vector4f(10, 5 - 2, 3), new Vector4f(10, -5 - 2, 3)];

        const portal2: Portal = new Portal();
        portal2.geometry = polygon2;
        portal2.intoArea = new Area();

        const area2: Area = new Area();
        area2.portals = [portal2];

        const polygon: Polygon = new Polygon();
        polygon.vertices = [new Vector4f(0, 5, 0), new Vector4f(10, 5, 0), new Vector4f(10, -5, 0)];

        const portal: Portal = new Portal();
        portal.geometry = polygon;
        portal.intoArea = area2;

        const area: Area = new Area();
        area.mesh = null;
        area.portals = [portal];
        area.portalColor = Color.RED;

        return area;
    }

    private drawScreenBounds(framebuffer: Framebuffer): void {
        const color: number = Color.WHITE.toPackedFormat();
        const width: number = framebuffer.width / 2;
        const height: number = framebuffer.height / 2;

        framebuffer.drawLineDDANoZ(
            new Vector3f(width / 2, height / 2, 0),
            new Vector3f(width / 2 + width, height / 2, -100),
            color
        );

        framebuffer.drawLineDDANoZ(
            new Vector3f(width / 2, height / 2, 0),
            new Vector3f(width / 2, height / 2 + height, -100),
            color
        );

        framebuffer.drawLineDDANoZ(
            new Vector3f(width / 2 + width, height / 2, 0),
            new Vector3f(width / 2 + width, height / 2 + height, -100),
            color
        );

        framebuffer.drawLineDDANoZ(
            new Vector3f(width / 2, height / 2 + height, 0),
            new Vector3f(width / 2 + width, height / 2 + height, -100),
            color
        );
    }

}
