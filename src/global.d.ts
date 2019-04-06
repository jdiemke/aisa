/**
 * Extend the Element and Document interfaces for cross browser fullscreen support
 */

interface Element {
    requestFullScreen?(): void;
    mozRequestFullScreen?(): void;
    webkitRequestFullScreen?(): void;
    msRequestFullscreen?(): void;
}

interface Document {
    mozCancelFullScreen?(): void;
    webkitExitFullscreen?(): void;
}

// Type definitions for jsxm 1.0.1
// Project: https://www.npmjs.org/package/jsxm
// Definitions by: Johannes Diemke <https://github.com/jdiemke>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/**
 * FastTracker 2 XM Player
 *
 * The player is fairly feature-complete, but is missing a bunch of effects.
 *
 * MIT license.
 */
declare namespace XMPlayer {

    /**
     * AudioContext of the player.
     */
    const audioctx: AudioContext;

    /**
     * Initialize the player and starts up audio context; it's available as XMPlayer.audioctx
     */
    function init(): void;

    /**
     * Load a XM into the player. Returns true if loaded, otherwise barfs randomly.
     * @param {ArrayBuffer} arrayBuffer An ArrayBuffer containing a XM file
     */
    function load(file: ArrayBuffer): boolean;

    /**
     * Start the playback.
     */
    function play(): void;

    /**
     * Pauses the playback.
     */
    function pause(): void;

    /**
     * Stops the playback. Call this before loading a new song.
     */
    function stop(): void;

}
