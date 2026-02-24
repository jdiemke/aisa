import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { DoublyLinkedList } from '../../core/LinkedList';

/**
 * Ordered list of scene module paths for the demo.
 * The index here corresponds to the scene number used by JS Rocket sync data.
 */
export const demoOrder: string[] = [
    './parts/Scene1',
    './parts/Scene2',
    './parts/Scene3',
    './parts/Scene4',
    './parts/Scene5',
    './parts/Scene6',
    './parts/Scene7',
    './parts/Scene8',
    './parts/Scene9',
    './parts/Scene10',
    './parts/Scene11',
    './parts/Scene12',
    './parts/Scene13',
    './parts/Scene14',
    './parts/Scene15',
    './parts/Scene16',
    './parts/Scene17',
    './parts/Scene18',
    './parts/Scene19',
    './parts/Scene20',
];

/**
 * Dynamically imports a scene module, instantiates it, and places it into the
 * pre-allocated node at `index` in `sceneList`.
 *
 * @param framebuffer   Framebuffer passed to the scene's init()
 * @param plug          The dynamically imported module object
 * @param index         Position in sceneList to place the new scene
 * @param sceneList     The shared linked-list of all demo scenes
 */
export function initScene(
    framebuffer: Framebuffer,
    plug: unknown,
    index: number,
    sceneList: DoublyLinkedList<AbstractScene>
): Promise<any> {
    const constructorName = Object.keys(plug as object)[0];
    const currentNode = sceneList.getNode(index);
    currentNode.data = new (plug as any)[constructorName]();

    return Promise.all([
        currentNode.data.init(framebuffer),
        new Promise<void>(resolve => {
            if (currentNode.data.onInit) currentNode.data.onInit();
            resolve();
        }),
    ]);
}

/**
 * Runs all promises and fires `progressCallback` after each one resolves,
 * passing the cumulative completion ratio (0–1).
 *
 * @param promises          Array of promises to track
 * @param progressCallback  Called with a value in [0, 1] after each settlement
 */
export function allProgress(
    promises: Array<Promise<any>>,
    progressCallback: (percentage: number) => void
): Promise<any> {
    let d = 0;
    for (const p of promises) {
        p.then(() => {
            d++;
            progressCallback(d / promises.length);
        }).catch(() => {
            // Rejection is surfaced by Promise.all below; suppress the
            // duplicate "Uncaught (in promise)" from this progress wrapper.
        });
    }
    return Promise.all(promises);
}
