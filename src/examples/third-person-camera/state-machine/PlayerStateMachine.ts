import { MD2Model } from '../../../model/md2/MD2Model';
import { Player } from '../Player';
import { PlayerStandingState } from './PlayerStandingState';
import { PlayerState } from './PlayerState';

/**
 * http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.9.8608&rep=rep1&type=pdf
 * http://www.iplab.cs.tsukuba.ac.jp/paper/international/ali-idpt99.pdf
 * https://www.reddit.com/r/gamedev/comments/45nn5i/article_tame_your_game_code_with_state_machines/
 * http://howtomakeanrpg.com/a/state-machines.html
 * https://gamedevacademy.org/how-to-use-state-machines-to-control-behavior-and-animations-in-phaser/
 * https://www.gamedev.net/articles/programming/general-and-gameplay-programming/from-user-input-to-animations-using-state-machines-r4155/
 * http://gameprogrammingpatterns.com/state.html
 */
export class PlayerStateMachine {

    public md2: MD2Model;
    private activeState: PlayerState = null;

    public constructor(md2: MD2Model, public pl: Player) {
        this.md2 = md2;
        this.setState(new PlayerStandingState(this));
    }

    public upButton(): void {
        this.activeState.upButton();
    }

    public upButtonNot(): void {
        this.activeState.upButtonNot();
    }

    public setState(state: PlayerState): void {
        if (this.activeState !== null) {
            this.activeState.exit();
        }

        this.activeState = state;
        this.activeState.entry();
    }

}
