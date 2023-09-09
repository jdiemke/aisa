import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { TextureCoordinate } from '../../TextureCoordinate';
import { Vector4f } from '../../math';
import { TexturedMesh } from '../../rendering-pipelines/TexturedMesh';
import { TexturingRenderingPipeline } from '../../rendering-pipelines/TexturingRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { FeedbackRadialBlur } from '../feedback-radial-blur/FeedbackRadialBlur';
import { ModelViewMatrix } from '../md2/ModelViewMatrix';


export class RotoZoomerScene extends AbstractScene {

    private logoTexture: Texture;
    private floor: TexturedMesh;
    private modelViewMatrix: ModelViewMatrix;
    private logo: Texture;
    private face: Texture;
    private ground: Texture;
    scene: FeedbackRadialBlur;
    private texturedRenderingPipeline: TexturingRenderingPipeline;

    public init(framebuffer: Framebuffer): Promise<any> {

        this.modelViewMatrix = new ModelViewMatrix();
        this.texturedRenderingPipeline = new TexturingRenderingPipeline(framebuffer);
        this.texturedRenderingPipeline.enableAlphaBlending();
        this.texturedRenderingPipeline.setAlpha(1.0);

        this.texturedRenderingPipeline.setCullFace(CullFace.DISABLED);
        this.scene = new FeedbackRadialBlur();
        return Promise.all([
            this.scene.init(framebuffer),
            TextureUtils.load(require('../../assets/meth.png'), true).then(
                (texture: Texture) => this.logo = texture
            ),
            TextureUtils.load(require('../../assets/xray.png'), false).then(
                (texture: Texture) => this.logoTexture = texture
            ),
            TextureUtils.load(require('../../assets/face.png'), true).then(
                (texture: Texture) => this.face = texture
            ),
            TextureUtils.load(require('../../assets/hlm.png'), true).then(
                (texture: Texture) => this.ground = texture)
        ]);
    }

    public onInit(): void {


        const mesh: TexturedMesh = new TexturedMesh();
        const size = 1.0;
        const height = 0;
        mesh.points = [
            new Vector4f(-size, -height, size),
            new Vector4f(size, -height, size),
            new Vector4f(size, -height, -size),
            new Vector4f(-size, -height, -size),
        ];
        mesh.uv = [
            new TextureCoordinate(0, 0),
            new TextureCoordinate(1.0, 0),
            new TextureCoordinate(1.0, 1.0),
            new TextureCoordinate(0, 1.0)
        ];
        mesh.points2 = mesh.points.map(() => new Vector4f(0, 0, 0, 0));
        mesh.faces = [
            {
                uv: [0, 1, 2],
                vertices: [0, 1, 2]
            },
            {
                uv: [2, 3, 0],
                vertices: [2, 3, 0]
            }
        ];
        this.floor = mesh;


    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.drawRotoZoomer(framebuffer, time);

        //framebuffer.drawTexture(33,35,this.logo,1.2);

        const scale = (Math.sin(time * 0.0002)*0.5+0.5)*130+370;
        const scale2 = 2.1;
         this.logo.setClamp(false);
         for(let y = 0; y < 200; y++) {
             for(let x = 0; x < 320; x++) {
                 const xoff = (Math.sin(time*0.00041+y*0.022)*0.5+0.5) *scale+time*0.001;
                 const yoff = (Math.cos(time*0.00042+x*0.016)*0.5+0.5) *scale+time*0.002;


                 const texturePixel =this.logo.getBilinearFilteredPixel2(x*scale2+xoff, y*scale2+yoff);
                 const framebufferPixel =framebuffer.framebuffer[x + y * 320];
                 const alpha = ((texturePixel>>24)&0xff)/255* (Math.sin(time * 0.02)*0.5+0.5)*1.2;
                 const inverseAlpha = 1 - alpha;
                 const r = (framebufferPixel >> 0 & 0xff) * inverseAlpha + (texturePixel >> 0 & 0xff) * alpha;
                 const g = (framebufferPixel >> 8 & 0xff) * inverseAlpha + (texturePixel >> 8 & 0xff) * alpha;
                 const b = (framebufferPixel >> 16 & 0xff) * inverseAlpha + (texturePixel >> 16 & 0xff) * alpha;

                 framebuffer.framebuffer[x + y * 320]= r | (g << 8) | (b << 16) | (255 << 24);
             }
         }


         this.scene.applyRadialBlur(framebuffer, time);
        this.texturedRenderingPipeline.setModelViewMatrix(this.modelViewMatrix.getMatrix());
        framebuffer.setTexture(this.ground);


            framebuffer.clearDepthBuffer();
            this.texturedRenderingPipeline.setAlpha(Math.max(0.9-0.01,0)*(Math.sin(time*0.0002)*0.5+0.5)*0.5+0.5);
            this.modelViewMatrix.setIdentity();

            this.modelViewMatrix.translate(
               0,0,
                -7);
            this.modelViewMatrix.rotate(1, 0, 0, 180+  Math.sin(time*0.00019)*35);
            this.modelViewMatrix.rotate(0, 1, 0,   Math.sin(time*0.00018)*35+time*0.19);
            this.modelViewMatrix.rotate(0, 0, 1,+Math.sin(time*0.0008)*10);
            this.modelViewMatrix.rotate(1, 0, 0, 90);
            const scale22= 1+ (1.2)*2.5 ;
            this.modelViewMatrix.scal(scale22*0.8, scale22, scale22*0.3);



            this.texturedRenderingPipeline.draw(framebuffer, this.floor);
            framebuffer.drawTexture(179,0,this.face,1);

    }

    drawRotoZoomer(framebuffer: Framebuffer, time: number) {
        const scale = Math.sin(time * 0.0005) + 1.1;

        const yStepX = Math.sin(time * 0.0003) * scale;
        const yStepY = Math.cos(time * 0.0003) * scale;

        const xStepX = yStepY;
        const xStepY = -yStepX;

        let texYCoord = Math.sin(time * 0.0002) * 512;
        let texXCoord = Math.cos(time * 0.0002) * 512;

        let texYCoordInner = 0;
        let texXCoordInner = 0;
        let framebufferPos = 0;

        for (let y = 0; y < framebuffer.height; y++) {
            texXCoordInner = texXCoord;
            texYCoordInner = texYCoord;

            for (let x = 0; x < framebuffer.width; x++) {
                framebuffer.framebuffer[framebufferPos++] = //this.logoTexture.texture[(texXCoordInner & 127) + (texYCoordInner & 127) * 128];
                this.logoTexture.getBilinearFilteredPixel2(texXCoordInner, texYCoordInner);

                texXCoordInner += xStepX;
                texYCoordInner += xStepY;
            }

            texXCoord += yStepX;
            texYCoord += yStepY;
        }
    }


}
