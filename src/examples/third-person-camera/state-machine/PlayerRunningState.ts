import { MD2Animation } from '@engine/model/formats/md2';
import { PlayerStandingState } from './PlayerStandingState';
import { PlayerState } from './PlayerState';

export class PlayerRunningState extends PlayerState {

    public entry(): void {
        this.context.md2.forEach(x=> x.setAnim(MD2Animation.RUN, 0, true));
    
    }

    public upButtonNot(): void {
        this.context.setState(new PlayerStandingState(this.context));
    }

}
