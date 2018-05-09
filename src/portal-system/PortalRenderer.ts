import { Framebuffer } from "../Framebuffer";
import { Matrix4f } from "../math";
import { Area } from "./Area";
import { Plane } from "../math/Plane";
import { Portal } from "./Portal";
import { SutherlandHodgmanClipper } from "./SutherlandHodgmanClipper";
import { Color } from "../core/Color";
import { ControllableCamera } from "../camera";

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

            framebuffer.drawPolygon(0, clippedPortalGeometry, modelViewMatrix, area.portalColor ? area.portalColor : Color.CYAN);
            this.renderVisibleAreas(framebuffer, modelViewMatrix, portal.intoArea, clippedPortalGeometry.getPlanes(controllableCamera.getPosition()), controllableCamera);
        }
    }

}
