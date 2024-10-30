import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Vector4f } from '../../math/index';
import { TexturedMesh } from '../../rendering-pipelines/TexturedMesh';
import { TexturingRenderingPipeline } from '../../rendering-pipelines/TexturingRenderingPipeline';
import { AbstractScene } from '../../scenes/AbstractScene';
import { SoundManager } from '../../sound/SoundManager';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { TextureCoordinate } from '../../TextureCoordinate';
import { FeedbackRadialBlur } from '../feedback-radial-blur/FeedbackRadialBlur';
import { ModelViewMatrix } from '../md2/ModelViewMatrix';
import { TextZoomScene } from '../text-zoom/TextZoomScene';
import { TextZoomerScene } from '../text-zoomer/TextZoomerScene';

import './style.css';

export class ThirdPersonCameraScene extends AbstractScene {

    private static readonly CLEAR_COLOR: number = Color.BLACK.toPackedFormat();

    private soundManager: SoundManager = new SoundManager();
    private ground: Texture;
    private modelViewMatrix: ModelViewMatrix = new ModelViewMatrix();
    private floor: TexturedMesh;
    public textureBackground: Texture;
    private texturedRenderingPipeline: TexturingRenderingPipeline;
    private scene: FeedbackRadialBlur;
    private scene2: TextZoomerScene;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.texturedRenderingPipeline = new TexturingRenderingPipeline(framebuffer);
        this.texturedRenderingPipeline.enableAlphaBlending();
        this.texturedRenderingPipeline.setAlpha(1.2);
        this.scene = new FeedbackRadialBlur();
        this.scene2 = new TextZoomerScene();

        this.texturedRenderingPipeline.setCullFace(CullFace.DISABLED);

        return Promise.all([
            this.scene.init(framebuffer),
            this.scene2.init(),
            this.soundManager.loadMusic(require("@assets/music/muffler_-_aphrodisiae.mod")),
            TextureUtils.load(require('@assets/psychadelic.png'), false).then(
                (texture: Texture) => this.textureBackground = texture
            ),
            TextureUtils.load(require('@assets/eye.png'), true).then(
                (texture: Texture) => this.ground = texture)
        ]);
    }

    public onInit(): void {


        const mesh: TexturedMesh = new TexturedMesh();
        const size = 10.0;
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

        const button: HTMLButtonElement = document.createElement("button");
        button.textContent = "Start Music";
        document.getElementsByTagName("body")[0].appendChild(button);
        button.addEventListener ("click", ()=> {

            this.soundManager.onPause();
            this.soundManager.onPlay()
        });
    }



    public render(framebuffer: Framebuffer, time: number): void {
        framebuffer.clearColorBuffer(ThirdPersonCameraScene.CLEAR_COLOR);
     //   framebuffer.clearDepthBuffer();

     //framebuffer.drawScaledTextureClipBi(0,0,this.textureBackground.width, this.textureBackground.height, this.textureBackground, 1.0);



       framebuffer.setTexture(this.ground);

        for( let i=0; i < 1; i++) {
            framebuffer.clearDepthBuffer();

            this.modelViewMatrix.setIdentity();

            this.modelViewMatrix.translate(0,0,-70+((time*0.06)%70));
            this.texturedRenderingPipeline.setAlpha(((time*0.06)%70)/70);
           this.modelViewMatrix.zRotate((time*0.006)%70);
            this.modelViewMatrix.rotate(1, 0, 0,90);
            this.texturedRenderingPipeline.setModelViewMatrix(this.modelViewMatrix.getMatrix());

            this.texturedRenderingPipeline.draw(framebuffer, this.floor);
        }
        this.scene2.effect(framebuffer, time,(Math.sin(time*0.0002)*0.5 +0.5)*0.2+0.1);
        this.scene.applyRadialBlur(framebuffer,time);


       // framebuffer.drawFog(new Color(20,20,20,45),0.04, 0.15);
    }

    private computeModelViewTransformation(time: number): void {

    }



}
