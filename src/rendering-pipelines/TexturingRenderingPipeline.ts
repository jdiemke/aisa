import { Framebuffer } from "../Framebuffer";
import { Matrix4f } from "../math/Matrix4f";
import { Vertex } from "../Vertex";

export class TexturingRenderingPipeline {

    constructor(private framebuffer: Framebuffer) { }

    public draw(obj: any, modelViewMartrix: Matrix4f) {

        // let normalMatrix = modelViewMartrix.computeNormalMatrix();

        // for (let i = 0; i < obj.normals.length; i++) {
        //     normalMatrix.multiplyHomArr(obj.normals[i], obj.normals2[i]);
        // }

        for (let i = 0; i < obj.points.length; i++) {
            modelViewMartrix.multiplyHomArr(obj.points[i], obj.points2[i]);
        }

        let vertexArray = new Array<Vertex>(new Vertex(), new Vertex(), new Vertex());

        for (let i = 0; i < obj.faces.length; i++) {
            let v1 = obj.points2[obj.faces[i].vertices[0]];
            let v2 = obj.points2[obj.faces[i].vertices[1]];
            let v3 = obj.points2[obj.faces[i].vertices[2]];

            if (this.framebuffer.isInFrontOfNearPlane(v1) && this.framebuffer.isInFrontOfNearPlane(v2) && this.framebuffer.isInFrontOfNearPlane(v3)) {
                let p1 = this.framebuffer.project(v1);
                let p2 = this.framebuffer.project(v2);
                let p3 = this.framebuffer.project(v3);

                if (this.framebuffer.isTriangleCCW(p1, p2, p3)) {
                    let color = 255;

                    vertexArray[0].position = p1;
                    vertexArray[0].textureCoordinate = obj.uv[obj.faces[i].uv[0]];

                    vertexArray[1].position = p2;
                    vertexArray[1].textureCoordinate = obj.uv[obj.faces[i].uv[1]];

                    vertexArray[2].position = p3;
                    vertexArray[2].textureCoordinate = obj.uv[obj.faces[i].uv[2]];

                    this.framebuffer.clipConvexPolygon2(vertexArray, color);
                }
            } else if (!this.framebuffer.isInFrontOfNearPlane(v1) && !this.framebuffer.isInFrontOfNearPlane(v2) && !this.framebuffer.isInFrontOfNearPlane(v3)) {
                continue;
            } else {
                let color = 255;

                vertexArray[0].position = v1;
                vertexArray[0].textureCoordinate = obj.uv[obj.faces[i].uv[0]];

                vertexArray[1].position = v2;
                vertexArray[1].textureCoordinate = obj.uv[obj.faces[i].uv[1]];

                vertexArray[2].position = v3;
                vertexArray[2].textureCoordinate = obj.uv[obj.faces[i].uv[2]];

                this.zClipTriangle2(vertexArray, color);
            }
        }
    }

    public zClipTriangle2(subject: Array<Vertex>, color: number): void {

        let output = subject;

        let input = output;
        output = new Array<Vertex>();
        let S = input[input.length - 1];

        for (let i = 0; i < input.length; i++) {
            let point = input[i];
            if (this.framebuffer.isInFrontOfNearPlane(point.position)) {
                if (!this.framebuffer.isInFrontOfNearPlane(S.position)) {
                    output.push(this.framebuffer.computeNearPlaneIntersection2(S, point));
                }
                output.push(point);
            } else if (this.framebuffer.isInFrontOfNearPlane(S.position)) {
                output.push(this.framebuffer.computeNearPlaneIntersection2(S, point));
            }
            S = point;
        }

        if (output.length < 3) {
            return;
        }

        let projected: Vertex[] = output.map<Vertex>((v) => {
            v.position = this.framebuffer.project(v.position);
            return v;
        })

        if (output.length === 3 && !this.framebuffer.isTriangleCCW(projected[0].position, projected[1].position, projected[2].position)) {
            return;
        }

        if (output.length === 4 && !this.framebuffer.isTriangleCCW2(projected[0].position, projected[1].position, projected[2].position, projected[3].position)) {
            return;
        }
        //if (this.isTriangleCCW(projected[0], projected[1], projected[2])) {
        //this.clipConvexPolygon(projected, color, true);
        this.framebuffer.clipConvexPolygon2(projected, color);
        // }
    }

}
