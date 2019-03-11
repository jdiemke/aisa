
// http://www.mbsoftworks.sk/tutorials/opengl3/24-animation-pt1-keyframe-md2/
// https://www.gamedev.net/forums/topic/361176-md2-animation-speed/
// https://www.allegro.cc/forums/thread/414171/414344

export class MD2Animation {

    public static readonly STAND: MD2Animation = new MD2Animation(0, 39, 9);
    public static readonly RUN: MD2Animation = new MD2Animation(40, 45, 10);
    public static readonly ATTACK: MD2Animation = new MD2Animation(46, 53, 10);
    public static readonly PAIN_A: MD2Animation = new MD2Animation(54, 57, 7);

    constructor(public first: number, public last: number, public fps: number) { }

}

interface Animation {
    first: number;
    last: number;
    fps: number;
}

const animations: Array<Animation> = [
    { first: 58, last: 61, fps: 7 },   // PAIN_B
    { first: 62, last: 65, fps: 7 },   // PAIN_C
    { first: 66, last: 71, fps: 7 },   // JUMP
    { first: 72, last: 83, fps: 7 },   // FLIP
    { first: 84, last: 94, fps: 7 },   // SALUTE
    { first: 95, last: 111, fps: 10 },   // FALLBACK
    { first: 112, last: 122, fps: 7 },   // WAVE
    { first: 123, last: 134, fps: 6 },   // POINTIING
    { first: 135, last: 153, fps: 10 },   // CROUCH_STAND
    { first: 154, last: 159, fps: 7 },   // CROUCH_WALK
    { first: 160, last: 168, fps: 10 },   // CROUCH_ATTACK
    { first: 196, last: 172, fps: 7 },   // CROUCH_PAIN
    { first: 173, last: 177, fps: 5 },   // CROUCH_DEATH
    { first: 178, last: 183, fps: 7 },   // DEATH_FALLBACK
    { first: 184, last: 189, fps: 7 },   // DEATH_FALLFORWARD
    { first: 190, last: 197, fps: 7 },   // DEATH_FALLBACKSLOW
    { first: 198, last: 198, fps: 5 }   // BOOM
];
