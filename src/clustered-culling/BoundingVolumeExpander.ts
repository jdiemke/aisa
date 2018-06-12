import { FlatshadedMesh } from '../geometrical-objects/FlatshadedMesh';
import { ComputationalGeometryUtils } from '../math/Geometry';
import { Sphere } from '../math/Sphere';

export class BoundingVolumeExpander {

    public static expand(scene: Array<FlatshadedMesh>): Array<[FlatshadedMesh, Sphere]> {
        return scene.map((mesh: FlatshadedMesh): [FlatshadedMesh, Sphere] => {
            const sphere: Sphere = new ComputationalGeometryUtils().computeBoundingSphere(mesh.points);
            sphere.getCenter().w = 1;
            return [mesh, sphere];
        });
    }

}
