import type { Framebuffer } from '@engine/rendering/Framebuffer';

export const FOCAL_LENGTH = 292;

interface ProjectionPoint {
    x: number;
    y: number;
    z: number;
}

/**
 * Projects a view-space point to framebuffer pixels, retaining view-space z
 * for reciprocal-depth interpolation. Clipping must happen before projection.
 * Any other output fields (including homogeneous w) are left unchanged.
 */
export function projectToScreen(
    viewport: Pick<Framebuffer, 'width' | 'height'>,
    point: ProjectionPoint,
    result: ProjectionPoint,
    snapToPixels: boolean = false
): void {
    const invZ = 1 / -point.z;
    const x = viewport.width / 2 + FOCAL_LENGTH * point.x * invZ;
    const y = viewport.height / 2 - point.y * FOCAL_LENGTH * invZ;
    result.x = snapToPixels ? Math.round(x) : x;
    result.y = snapToPixels ? Math.round(y) : y;
    result.z = point.z;
}
