import { AbstractScene } from "./scenes/AbstractScene";
import { CullFace } from "./CullFace";
import Framebuffer from "./Framebuffer";
import { Matrix4f, Vector4f, Vector3f } from "./math";
import { FrustumCuller } from "./clustered-culling/FrustumCuller";
import { Polygon } from "./portal-system/Polygon";
import { Plane } from "./math/Plane";
import { SutherlandHodgmanClipper } from "./portal-system/SutherlandHodgmanClipper";
import { Color } from "./core/Color";
import { ControllableCamera } from "./camera";
import { Area } from "./portal-system/Area";
import { Portal } from "./portal-system/Portal";

export class PortalScene extends AbstractScene {

    private static readonly BACKGROUND_COLOR: number = Color.SLATE_GRAY.toPackedFormat();

    private controllableCamera: ControllableCamera;

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.setCullFace(CullFace.BACK);

        this.controllableCamera = new ControllableCamera(new Vector3f(14.84, 0, -19.25), -3.54, 0, 0);

        document.addEventListener("keydown", (e) => {
            if (e.which == 38) this.controllableCamera.moveForward(0.2, 1.0);
            if (e.which == 40) this.controllableCamera.moveBackward(0.2, 1.0);
            if (e.which == 37) this.controllableCamera.turnLeft(0.05, 1.0);
            if (e.which == 39) this.controllableCamera.turnRight(0.05, 1.0);
        });

        return Promise.all([]);
    }

    public render(framebuffer: Framebuffer): void {
        framebuffer.clearColorBuffer(PortalScene.BACKGROUND_COLOR);
        framebuffer.clearDepthBuffer();

        let modelViewMartrix: Matrix4f = this.controllableCamera.getViewMatrix();

        let frustumCuller = new FrustumCuller();
        frustumCuller.updateFrustum(modelViewMartrix, this.controllableCamera.getPosition());

        this.drawScreenBounds(framebuffer);

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

        this.renderVisibleAreas(framebuffer, modelViewMartrix, area, frustumCuller.getPlanes());
    }

    /**
     * TODO: check if portal is front facing to speed up
     */
    private renderVisibleAreas(framebuffer: Framebuffer, modelViewMatrix: Matrix4f, area: Area, clipPlanes: Array<Plane>): void {
 
        area.draw();

        if (area.portals === undefined) {
            return;
        }

        area.portals.forEach((portal: Portal) => {
            const clippedPortalGeometry = SutherlandHodgmanClipper.clip(portal.geometry, clipPlanes);
            
            if (clippedPortalGeometry.isVisible()) {
                const color: Color = area.portalColor ? area.portalColor : Color.CYAN;
                
                framebuffer.drawPolygon(0, clippedPortalGeometry, modelViewMatrix, color);
                const clippingPlanes: Array<Plane> = clippedPortalGeometry.getPlanes(this.controllableCamera.getPosition());   
                this.renderVisibleAreas(framebuffer, modelViewMatrix, portal.intoArea, clippingPlanes);
            }
        });
    }

    private drawScreenBounds(framebuffer: Framebuffer): void {
        let color = Color.WHITE.toPackedFormat();
        let width = 320 / 2;
        let height = 200 / 2;
        framebuffer.drawLineDDANoZ(new Vector3f(width / 2, height / 2, 0), new Vector3f(width / 2 + width, height / 2, -100), color);
        framebuffer.drawLineDDANoZ(new Vector3f(width / 2, height / 2, 0), new Vector3f(width / 2, height / 2 + height, -100), color);
        framebuffer.drawLineDDANoZ(new Vector3f(width / 2 + width, height / 2, 0), new Vector3f(width / 2 + width, height / 2 + height, -100), color);
        framebuffer.drawLineDDANoZ(new Vector3f(width / 2, height / 2 + height, 0), new Vector3f(width / 2 + width, height / 2 + height, -100), color);
    }

}