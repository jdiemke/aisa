type ModuleFn = (modulePtr: number) => number;

type OpenMptRuntime = {
    _openmpt_module_get_num_channels?: ModuleFn;
    _openmpt_module_get_current_pattern?: ModuleFn;
    _openmpt_module_get_current_row?: ModuleFn;
    _openmpt_module_get_pattern_row_channel_command?: (
        modulePtr: number, pattern: number, row: number, channel: number, command: number
    ) => number;
};

/**
 * Detects note onsets per sample/instrument number by scanning OpenMPT pattern
 * rows. This build of libopenmpt does not expose per-channel sample readback,
 * so triggers are read from the pattern's instrument column.
 */
export class OpenMptVuMeter {

    // libopenmpt command column index for the instrument/sample number.
    private static readonly INSTRUMENT_COMMAND: number = 1;

    // Sample/instrument numbers whose note was triggered in the latest scan.
    private static triggeredSamples: Set<number> = new Set();
    private static lastScanPattern: number = -1;
    private static lastScanRow: number = -1;

    private static getRuntime(): OpenMptRuntime | undefined {
        return (window as any).libopenmpt;
    }

    private static getModulePtr(): number {
        const ptr = (window as any).modulePtr;
        return typeof ptr === 'number' ? ptr : 0;
    }

    public static isAvailable(): boolean {
        const runtime = OpenMptVuMeter.getRuntime();
        return !!(
            runtime &&
            OpenMptVuMeter.getModulePtr() &&
            typeof runtime._openmpt_module_get_num_channels === 'function' &&
            typeof runtime._openmpt_module_get_current_pattern === 'function' &&
            typeof runtime._openmpt_module_get_current_row === 'function' &&
            typeof runtime._openmpt_module_get_pattern_row_channel_command === 'function'
        );
    }

    /**
     * True once per note onset for the given sample/instrument number. The
     * trigger is consumed on read so each onset fires a single time.
     */
    public static consumeSampleTrigger(index: number): boolean {
        if (!OpenMptVuMeter.isAvailable() || index <= 0) {
            return false;
        }
        OpenMptVuMeter.scanTriggers();
        return OpenMptVuMeter.triggeredSamples.delete(index);
    }

    /**
     * Collects note onsets from pattern rows elapsed since the last scan.
     */
    private static scanTriggers(): void {
        const runtime = OpenMptVuMeter.getRuntime()!;
        const modulePtr = OpenMptVuMeter.getModulePtr();
        const pattern = runtime._openmpt_module_get_current_pattern!(modulePtr);
        const row = runtime._openmpt_module_get_current_row!(modulePtr);
        if (pattern === OpenMptVuMeter.lastScanPattern && row === OpenMptVuMeter.lastScanRow) {
            return;
        }

        // Catch rows missed between frames, but only within the same pattern.
        const samePattern = pattern === OpenMptVuMeter.lastScanPattern && row > OpenMptVuMeter.lastScanRow;
        const startRow = samePattern ? OpenMptVuMeter.lastScanRow + 1 : row;
        const channelCount = runtime._openmpt_module_get_num_channels!(modulePtr);
        const readCommand = runtime._openmpt_module_get_pattern_row_channel_command!;

        OpenMptVuMeter.triggeredSamples.clear();
        for (let r = startRow; r <= row; r++) {
            for (let channel = 0; channel < channelCount; channel++) {
                const sample = readCommand(modulePtr, pattern, r, channel, OpenMptVuMeter.INSTRUMENT_COMMAND);
                if (sample > 0) {
                    OpenMptVuMeter.triggeredSamples.add(sample);
                }
            }
        }

        OpenMptVuMeter.lastScanPattern = pattern;
        OpenMptVuMeter.lastScanRow = row;
    }

}