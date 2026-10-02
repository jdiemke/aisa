import { Color } from '../../core/Color';
import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { SoundManager } from '../../sound/SoundManager';

import './style.css';

export class VuMeterScene extends AbstractScene {

    private static readonly BACKGROUND_COLOR: number = Color.SLATE_GRAY.toPackedFormat();
    private static readonly BAR_COLOR: number = Color.GREEN.toPackedFormat();

    private static readonly BAR_COUNT: number = 4;
    private static readonly BAR_WIDTH: number = 28;
    private static readonly BAR_HEIGHT: number = 150;

    private soundManager: SoundManager = new SoundManager();

    public init(): Promise<any> {
        // Map each bar to the sample/instrument number that drives it.
        this.soundManager.configureChannels([17, 16, 11, 13]);
        return Promise.all([
            this.soundManager.loadMusic(require('@assets/sound/showeroflove.mod'))
        ]);
    }

    public onInit(): void {
        const startButton: HTMLButtonElement = document.createElement('button');
        startButton.textContent = 'Start Music';
        document.getElementsByTagName('body')[0].appendChild(startButton);
        startButton.addEventListener('click', () => {
            this.soundManager.onPause();
            this.soundManager.onPlay();
        });

        const stopButton: HTMLButtonElement = document.createElement('button');
        stopButton.textContent = 'Stop Music';
        stopButton.style.marginLeft = '8px';
        document.getElementsByTagName('body')[0].appendChild(stopButton);
        stopButton.addEventListener('click', () => {
            this.soundManager.onPause();
        });
    }

    public render(framebuffer: Framebuffer): void {
        framebuffer.clearColorBuffer(VuMeterScene.BACKGROUND_COLOR);
        this.soundManager.updateChannelLevels();
        this.drawBars(framebuffer);
    }

    private drawBars(framebuffer: Framebuffer): void {
        const totalBarsWidth = VuMeterScene.BAR_COUNT * VuMeterScene.BAR_WIDTH;
        const spacingCount = VuMeterScene.BAR_COUNT - 1;
        const availableSpacing = framebuffer.width - totalBarsWidth;
        const spacing = Math.max(12, Math.floor(availableSpacing / (spacingCount + 2)));
        const usedWidth = totalBarsWidth + spacingCount * spacing;
        const startX = Math.floor((framebuffer.width - usedWidth) / 2);

        const centerY = Math.floor(framebuffer.height / 2);
        const barTop = centerY - Math.floor(VuMeterScene.BAR_HEIGHT / 2);
        const barBottom = barTop + VuMeterScene.BAR_HEIGHT;

        const levels = this.soundManager.musicProperties.channels;
        if (!levels) {
            return;
        }

        for (let i = 0; i < VuMeterScene.BAR_COUNT; i++) {
            const x = startX + i * (VuMeterScene.BAR_WIDTH + spacing);
            const filledHeight = Math.floor(levels[i] * VuMeterScene.BAR_HEIGHT);
            const y = barBottom - filledHeight;

            if (filledHeight > 0) {
                framebuffer.drawRect2(x, y, VuMeterScene.BAR_WIDTH, filledHeight, VuMeterScene.BAR_COLOR);
            }
        }
    }

}
