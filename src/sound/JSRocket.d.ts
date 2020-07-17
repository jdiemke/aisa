// tslint:disable:no-namespace

// Type definitions for jsRocket 1.0.1
// https://github.com/rocket/rocket/tree/master/js

// Rocket Editor
// tested with rocket-editor-0.10.2-win64 && rocket-editor-0.11.0-win64
// https://github.com/rocket/rocket/releases

// socket test
// https://www.websocket.org/echo.html

// example usage
// http://plnkr.co/edit/gPb2rYwmydisTmpg5p7g?p=preview&preview
// https://hernan.de/outer-realm/js/demo.js

/**
 * JSRocket
 *
 * A sync-tracker, a tool for synchronizing music and visuals in demoscene productions.
 *
 * MIT license.
 */
declare namespace JSRocket {

	function init(): void;

	function SyncData(): void;

	function SyncDevice(): void;

	function Track(): void;

	function SyncDevicePlayer(): void;

	function SyncDeviceClient(): void;

}
