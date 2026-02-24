import * as Stats from 'stats.js';

/**
 * Manages the three stats.js performance panels (Memory, FPS, MS)
 * and mounts them to the document body.
 */
export class DemoStats {

    private stats: Array<Stats> = [];

    /**
     * Creates and mounts the three performance panels.
     *
     * @param width   Canvas width in CSS pixels – used to position panels
     *                so they sit at `width * 2` from the left edge.
     */
    public init(width: number): void {
        this.initPanel(2, 0,   width * 2);  // Memory (MB)
        this.initPanel(0, 50,  width * 2);  // FPS
        this.initPanel(1, 100, width * 2);  // MS per frame
    }

    /**
     * Ticks every stats.js panel. Call once per animation frame.
     */
    public update(): void {
        for (const p of this.stats) {
            p.update();
        }
    }

    // -------------------------------------------------------------------------

    private initPanel(panel: number, top: number, left: number): void {
        this.stats.push(new Stats());
        const statsObj = this.stats[this.stats.length - 1];
        statsObj.showPanel(panel);
        statsObj.dom.style.cssText = `position:absolute;top:${top}px;left:${left}px;`;
        document.body.appendChild(statsObj.dom);
    }
}
