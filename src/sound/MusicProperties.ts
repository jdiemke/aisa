export interface musicProperties {
    timeSeconds: number;
    timeMilliseconds: number;
    sceneData: sceneData;
}

// scene variables | things you set through jsRocket
export interface sceneData {
    effect: any;
    transitionType: any;
    transitionValue: any;
    snare: any;
    bass: any;
}

// Beats per minute of your demo tune
export const BPM = 125;

// The resolution between two beats, four is usually fine,- eight adds a bit more finer control
export const ROWS_PER_BEAT = 6;

// we calculate this now, so we can translate between rows and seconds later on
export const ROW_RATE = BPM / 60 * ROWS_PER_BEAT;
