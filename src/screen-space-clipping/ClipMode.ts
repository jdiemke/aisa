/**
 * Selects which intersection computation to use during polygon clipping.
 *
 * - GOURAUD:            interpolates vertex color (computeIntersection)
 * - PERSPECTIVE_TEXTURE: perspective-correct texture coordinate interpolation (computeIntersection2)
 * - AFFINE_TEXTURE:     affine (no perspective) texture coordinate interpolation (computeIntersection3)
 */
export enum ClipMode {
    GOURAUD = 'gouraud',
    PERSPECTIVE_TEXTURE = 'perspective_texture',
    AFFINE_TEXTURE = 'affine_texture',
}
