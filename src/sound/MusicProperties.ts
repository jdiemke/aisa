export interface musicProperties {
    // Beats per minute of your demo tune
    BPM: number;
    // The resolution between two beats, four is usually fine,- eight adds a bit more finer control
    ROWS_PER_BEAT: number;
    // we calculate this now, so we can translate between rows and seconds later on
    ROW_RATE: number;
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
