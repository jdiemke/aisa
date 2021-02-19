import { Canvas } from '../../Canvas';
import { FeedbackRadialBlur } from './FeedbackRadialBlur';


class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new FeedbackRadialBlur);
        canvas.init();
    }

}

Application.main();
