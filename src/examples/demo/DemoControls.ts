import { SoundManager } from '../../sound/SoundManager';
import { CanvasRecorder } from './canvas-record';

/**
 * Wires up all playback controls (buttons, keyboard, scroll wheel, timeline
 * slider) and owns the HUD DOM references used to display current time and
 * scene number.
 */
export class DemoControls {

    private soundManager: SoundManager;
    private canvasRecorder: CanvasRecorder;
    private canvasRef: HTMLCanvasElement;
    private getSceneCount: () => number;

    // HUD display refs
    private timelineRef: HTMLInputElement;
    private sceneRef: HTMLSpanElement;
    private timeRef: HTMLSpanElement;

    /**
     * Resolves DOM elements, sizes the debug panel, and binds all events.
     *
     * @param soundManager    Shared SoundManager instance
     * @param canvasRecorder  Shared CanvasRecorder instance
     * @param canvasRef       The main render canvas
     * @param width           Canvas width in CSS pixels (used to size the debug bar)
     * @param getSceneCount   Returns the current total number of scenes (live getter)
     */
    public init(
        soundManager: SoundManager,
        canvasRecorder: CanvasRecorder,
        canvasRef: HTMLCanvasElement,
        width: number,
        getSceneCount: () => number
    ): void {
        this.soundManager = soundManager;
        this.canvasRecorder = canvasRecorder;
        this.canvasRef = canvasRef;
        this.getSceneCount = getSceneCount;

        document.getElementById('debug').style.width = `${width * 2}px`;

        this.timelineRef = document.getElementById('timeline') as HTMLInputElement;
        this.sceneRef    = document.getElementById('scene')    as HTMLSpanElement;
        this.timeRef     = document.getElementById('time')     as HTMLSpanElement;

        this.bindEvents();
    }

    /**
     * Updates the HUD timeline slider, localStorage timestamp, and the
     * scene / time display spans. Call once per render frame.
     *
     * @param soundManager  Shared SoundManager carrying current music state
     */
    public draw(soundManager: SoundManager): void {
        this.timelineRef.value = String(soundManager.musicProperties.timeMilliseconds);
        localStorage.setItem('lastTime', String(soundManager.musicProperties.timeSeconds));

        if (!soundManager.syncDevice.connected && !soundManager.demoMode) {
            console.error('Rocket not connected.');
            return;
        }

        this.sceneRef.innerText = soundManager.musicProperties.sceneData.effect.toString();
        this.timeRef.innerText  = soundManager.musicProperties.timeSeconds.toFixed(2);
    }

    // -------------------------------------------------------------------------

    private bindEvents(): void {
        const tickerPlayRef       = document.getElementById('ticker_play');
        const tickerStopRef       = document.getElementById('ticker_stop');
        const tickerNextRef       = document.getElementById('ticker_next');
        const tickerBackRef       = document.getElementById('ticker_back');
        const tickerRecordRef     = document.getElementById('ticker_record');
        const tickerScreenshotRef = document.getElementById('ticker_screenshot');
        const tickerVolumeRef     = document.getElementById('ticker_volume');

        // Stop — also saves any in-progress recording
        tickerStopRef.addEventListener('click', () => {
            this.soundManager.onPause();
            this.soundManager.seek(0);
            tickerPlayRef.classList.add('fa-play');
            tickerPlayRef.classList.remove('fa-pause');

            if (this.canvasRecorder.recording) {
                tickerRecordRef.style.color = 'white';
                this.canvasRecorder.saveVideo();
            }
        });

        // Record video (toggle)
        tickerRecordRef.addEventListener('click', () => {
            if (!this.canvasRecorder.recording) {
                tickerRecordRef.style.color = 'red';
                this.soundManager.onPlay();
                this.canvasRecorder.recordVideo();
                tickerPlayRef.classList.remove('fa-play');
                tickerPlayRef.classList.add('fa-pause');
            } else {
                tickerRecordRef.style.color = 'white';
                this.soundManager.onPause();
                this.canvasRecorder.saveVideo();
                tickerPlayRef.classList.add('fa-play');
                tickerPlayRef.classList.remove('fa-pause');
            }
        });

        // Play / Pause (toggle)
        tickerPlayRef.addEventListener('click', () => {
            if (!this.soundManager.isPlaying) {
                this.soundManager.onPlay();
                tickerPlayRef.setAttribute('title', 'pause');
                tickerPlayRef.classList.remove('fa-play');
                tickerPlayRef.classList.add('fa-pause');
            } else {
                this.soundManager.onPause();
                tickerPlayRef.setAttribute('title', 'play');
                tickerPlayRef.classList.add('fa-play');
                tickerPlayRef.classList.remove('fa-pause');
            }
        });

        // Toggle audio mute and persist preference
        tickerVolumeRef.addEventListener('click', () => {
            this.soundManager.toggleSound(tickerVolumeRef, !this.soundManager.audioElement.muted);
            localStorage.setItem('soundToggle', String(this.soundManager.audioElement.muted));
        });

        // Save screenshot as PNG
        tickerScreenshotRef.addEventListener('click', () => {
            const date     = new Date();
            const fileName = `Aisa ${date.toISOString().slice(0, 10)} at ${date
                .toTimeString()
                .slice(0, 8)
                .replace(/:/g, '.')}.png`;
            const image  = this.canvasRef.toDataURL('image/png').replace('image/png', 'image/octet-stream');
            const anchor = document.createElement('a');
            anchor.setAttribute('download', fileName);
            anchor.setAttribute('href', image);
            anchor.click();
        });

        // Jump to next effect
        tickerNextRef.addEventListener('click', () => {
            this.soundManager.jump(this.soundManager.musicProperties.timeSeconds, 1, this.getSceneCount());
        });

        // Jump to previous effect
        tickerBackRef.addEventListener('click', () => {
            this.soundManager.jump(this.soundManager.musicProperties.timeSeconds, -1, this.getSceneCount());
        });

        // Timeline seek via slider
        this.timelineRef.addEventListener('input', (e) => {
            const time = Number((e.target as HTMLInputElement).value);
            this.soundManager.seek(time / 1000);
        });

        // Fine seek via scroll wheel
        document.addEventListener('wheel', (e) => {
            const delta = (e.deltaY < 0) ? -0.06 : 0.06;
            this.soundManager.seek(this.soundManager.audioElement.currentTime + delta);
            e.preventDefault();
            e.stopPropagation();
        }, { passive: false });

        // Keyboard navigation
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            switch (e.key) {
                case 'MediaStop':
                    tickerStopRef.click();
                    break;
                case 'MediaPlayPause':
                case ' ':
                    tickerPlayRef.click();
                    break;
                case 'ArrowLeft':
                    this.soundManager.seek(this.soundManager.audioElement.currentTime - 0.06);
                    break;
                case 'ArrowRight':
                    this.soundManager.seek(this.soundManager.audioElement.currentTime + 0.06);
                    break;
                case 'MediaTrackNext':
                case 'ArrowUp':
                    this.soundManager.jump(this.soundManager.audioElement.currentTime, 1, this.getSceneCount());
                    break;
                case 'MediaTrackPrevious':
                case 'ArrowDown':
                    this.soundManager.jump(this.soundManager.audioElement.currentTime, -1, this.getSceneCount());
                    break;
                case 'f':
                    this.canvasRef.click();
                    break;
                case 's':
                    tickerScreenshotRef.click();
                    break;
                case 'r':
                    tickerRecordRef.click();
                    break;
                case 'd':
                    break;
            }
        });
    }
}
