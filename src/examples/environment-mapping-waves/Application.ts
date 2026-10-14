import { Canvas } from '@platform/browser';
import { EnvironmentMappingScene } from './EnvironmentMappingWavesScene';

import '../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new EnvironmentMappingScene());
        canvas.init();
    }

}

Application.main();
