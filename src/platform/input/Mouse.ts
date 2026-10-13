export type WheelListener = (event: WheelEvent) => void;

export class Mouse {

    private wheelListeners: Array<WheelListener> = [];
    private boundOnWheel: (event: WheelEvent) => void;

    constructor(private target: EventTarget = document) {
        this.boundOnWheel = (event: WheelEvent) => this.onWheel(event);
        this.target.addEventListener('wheel', this.boundOnWheel as EventListener, { passive: false });
    }

    private onWheel(event: WheelEvent): void {
        for (const listener of this.wheelListeners) {
            listener(event);
        }
    }

    public addWheelListener(listener: WheelListener): void {
        this.wheelListeners.push(listener);
    }

    public removeWheelListener(listener: WheelListener): void {
        const index = this.wheelListeners.indexOf(listener);
        if (index !== -1) {
            this.wheelListeners.splice(index, 1);
        }
    }

    public dispose(): void {
        this.target.removeEventListener('wheel', this.boundOnWheel as EventListener);
        this.wheelListeners = [];
    }

}
