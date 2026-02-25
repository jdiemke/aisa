export class FullscreenUtils {

    public static toggleFullscreen(element: Element): void {
        const isFullscreen: boolean = !!(
            document.fullscreenElement ||
            (document as any).webkitFullscreenElement ||
            (document as any).mozFullScreenElement ||
            (document as any).msFullscreenElement
        );
        if (!isFullscreen) {
            FullscreenUtils.enterFullscreen(element);
            this.setStyle(element, 'cursor: none');
        } else {
            FullscreenUtils.exitFullscreen();
            this.setStyle(element, 'cursor: zoom-in');
        }
    }

    private static setStyle(el, css) {
        el.setAttribute('style', el.getAttribute('style') + ';' + css);
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

}
