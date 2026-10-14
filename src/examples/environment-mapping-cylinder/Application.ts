import { Canvas } from '@platform/browser';
import { EnvironmentMappingCylinderScene } from './EnvironmentMappingCylinderScene';

import '../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new EnvironmentMappingCylinderScene());
        canvas.init();
    }

}

Application.main();
