import * as Matter from 'matter-js';
import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Vector3f, Vector4f } from '../../math';
import { Color } from '../../core/Color';
import { TexturedTriangleRasterizer } from '../../rasterizer/TexturedTriangleRasterizer';
import { Vertex } from '../../Vertex';
import { TextureCoordinate } from '../../TextureCoordinate';
import { Texture, TextureUtils } from '../../texture';
import { TexturingRenderingPipeline } from '../../rendering-pipelines/TexturingRenderingPipeline';
import { SutherlandHodgmanClipper } from '../../portal-system';
import { SutherlandHodgman2DClipper } from '../../screen-space-clipping/SutherlandHodgman2DClipper';
import { TexturedTriangleRasterizer2D } from '../../rasterizer/TexturedTriangleRasterizer2D';
import { ParallaxScrollingScene } from '../xenusion/ParallaxScrollingScene';

// TODO:
// * write custom triangle rasterizer without bilinear filter, zbuffer support and perspective correct interpolation
// * write 2d clipper code without perspective
export class MatterScene extends AbstractScene {

    private engine: Matter.Engine;
    private lastTime: number = undefined;

    private rasterizer: TexturedTriangleRasterizer2D;
    texture: Texture;
    hoodlumLogo: Texture;
    texturingRenderingPipeline: TexturingRenderingPipeline;
    clipper: SutherlandHodgman2DClipper;
    logoB;
    scene: ParallaxScrollingScene;
    public init(framebuffer: Framebuffer): Promise<any> {
        this.texturingRenderingPipeline = new TexturingRenderingPipeline(framebuffer);
        this.clipper = new SutherlandHodgman2DClipper(framebuffer);
        this.rasterizer = new TexturedTriangleRasterizer2D(framebuffer);
        // create an engine
        this.engine = Matter.Engine.create();
        this.scene = new ParallaxScrollingScene();

        // create two boxes and a ground
        var boxA = Matter.Bodies.rectangle(400, 200 - 1900, 90, 90, { angle: Math.random() * Math.PI, velocity: { x: 1, y: 0.2 } });
        var boxB = Matter.Bodies.rectangle(450, 50 - 900, 80, 120, { angle: Math.random() * 2 * Math.PI });
        var boxC = Matter.Bodies.rectangle(365, -80 - 990, 200, 200, { angle: Math.random() * Math.PI });
        var boxD = Matter.Bodies.rectangle(498, -190 - 900, 83, 110, { angle: Math.random() * 2 * Math.PI });
        var ground = Matter.Bodies.rectangle(400, 608, 810, 60, { isStatic: true });


        // add all of the bodies to the world
        Matter.Composite.add(this.engine.world, [boxA, boxB, boxC, boxD, ground]);

        setInterval(() => {
            let body = Matter.Bodies.rectangle(400, 50 - 900, 80, 80, { angle: Math.random() * 2 * Math.PI });
            Matter.Body.applyForce(body, body.position, { x: 0.1 * Math.sin(Math.random() * Math.PI * 2), y: 0.2 });
            Matter.Composite.add(this.engine.world, [body]);
        }, 400);

        return Promise.all([
            this.scene.init(),
            TextureUtils.load(require('@assets/box.png'), true).then(
                (texture: Texture) => this.texture = texture
            ),
            TextureUtils.load(require('@assets/hoodlumLogo.png'), true).then(
                (texture: Texture) => this.hoodlumLogo = texture
            ),
        ]);
    }

    public onInit(): void {
        this.scene.onInit();
    }

    public render(framebuffer: Framebuffer, time: number) {
        const deltaTimeMs: number = this.getDeltaTime(time);
        Matter.Engine.update(this.engine, deltaTimeMs * 1);

        //framebuffer.clearColorBuffer(Color.DARK_GRAY.toPackedFormat());
        this.scene.render(framebuffer, time);
      

        const bodies = Matter.Composite.allBodies(this.engine.world);

        const v1 = new Vertex();
        const v2 = new Vertex();
        const v3 = new Vertex();
        const v4 = new Vertex();

        framebuffer.setTexture(this.texture)

        for (let i = 0; i < bodies.length; i++) {
          
            if (bodies[i].position.x < -100 ||
                bodies[i].position.x > 850 ||
                bodies[i].position.y > 700
            ) {
                Matter.Composite.remove(this.engine.world, [bodies[i]]);
                continue;
            }
            const vertices = bodies[i].vertices;

           /* 
          for (let j = 0; j < vertices.length; j++) {
            
              framebuffer.drawLineDDANoZ(
                  new Vector3f(vertices[j].x, vertices[j].y, 0).mul(0.4).add(new Vector3f(30, -31, 0)),
                  new Vector3f(vertices[(j + 1) % (vertices.length)].x, vertices[(j + 1) % (vertices.length)].y, 0).mul(0.4).add(new Vector3f(30, -31, 0)),
                  Color.CYAN.toPackedFormat()
              );
          }*/


            v1.projection = this.toInteger(new Vector4f(vertices[0].x, vertices[0].y, -10).mul(0.4).add(new Vector4f(30, -31, 0, 0)));
            v1.textureCoordinate = new TextureCoordinate(0, 0);

            v2.projection = this.toInteger(new Vector4f(vertices[1].x, vertices[1].y, -10).mul(0.4).add(new Vector4f(30, -31, 0, 0)));
            v2.textureCoordinate = new TextureCoordinate(1, 0);

            v3.projection = this.toInteger(new Vector4f(vertices[2].x, vertices[2].y, -10).mul(0.4).add(new Vector4f(30, -31, 0, 0)));
            v3.textureCoordinate = new TextureCoordinate(1, 1);

            v4.projection = this.toInteger(new Vector4f(vertices[3].x, vertices[3].y, -10).mul(0.4).add(new Vector4f(30, -31, 0, 0)));
            v4.textureCoordinate = new TextureCoordinate(0, 1);

            this.clipConvexPolygon(framebuffer, [v1, v2, v3, v4]);
        }
        framebuffer.drawTexture(0, 0, this.hoodlumLogo, 1);
    }

    public clipConvexPolygon(framebuffer: Framebuffer, subject: Array<Vertex>): void {

        let output = subject;

        for (let j = 0; j < framebuffer.clipRegion.length; j++) {
            const edge = framebuffer.clipRegion[j];
            const input = output;
            output = new Array<Vertex>();
            let S = input[input.length - 1];

            for (let i = 0; i < input.length; i++) {
                const point = input[i];
                if (edge.isInside2(point)) {
                    if (!edge.isInside2(S)) {
                        output.push(edge.computeIntersection3(S, point));
                    }
                    output.push(point);
                } else if (edge.isInside2(S)) {
                    output.push(edge.computeIntersection3(S, point));
                }
                S = point;
            }
        }

        if (output.length < 3) {
            return;
        }

        // triangulate new point set
        for (let i = 0; i < output.length - 2; i++) {
           this.rasterizer.drawTriangleDDA(framebuffer, output[0], output[1 + i], output[2 + i]);
        }
    }

    private toInteger(vec: Vector4f): Vector4f {
        return new Vector4f(vec.x | 0, vec.y | 0, vec.z | 0);
    }

    private getDeltaTime(time: number): number {
        if (!this.lastTime) {
            this.lastTime = time;
        }

        const delta = time - this.lastTime;
        this.lastTime = time;
        return delta;
    }
}
