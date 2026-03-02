import { Color } from '../core/Color';
import { Framebuffer } from '../Framebuffer';
import { Vector4f } from '../math/index';
import { AbstractTriangleRasterizer } from '../rasterizer/AbstractTriangleRasterizer';
import { SutherlandHodgman2DClipper } from '../screen-space-clipping/SutherlandHodgman2DClipper';
import { Fog } from '../shading/fog/Fog';
import { PhongLighting } from '../shading/illumination-models/PhongLighting';
import { PointLight } from '../shading/light/PointLight';
import { Material } from '../shading/material/Material';
import { Vertex } from '../Vertex';
import { AbstractRenderingPipeline } from './AbstractRenderingPipeline';

/**
 * Intermediate base class for lit (Gouraud / flat / sub-pixel) rendering
 * pipelines.  Holds the shared fields, setters, projection helpers,
 * z-clipping, 2-D screen-space clipping and triangulation that were
 * previously duplicated across FlatShadingRenderingPipeline,
 * GouraudShadingRenderingPipeline and SubPixelRenderingPipeline.
 *
 * Subclasses only need to supply a concrete triangle rasterizer via the
 * constructor and implement their own {@link draw} method.
 */
export abstract class LitRenderingPipeline extends AbstractRenderingPipeline {

    protected fog: Fog = null;
    protected lights: Array<PointLight> = null;
    protected material: Material = null;
    protected lighting: boolean = true;
    protected color: Color = Color.WHITE;

    protected triangleRasterizer: AbstractTriangleRasterizer;
    protected clipper: SutherlandHodgman2DClipper;
    protected phongLighting: PhongLighting = new PhongLighting();

    protected projectedVertices: Array<Vector4f> = new Array<Vector4f>(
        new Vector4f(0, 0, 0, 1), new Vector4f(0, 0, 0, 1), new Vector4f(0, 0, 0, 1)
    );

    protected vertexArray: Array<Vertex> = new Array<Vertex>(
        new Vertex(), new Vertex(), new Vertex()
    );

    constructor(framebuffer: Framebuffer, triangleRasterizer: AbstractTriangleRasterizer) {
        super(framebuffer);
        this.clipper = new SutherlandHodgman2DClipper(framebuffer);
        this.triangleRasterizer = triangleRasterizer;

        const light1: PointLight = new PointLight();
        light1.ambientIntensity = new Vector4f(1, 1, 1, 1);
        light1.diffuseIntensity = new Vector4f(1, 1, 1, 1);
        light1.specularIntensity = new Vector4f(1, 1, 1, 1);
        light1.position = new Vector4f(3, 0, -2, 1);

        const light2: PointLight = new PointLight();
        light2.ambientIntensity = new Vector4f(0, 0, 1, 1);
        light2.diffuseIntensity = new Vector4f(0, 0.6, 1, 1);
        light2.specularIntensity = new Vector4f(0.8, 0.8, 0.8, 1);
        light2.position = new Vector4f(0, -380, -180, 1);

        this.lights = [light1, light2];

        const mat: Material = new Material();
        mat.ambientColor = new Vector4f(0.12, 0.14, 0.1, 0);
        mat.diffuseColor = new Vector4f(0.38, 0.4, 0.4, 1);
        mat.specularColor = new Vector4f(0.8, 0.5, 0.5, 0);
        mat.shininess = 2;

        this.material = mat;
    }

    // ── Setters ────────────────────────────────────────────────────────

    public setFramebuffer(framebuffer: Framebuffer): void {
        this.framebuffer = framebuffer;
    }

    public setFog(fog: Fog): void {
        this.fog = fog;
    }

    public setLights(lights: Array<PointLight>): void {
        this.lights = lights;
    }

    public enableLighting(enable: boolean): void {
        this.lighting = enable;
    }

    public setMaterial(material: Material): void {
        this.material = material;
    }

    public setColor(color: Color): void {
        this.color = color;
    }

    // ── Projection ─────────────────────────────────────────────────────
    // Default implementation WITHOUT Math.round (sub-pixel precision).
    // FlatShading / Gouraud override with Math.round for snapped pixels.

    public project(t1: { x: number, y: number, z: number }): Vector4f {
        return new Vector4f(
            ((this.framebuffer.width / 2) + (292 * t1.x / (-t1.z))),
            ((this.framebuffer.height / 2) - (t1.y * 292 / (-t1.z))),
            t1.z
        );
    }

    public project2(t1: { x: number, y: number, z: number }, result: Vector4f): void {
        result.x = ((this.framebuffer.width / 2) + (292 * t1.x / (-t1.z)));
        result.y = ((this.framebuffer.height / 2) - (t1.y * 292 / (-t1.z)));
        result.z = t1.z;
    }

    // ── Near-plane (z) clipping ────────────────────────────────────────

    public computeNearPlaneIntersection(p1: Vertex, p2: Vertex): Vertex {
        const ratio: number = (this.NEAR_PLANE_Z - p1.position.z) / (p2.position.z - p1.position.z);
        const vertex: Vertex = new Vertex();
        vertex.position = new Vector4f(
            ratio * (p2.position.x - p1.position.x) + p1.position.x,
            ratio * (p2.position.y - p1.position.y) + p1.position.y,
            this.NEAR_PLANE_Z
        );
        vertex.color = p2.color.sub(p1.color).mul(ratio).add(p1.color);
        return vertex;
    }

    public zClipTriangle(subject: Array<Vertex>): Array<Vertex> {
        const input: Array<Vertex> = subject;
        const output: Array<Vertex> = new Array<Vertex>();
        let S: Vertex = input[input.length - 1];

        for (let i: number = 0; i < input.length; i++) {
            const point: Vertex = input[i];
            if (this.isInFrontOfNearPlane(point.position)) {
                if (!this.isInFrontOfNearPlane(S.position)) {
                    output.push(this.computeNearPlaneIntersection(S, point));
                }
                output.push(point);
            } else if (this.isInFrontOfNearPlane(S.position)) {
                output.push(this.computeNearPlaneIntersection(S, point));
            }
            S = point;
        }

        return output;
    }

    // ── Screen-space clipping + triangulation ──────────────────────────

    protected renderConvexPolygon(framebuffer: Framebuffer, projected: Array<Vertex>, late: boolean = false): void {
        if (projected.length === 3 &&
            !this.isTriangleCCW(
                projected[0].projection,
                projected[1].projection,
                projected[2].projection)) {
            return;
        }

        if (late) {
            if (this.lighting) {
                this.vertexArray[0].color = this.computeColor(this.vertexArray[0].normal, this.vertexArray[0].position);
                this.vertexArray[1].color = this.computeColor(this.vertexArray[1].normal, this.vertexArray[1].position);
                this.vertexArray[2].color = this.computeColor(this.vertexArray[2].normal, this.vertexArray[2].position);
            } else {
                this.vertexArray[0].color = this.color;
                this.vertexArray[1].color = this.color;
                this.vertexArray[2].color = this.color;
            }
        }

        if (projected.length === 4 &&
            !this.isTriangleCCW2(
                projected[0].projection,
                projected[1].projection,
                projected[2].projection,
                projected[3].projection)
        ) {
            return;
        }

        const clippedPolygon: Array<Vertex> = this.clipper.clipConvexPolygon(projected);

        if (clippedPolygon.length < 3) {
            return;
        }

        this.triangulateConvexPolygon(framebuffer, clippedPolygon);
    }

    protected triangulateConvexPolygon(framebuffer: Framebuffer, clippedPolygon: Array<Vertex>): void {
        for (let j: number = 0; j < clippedPolygon.length - 2; j++) {
            this.triangleRasterizer.drawTriangleDDA(
                framebuffer,
                clippedPolygon[0],
                clippedPolygon[1 + j],
                clippedPolygon[2 + j]
            );
        }
    }

    // ── Lighting / color ───────────────────────────────────────────────

    protected computeColor(normal: Vector4f, vertex: Vector4f): Color {
        let vertexColor: Vector4f = this.phongLighting.computeColor(this.material, this.lights, normal, vertex);

        if (this.fog !== null) {
            vertexColor = this.fog.computeVertexColor(vertexColor, vertex);
        }

        return new Color(
            Math.min(255, vertexColor.x * 255),
            Math.min(255, vertexColor.y * 255),
            Math.min(255, vertexColor.z * 255),
            255
        );
    }

}
