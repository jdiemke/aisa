import { Framebuffer } from "../Framebuffer";
import { Vector3f } from "../math";
import { Interpolator } from "../math/Interpolator";
import { Texture } from "../texture";

export class LensFlare {

    public static drawLensFlare(framebuffer: Framebuffer, screenPos: Vector3f, elapsedTime: number, texture: Array<{ tex: Texture, scale: number, alpha: number }>, dirt: Texture): void {
        const pos = screenPos;

        if (pos.z < 0 &&
            pos.x > 0 && pos.x < framebuffer.width &&
            pos.y > 0 && pos.y < framebuffer.height &&
            framebuffer.wBuffer[pos.x + (pos.y * framebuffer.width)] > (1 / pos.z)) {
            if (!framebuffer.lensFlareVisible) {
                framebuffer.lensFlareVisible = true;
                framebuffer.lensFlareStart = elapsedTime;
            }
        } else {
            if (framebuffer.lensFlareVisible) {
                framebuffer.lensFlareVisible = false;
                framebuffer.lensFlareEnd = elapsedTime;
            }
        }

        let scale = Interpolator.interpolate(framebuffer.lensFlareStart, framebuffer.lensFlareStart + 100, elapsedTime);
        if (framebuffer.lensFlareVisible !== true) {
            scale *= (1 - Interpolator.interpolate(framebuffer.lensFlareEnd, framebuffer.lensFlareEnd + 100, elapsedTime));
        }
        const dir = new Vector3f(framebuffer.width / 2, framebuffer.height / 2, 0).sub(pos);

        if (scale > 0) {
            for (let i = 0; i < texture.length; i++) {
                const temp = pos.add(dir.mul(texture[i].scale));
                framebuffer.drawTexture(Math.round(temp.x) - texture[i].tex.width / 2, Math.round(temp.y) - texture[i].tex.height / 2, texture[i].tex, texture[i].alpha * scale);
            }
        }

        // this.drawTextureRectAdd(0, 0, 0, 0, this.width, this.height, dirt, 0.03 + 0.15 * scale);
        framebuffer.drawScaledTextureClipBi(0, 0, framebuffer.width, framebuffer.height, dirt, 0.15 + 0.20 * scale*0);
    }

}
