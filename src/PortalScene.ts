import { AbstractScene } from "./scenes/AbstractScene";
import { CullFace } from "./CullFace";
import Framebuffer from "./Framebuffer";

export class PortalScene extends AbstractScene {

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.setCullFace(CullFace.BACK);
        framebuffer.setupCamera();

        return Promise.all([]);
    }

    public render(framebuffer: any): void {
        framebuffer.drawPortalEngine();
    }

}