import { Canvas } from '../../Canvas';
import { Framebuffer } from '../../Framebuffer';
import { WireframeOutlineScene } from './WireframeOutlineScene';
import { XYOscilloscopeGenerator } from './XYOscilloscopeGenerator';
import { WavEncoder } from './WavEncoder';

class Application {

    public static main(): void {
        const scene = new WireframeOutlineScene();
        const canvas: Canvas = new Canvas(128, 128, scene);
        canvas.init();
        Application.createOscilloscopeControls(canvas, scene);
    }

    private static createOscilloscopeControls(canvas: Canvas, scene: WireframeOutlineScene): void {
        const container = document.getElementById('aisa')!;

        const panel = document.createElement('div');
        panel.style.cssText =
            'margin-top:10px; font-family:sans-serif; font-size:14px;' +
            'display:flex; gap:14px; align-items:center; flex-wrap:wrap;' +
            'padding:6px 0;';

        // ---- Sample Rate ----
        const rateLabel = document.createElement('label');
        rateLabel.textContent = 'Sample Rate: ';
        const rateSelect = document.createElement('select');
        for (const rate of [44100, 22050]) {
            const opt = document.createElement('option');
            opt.value = String(rate);
            opt.textContent = `${rate / 1000} kHz`;
            rateSelect.appendChild(opt);
        }
        rateLabel.appendChild(rateSelect);
        panel.appendChild(rateLabel);

        // ---- Duration ----
        const durLabel = document.createElement('label');
        durLabel.textContent = 'Duration (s): ';
        const durInput = document.createElement('input');
        durInput.type = 'number';
        durInput.min = '1';
        durInput.max = '60';
        durInput.value = '5';
        durInput.style.width = '54px';
        durLabel.appendChild(durInput);
        panel.appendChild(durLabel);

        // ---- Max Points ----
        const ptsLabel = document.createElement('label');
        ptsLabel.textContent = 'Max Points: ';
        const ptsSelect = document.createElement('select');
        for (const pts of [{ v: '0', t: 'All' }, { v: '4000', t: '4000' }, { v: '3000', t: '3000' }, { v: '2000', t: '2000' }, { v: '1000', t: '1000' }]) {
            const opt = document.createElement('option');
            opt.value = pts.v;
            opt.textContent = pts.t;
            ptsSelect.appendChild(opt);
        }
        ptsLabel.appendChild(ptsSelect);
        panel.appendChild(ptsLabel);

        // ---- Mode (XY / XYZ) ----
        const modeLabel = document.createElement('label');
        modeLabel.textContent = 'Mode: ';
        const modeSelect = document.createElement('select');
        for (const m of [{ v: 'xy', t: 'XY (2ch)' }, { v: 'xyz', t: 'XYZ (3ch)' }]) {
            const opt = document.createElement('option');
            opt.value = m.v;
            opt.textContent = m.t;
            modeSelect.appendChild(opt);
        }
        modeLabel.appendChild(modeSelect);
        panel.appendChild(modeLabel);

        // ---- Trace Rate ----
        const traceLabel = document.createElement('label');
        traceLabel.textContent = 'Trace Hz: ';
        const traceInput = document.createElement('input');
        traceInput.type = 'number';
        traceInput.min = '1';
        traceInput.max = '120';
        traceInput.value = '30';
        traceInput.style.width = '54px';
        traceLabel.appendChild(traceInput);
        panel.appendChild(traceLabel);

        // ---- Generate button ----
        const btn = document.createElement('button');
        btn.textContent = 'Generate XY WAV';
        btn.style.cssText = 'padding:4px 12px; cursor:pointer;';
        panel.appendChild(btn);

        // ---- Status ----
        const status = document.createElement('span');
        status.style.color = '#666';
        panel.appendChild(status);

        container.appendChild(panel);

        // ---- Click handler ----
        btn.addEventListener('click', async () => {
            const sampleRate = parseInt(rateSelect.value, 10);
            const duration = parseFloat(durInput.value);
            const traceHz = parseInt(traceInput.value, 10);

            if (isNaN(duration) || duration < 1 || duration > 60) {
                status.textContent = 'Duration must be between 1 and 60 s';
                return;
            }
            if (isNaN(traceHz) || traceHz < 1 || traceHz > 120) {
                status.textContent = 'Trace Hz must be between 1 and 120';
                return;
            }

            const maxPoints = parseInt(ptsSelect.value, 10);
            const xyzMode = modeSelect.value === 'xyz';

            status.textContent = 'Generating… 0%';
            btn.disabled = true;

            try {
                const blob = await XYOscilloscopeGenerator.generateWav(
                    canvas.framebuffer,
                    sampleRate,
                    duration,
                    traceHz,
                    maxPoints,
                    0xFFFFFFFF,
                    (fb: Framebuffer, timeMs: number) => {
                        scene.render(fb, timeMs);
                    },
                    (current: number, total: number) => {
                        const pct = Math.round((current / total) * 100);
                        status.textContent = `Generating… ${pct}% (frame ${current}/${total})`;
                    },
                    xyzMode
                );
                const modeTag = xyzMode ? 'xyz' : 'xy';
                WavEncoder.download(
                    blob,
                    `wireframe-${modeTag}-${sampleRate}Hz-${duration}s.wav`
                );
                status.textContent = 'Done – file downloaded.';
            } catch (e) {
                status.textContent = `Error: ${e}`;
                console.error(e);
            } finally {
                btn.disabled = false;
            }
        });
    }
}

Application.main();
