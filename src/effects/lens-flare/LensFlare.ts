import { Framebuffer } from '@engine/rendering/Framebuffer';
import { Vector3f, Interpolator } from '@engine/math';
import { Texture } from '@engine/texture';

export class LensFlare {

    private lensFlareVisible = false;
    private lensFlareStart = 0;
    private lensFlareEnd = 0;

    public drawLensFlare(framebuffer: Framebuffer, screenPos: Vector3f, elapsedTime: number, texture: Array<{ tex: Texture, scale: number, alpha: number }>, dirt: Texture): void {
        const pos = screenPos;

        if (pos.z < 0 &&
            pos.x > 0 && pos.x < framebuffer.width &&
            pos.y > 0 && pos.y < framebuffer.height &&
            framebuffer.wBuffer[pos.x + (pos.y * framebuffer.width)] > (1 / pos.z)) {
            if (!this.lensFlareVisible) {
                this.lensFlareVisible = true;
                this.lensFlareStart = elapsedTime;
            }
        } else {
            if (this.lensFlareVisible) {
                this.lensFlareVisible = false;
                this.lensFlareEnd = elapsedTime;
            }
        }

        let scale = Interpolator.interpolate(this.lensFlareStart, this.lensFlareStart + 100, elapsedTime);
        if (this.lensFlareVisible !== true) {
            scale *= (1 - Interpolator.interpolate(this.lensFlareEnd, this.lensFlareEnd + 100, elapsedTime));
        }
        const dir = new Vector3f(framebuffer.width / 2, framebuffer.height / 2, 0).sub(pos);

        if (scale > 0) {
            for (let i = 0; i < texture.length; i++) {
                const temp = pos.add(dir.mul(texture[i].scale));
                framebuffer.drawTexture(Math.round(temp.x) - texture[i].tex.width / 2, Math.round(temp.y) - texture[i].tex.height / 2, texture[i].tex, texture[i].alpha * scale);
            }
        }

        // this.drawTextureRectAdd(0, 0, 0, 0, this.width, this.height, dirt, 0.03 + 0.15 * scale);
        framebuffer.scaleClipBlitter.drawScaledTextureClipBi(0, 0, framebuffer.width, framebuffer.height, dirt, 0.15 + 0.20 * scale*0);
    }

}