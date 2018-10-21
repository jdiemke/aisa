export class FullscreenUtils {

    public static toggleFullscreen(element: Element): void {
        if (!this.fullscreen) {
            FullscreenUtils.enterFullscreen(element);
            this.fullscreen = true;
        } else {
            FullscreenUtils.exitFullscreen();
            this.fullscreen = false;
        }
    }

    public static enterFullscreen(element: Element): void {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
    }

    public static exitFullscreen(): void {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }

    private static fullscreen: boolean = false;

}
