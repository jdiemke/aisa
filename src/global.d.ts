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
