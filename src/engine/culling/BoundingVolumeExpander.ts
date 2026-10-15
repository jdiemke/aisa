import { FlatshadedMesh } from '@engine/geometry/objects';
import { ComputationalGeometryUtils, Sphere } from '@engine/math';

export class BoundingVolumeExpander {

    public static expand(scene: Array<FlatshadedMesh>): Array<[FlatshadedMesh, Sphere]> {
        return scene.map((mesh: FlatshadedMesh): [FlatshadedMesh, Sphere] => {
            const sphere: Sphere = new ComputationalGeometryUtils().computeBoundingSphere(mesh.points);
            sphere.getCenter().w = 1;
            return [mesh, sphere];
        });
    }

}
