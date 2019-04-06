import 'jsxm/xm';
import 'jsxm/xmeffects';

export class SoundManager {

    public constructor() {
        XMPlayer.init();
    }

    public playExtendedModule(filename: string): void {
        fetch(filename)
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
