import { PlayerStateMachine } from './PlayerStateMachine';

export abstract class PlayerState {

    constructor(protected context: PlayerStateMachine) {

    }

    public entry(): void {

    }

    public exit(): void {

    }

    public process(): void {

    }

    public upButton(): void {

    }

    public upButtonNot(): void {

    }

}
