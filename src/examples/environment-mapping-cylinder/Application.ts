import { Canvas } from '../../Canvas';
import { EnvironmentMappingCylinderScene } from './EnvironmentMappingCylinderScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new EnvironmentMappingCylinderScene());
        canvas.init();
    }

}

Application.main();
