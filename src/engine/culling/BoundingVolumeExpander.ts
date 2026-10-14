import { FlatshadedMesh } from '@engine/geometry/objects/FlatshadedMesh';
import { ComputationalGeometryUtils } from '@engine/math/Geometry';
import { Sphere } from '@engine/math/Sphere';

export class BoundingVolumeExpander {

    public static expand(scene: Array<FlatshadedMesh>): Array<[FlatshadedMesh, Sphere]> {
        return scene.map((mesh: FlatshadedMesh): [FlatshadedMesh, Sphere] => {
            const sphere: Sphere = new ComputationalGeometryUtils().computeBoundingSphere(mesh.points);
            sphere.getCenter().w = 1;
            return [mesh, sphere];
        });
    }

}
