import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { MD2Loader } from './md2/MD2Loader';

/**
 * http://tfc.duke.free.fr/coding/md2-specs-en.html
 * https://github.com/mrdoob/three.js/tree/dev/examples/models/md2/ogro
 * http://tfc.duke.free.fr/old/models/md2.htm
 */
export class MetalHeadzScene extends AbstractScene {

    public init(framebuffer: Framebuffer): Promise<any> {
        return Promise.all([
            MD2Loader.load(require('../../assets/md2/ogro.md2'))
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        framebuffer.clear();
     }

}
