/*
Name          : Aisa Demo
Release Date  : TBD
Platform      : JavaScript
Category      : Demo
Notes         : Software rendered demoscene effects written in Typescript
*/

import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { SoundManager } from '../../sound/SoundManager';
import { BlockFade } from '../block-fade/BlockFade';
import { DoublyLinkedList } from '../../core/LinkedList';
import { DLNode } from '../../core/Node';
import { LoadingScene } from './parts/LoadingScene';
import { CanvasRecorder } from './canvas-record';
import { DemoControls } from './DemoControls';
import { DemoStats } from './DemoStats';
import { demoOrder, initScene, allProgress } from './SceneLoader';

export class DemoScene extends AbstractScene {

    private soundManager: SoundManager;
    private canvasRecorder: CanvasRecorder;
    private sceneList: DoublyLinkedList<AbstractScene>;
    private BlockFade: BlockFade;
    private canvasRef: HTMLCanvasElement;
    private demoStats: DemoStats;
    private demoControls: DemoControls;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.soundManager  = new SoundManager();
        this.sceneList     = new DoublyLinkedList();
        this.canvasRef     = document.getElementById('aisa-canvas') as HTMLCanvasElement;
        this.BlockFade     = new BlockFade();
        this.canvasRecorder = new CanvasRecorder();

        // Set up performance stats panels
        this.demoStats = new DemoStats();
        this.demoStats.init(framebuffer.width);

        // Set up playback controls and HUD
        this.demoControls = new DemoControls();
        this.demoControls.init(
            this.soundManager,
            this.canvasRecorder,
            this.canvasRef,
            framebuffer.width,
            () => this.sceneList.length
        );

        // Establish loading scene as the first node
        const loadingNode: DLNode<AbstractScene> = new DLNode();
        loadingNode.data = new LoadingScene();
        this.sceneList.insertStart(loadingNode);

        // Pre-allocate placeholder nodes (dynamic imports resolve out of order)
        for (let i = 0; i < demoOrder.length; i++) {
            const placeholder: DLNode<AbstractScene> = new DLNode();
            this.sceneList.insert(placeholder, this.sceneList.length - 1);
        }

        // Flush framebuffer to canvas each animation frame
        const animate = () => {
            this.canvasRef.getContext('2d').putImageData(framebuffer.getImageData(), 0, 0);
            requestAnimationFrame(animate);
        };

        return allProgress([
            // Transition effect
            this.BlockFade.init(framebuffer),

            // Music
            this.soundManager.loadMusic(require(`@assets/sound/showeroflove.mod`)),

            // JS Rocket sync data
            this.soundManager.prepareSync(require('@assets/sound/demo.rocket'), true),

            // All scene effects (loaded in parallel, inserted at their correct index)
            ...demoOrder.map(async (element, index) =>
                await import(`${element}`).then(plug => initScene(framebuffer, plug, index + 1, this.sceneList))
            ),

        ], (percent: number) => {
            // Show loading progress while assets are downloading
            this.sceneList.getNode(0).data.render(framebuffer, percent);
            this.demoStats.update();
            requestAnimationFrame(animate);
        });
    }

    // Runs after init() resolves
    public onInit(): void {
        // Restore last playback position and apply saved mute state
        this.soundManager.initTimeline();

        // Show the debug / timeline navigator bar
        document.getElementById('debug').style.display = 'block';
    }

    public render(framebuffer: Framebuffer): void {
        this.soundManager.updateMusic();

        const musicProps = this.soundManager.musicProperties;
        if (musicProps === undefined) return;

        const sceneData = musicProps.sceneData;
        const node = this.sceneList.getNode(sceneData.effect || 0);

        if (sceneData.transitionType === 0) {
            // Run the current effect on its own
            node.data.render(framebuffer, musicProps.timeMilliseconds);
        } else {
            // Blend two consecutive effects together
            this.BlockFade.transition(
                framebuffer,
                node.data,
                node.next.data,
                sceneData.transitionType,
                sceneData.transitionValue,
                musicProps.timeMilliseconds
            );
        }

        // Comment out for release builds
        this.demoControls.draw(this.soundManager);
        this.demoStats.update();
    }
}
