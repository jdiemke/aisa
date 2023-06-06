import { Canvas } from '../../Canvas';
import { FeedbackRadialBlur } from './FeedbackRadialBlur';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new FeedbackRadialBlur());
        canvas.init();
    }

}

Application.main();
