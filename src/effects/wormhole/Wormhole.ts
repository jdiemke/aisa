import type { Framebuffer } from '../../Framebuffer';
import type { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';

export class Wormhole {

    public directionX = 1;
    public directionY = -1;
    private texture: Texture;
    private lookup: Uint8Array;
    private palette = new Uint32Array(225);
    private offsetX = 0;
    private offsetY = 0;
    private lastStep = 0;

    public init(framebuffer: Framebuffer): Promise<void> {
        return TextureUtils.load(require('@assets/wormhole/texture.png'), false).then(texture => {
            this.texture = texture;
            this.generateLUT(framebuffer);
        });
    }

    public generateLUT(framebuffer: Framebuffer): void {
        const { width, height } = framebuffer;
        const spokes = 2400;
        const divisions = spokes / 2;
        const centerX = Math.floor(width / 2);
        const centerY = Math.floor(height / 2) - Math.floor(height / 4);
        const cosine = new Float64Array(spokes);
        const sine = new Float64Array(spokes);
        this.lookup = new Uint8Array(width * height);

        for (let i = 0; i < spokes; i++) {
            const angle = 2 * Math.PI * i / spokes;
            cosine[i] = Math.cos(angle);
            sine[i] = Math.sin(angle);
        }
        for (let j = 1; j < divisions - 1; j++) {
            const z = -1 + Math.log(2 * j / divisions);
            const radiusX = 1 + width * j / divisions;
            const radiusY = 1 + height * j / divisions;
            const row = (Math.floor(j / 8) % 15) * 15;
            for (let i = 0; i < spokes; i++) {
                const x = radiusX * cosine[i] + centerX;
                const y = radiusY * sine[i] - 35 * z + centerY;
                if (x >= 0 && x < width && y >= 0 && y < height) {
                    this.lookup[Math.floor(x) + Math.floor(y) * width] = Math.floor(i / 8) % 15 + row;
                }
            }
        }
    }

    public render(framebuffer: Framebuffer, time: number): void {
        const step = Math.floor(time * 30 / 1000);
        const elapsedSteps = step - this.lastStep;
        this.lastStep = step;
        this.offsetX = this.wrap(this.offsetX - this.directionX * elapsedSteps);
        this.offsetY = this.wrap(this.offsetY - this.directionY * elapsedSteps);

        for (let y = 0; y < 15; y++) {
            const sourceRow = ((y + this.offsetY) % 15) * 15;
            for (let x = 0; x < 15; x++) {
                this.palette[x + y * 15] = this.texture.texture[(x + this.offsetX) % 15 + sourceRow];
            }
        }

        for (let i = 0; i < this.lookup.length; i++) {
            framebuffer.framebuffer[i] = this.palette[this.lookup[i]];
        }
    }

    private wrap(value: number): number {
        return ((value % 15) + 15) % 15;
    }
}
