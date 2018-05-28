import { Framebuffer } from "../Framebuffer";
import { Matrix4f, Vector4f, Vector3f } from "../math";
import { Area } from "./Area";
import { Plane } from "../math/Plane";
import { Portal } from "./Portal";
import { SutherlandHodgmanClipper } from "./SutherlandHodgmanClipper";
import { Color } from "../core/Color";
import { ControllableCamera } from "../camera";
import { Polygon } from "./Polygon";

export class PortalRenderer {

    /**
     * TODO:
     * * check if portal is front facing to speed up
     * * configure max iteration depth!
     */
    public renderVisibleAreas(framebuffer: Framebuffer, modelViewMatrix: Matrix4f, area: Area, clipPlanes: Array<Plane>, controllableCamera: ControllableCamera): void {

        // if already visited return
        area.draw();

        if (area.portals === undefined || area.portals.length === 0) {
            return;
        }

        for (let i: number = 0; i < area.portals.length; i++) {
            const portal: Portal = area.portals[i];


            // 0.  portal should face the view
            //     portal.getPlane().distance(origin) < 0.0 then continue
            // 1.  check if we already visited the portal (or portal?) the portal leads to
            //     visitedAreas.forEach(a => a === portal.intoArea) continue;
            //     otherwise leads to an infinite loop. check portal or area??
            // 2.  

            const clippedPortalGeometry = SutherlandHodgmanClipper.clip(portal.geometry, clipPlanes);

            if (!clippedPortalGeometry.isVisible()) {
                continue;
            }

            this.drawPolygon(framebuffer, 0, clippedPortalGeometry, modelViewMatrix, area.portalColor ? area.portalColor : Color.CYAN);
            this.renderVisibleAreas(framebuffer, modelViewMatrix, portal.intoArea, clippedPortalGeometry.getPlanes(controllableCamera.getPosition()), controllableCamera);
        }
    }

    public drawPolygon(framebuffer: Framebuffer, elapsedTime: number, polygon: Polygon, matrix: Matrix4f, color: Color): void {
        framebuffer.clearDepthBuffer();
        let points: Array<Vector4f> = polygon.vertices;

        let scale = 0.8;

        let modelViewMartrix = matrix;

        let points2: Array<Vector3f> = new Array<Vector3f>();
        points.forEach(element => {
            let transformed = modelViewMartrix.multiplyHom(element);

            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z; // TODO: use translation matrix!

            points2.push(new Vector3f(x, y, z));
        });

        // TODO: draw without depth buffer DDA line
        for (let i = 0; i < points2.length; i++) {
            framebuffer.nearPlaneClipping(points2[i], points2[(i + 1) % points2.length], color.toPackedFormat());
        }
    }

}
