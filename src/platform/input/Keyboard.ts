export class Keyboard {

    public static LEFT: number = 37;
    public static UP: number = 38;
    public static RIGHT: number = 39;
    public static DOWN: number = 40;
    public static KEY_A: number = 65;
    public static KEY_D: number = 68;
    public static KEY_F: number = 70;
    public static KEY_L: number = 76;
    public static KEY_R: number = 82;
    public static KEY_S: number = 83;
    public static SPACE: number = 32;

    private pressed: Array<boolean>;
    private keyDownListeners: Array<(event: KeyboardEvent) => void> = [];
    private keyUpListeners: Array<(event: KeyboardEvent) => void> = [];

    constructor() {
        this.pressed = new Array<boolean>(256);
        this.pressed.fill(false);

        window.addEventListener('keyup', (event: KeyboardEvent) => this.onKeyUp(event), false);
        window.addEventListener('keydown', (event: KeyboardEvent) => this.onKeyDown(event), false);
    }

    public isDown(code: number): boolean {
        return this.pressed[code];
    }

    public onKeyDown(event: KeyboardEvent): void {
        this.pressed[event.keyCode] = true;
        for (const listener of this.keyDownListeners) {
            listener(event);
        }
    }

    public onKeyUp(event: KeyboardEvent): void {
        this.pressed[event.keyCode] = false;
        for (const listener of this.keyUpListeners) {
            listener(event);
        }
    }

    public addKeyDownListener(listener: (event: KeyboardEvent) => void): void {
        this.keyDownListeners.push(listener);
    }

    public removeKeyDownListener(listener: (event: KeyboardEvent) => void): void {
        const index = this.keyDownListeners.indexOf(listener);
        if (index !== -1) {
            this.keyDownListeners.splice(index, 1);
        }
    }

    public addKeyUpListener(listener: (event: KeyboardEvent) => void): void {
        this.keyUpListeners.push(listener);
    }

    public removeKeyUpListener(listener: (event: KeyboardEvent) => void): void {
        const index = this.keyUpListeners.indexOf(listener);
        if (index !== -1) {
            this.keyUpListeners.splice(index, 1);
        }
    }

}
