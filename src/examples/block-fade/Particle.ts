export class Particle {
    public x: number;
    public y: number;
    public _color: number;

    private _x: number;
    private _y: number;
    private dx: number;
    private dy: number;

    private TTL: number = Math.round(Math.random() * 50);
    private time: number;
    private isLiving: boolean;
    private width: number;
    private height: number;

    constructor(x: number, y: number, _color: number, width: number, height: number) {
        this._x = this.x = x;
        this._y = this.y = y;

        this.dx = 0;
        this.dy = - (Math.random() * (3 - 0.1) + 0.1);
        this.time = 0;
        this._color = 0xFF000000 | _color;

        this.isLiving = true;

        this.width = width;
        this.height = height;
    }

    update(): boolean {
        if (!this.isLiving) return false;

        this.x = Math.round((this._x += this.dx) + 0.5);
        this.y = Math.round((this._y += this.dy) + 0.5);

        const a = ((this.TTL - this.time) / this.TTL);
        const r = Math.round((this._color >> 16 & 0xFF) * a + 0.5);
        const g = Math.round((this._color >> 8 & 0xFF) * a + 0.5);
        const b = Math.round((this._color & 0xFF) * a + 0.5);

        this._color = 0xFF << 24 | r << 16 | g << 8 | b;

        if (this.x < 0 || this.x >= this.width) this.isLiving = false;
        if (this.y < 0 || this.y >= this.height) this.isLiving = false;
        if (this.time++ >= this.TTL) this.isLiving = false;
        return this.isLiving;
    }
}