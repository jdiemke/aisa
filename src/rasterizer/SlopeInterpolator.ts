import { Vertex } from '../Vertex';

export class SlopeInterpolator {

    yDistance: number;
    slope: number;
    zslope: number;
    currentZ: number;
    currentX: number;
    yStart: number;

    setup(top: Vertex, bottom: Vertex) {
        this.yDistance = bottom.projection.y - top.projection.y;
        this.slope = (bottom.projection.x - top.projection.x) / this.yDistance;
        this.zslope = (1 / bottom.projection.z - 1 / top.projection.z) / this.yDistance;
        this.currentZ = 1.0 / top.projection.z;
        this.currentX = top.projection.x;
        this.yStart = top.projection.y;
    }

    advance() {
        this.currentX += this.slope;
        this.currentZ += this.zslope;
    }
}
