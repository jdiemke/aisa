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
import { ModelViewMatrix } from '../md2/ModelViewMatrix';

import './style.css';

export class ThirdPersonCameraScene extends AbstractScene {

    private static readonly CLEAR_COLOR: number = Color.SLATE_GRAY.toPackedFormat();

    private soundManager: SoundManager = new SoundManager();
    private ground: Texture;
    private modelViewMatrix: ModelViewMatrix = new ModelViewMatrix();
    private floor: TexturedMesh;
    public textureBackground: Texture;
    private texturedRenderingPipeline: TexturingRenderingPipeline;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.texturedRenderingPipeline = new TexturingRenderingPipeline(framebuffer);
        this.texturedRenderingPipeline.enableAlphaBlending();
        this.texturedRenderingPipeline.setAlpha(1.2);

        this.texturedRenderingPipeline.setCullFace(CullFace.DISABLED);

        return Promise.all([
            this.soundManager.loadMusic(require("../../assets/music/muffler_-_aphrodisiae.mod")),
            TextureUtils.load(require('../../assets/psychadelic.png'), false).then(
                (texture: Texture) => this.textureBackground = texture
            ),
            TextureUtils.load(require('../../assets/eye.png'), true).then(
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
     framebuffer.drawScaledTextureClipBi(0,0,this.textureBackground.width, this.textureBackground.height, this.textureBackground, 1.0);




        this.texturedRenderingPipeline.setModelViewMatrix(this.modelViewMatrix.getMatrix());
        framebuffer.setTexture(this.ground);

        for( let i=7; i < 10; i++) {
            framebuffer.clearDepthBuffer();
            this.texturedRenderingPipeline.setAlpha(Math.max(0.9-0.01*i,0)*(Math.sin(time*0.0002)*0.5+0.5)*0.65+0.1);
            this.modelViewMatrix.setIdentity();

            this.modelViewMatrix.translate(
                Math.sin(time*0.001+i*0.3)*1.8,
                Math.cos(time*0.001+i*0.3)*1.4,
                -7+i*0.04);
            this.modelViewMatrix.rotate(1, 0, 0,   Math.sin(time*0.001+i*0.2)*35);
            this.modelViewMatrix.rotate(0, 1, 0,   Math.sin(time*0.001+i*0.2)*35);
            this.modelViewMatrix.rotate(0, 0, 1,180+Math.sin(time*0.001+i*0.2)*10);
            this.modelViewMatrix.rotate(1, 0, 0, 90);
            const scale= 1+ (1.2)*0.5 *i;
            this.modelViewMatrix.scal(scale, scale, scale);

            this.texturedRenderingPipeline.draw(framebuffer, this.floor);
        }

       // framebuffer.drawFog(new Color(20,20,20,45),0.04, 0.15);
    }

    private computeModelViewTransformation(time: number): void {

    }



}
