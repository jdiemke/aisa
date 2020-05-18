import 'jsxm/xm';
import 'jsxm/xmeffects';

export class SoundManager {

    public constructor() {
        XMPlayer.init();

        // One-liner to resume playback when user interacted with the page.
        'click mouseover touchmove'.split(' ').forEach((e) => {
            window.addEventListener(e, ()=>{
                if (XMPlayer.audioctx.state !== 'running') {
                    XMPlayer.audioctx.resume();
                }
            });
        });
    }

    public playExtendedModule(filename: any): void {
        fetch(filename.default)
            .then((response: Response) => response.arrayBuffer())
            .then((arrayBuffer: ArrayBuffer) => {
                if (arrayBuffer) {
                    XMPlayer.load(arrayBuffer);
                    XMPlayer.play();
                } else {
                    console.log('unable to load', filename);
                }
            });
    }

}
