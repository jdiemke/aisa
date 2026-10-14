import { Framebuffer } from '@engine/rendering/Framebuffer';
import { Matrix4f, Vector4f, Vector3f } from '@engine/math';
import { Area } from '@engine/portals/Area';
import { Plane } from '@engine/math/Plane';
import { Portal } from '@engine/portals/Portal';
import { SutherlandHodgmanClipper } from '@engine/portals/SutherlandHodgmanClipper';
import { Color } from '@core/Color';
import { ControllableCamera } from '@engine/camera';
import { Polygon } from '@engine/portals/Polygon';
import { LineRenderingPipeline } from '@engine/rendering/pipelines/LineRenderingPipeline';

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
        const lines = new LineRenderingPipeline(framebuffer);
        const points: Array<Vector4f> = polygon.vertices;

        const modelViewMartrix = matrix;

        const points2: Array<Vector3f> = new Array<Vector3f>();
        points.forEach(element => {
            const transformed = modelViewMartrix.multiplyHom(element);

            const x = transformed.x;
            const y = transformed.y;
            const z = transformed.z; // TODO: use translation matrix!

            points2.push(new Vector3f(x, y, z));
        });

        // TODO: draw without depth buffer DDA line
        for (let i = 0; i < points2.length; i++) {
            lines.nearPlaneClipping(points2[i], points2[(i + 1) % points2.length], color.toPackedFormat());
        }
    }

}
