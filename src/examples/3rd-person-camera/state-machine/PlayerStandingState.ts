import { MD2Animation } from '../../../model/md2/MD2AnimationNames';
import { PlayerRunningState } from './PlayerRunningState';
import { PlayerState } from './PlayerState';

export class PlayerStandingState extends PlayerState {

    public entry(): void {
        this.context.md2.setAnim(MD2Animation.STAND, 0, true);
    }

    public upButton(): void {
        this.context.setState(new PlayerRunningState(this.context));
    }

}
