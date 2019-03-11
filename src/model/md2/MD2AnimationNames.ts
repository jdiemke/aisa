// http://www.mbsoftworks.sk/tutorials/opengl3/24-animation-pt1-keyframe-md2/
// https://www.gamedev.net/forums/topic/361176-md2-animation-speed/
// https://www.allegro.cc/forums/thread/414171/414344
export class MD2Animation {

    public static readonly STAND: MD2Animation = new MD2Animation(0, 39, 9);
    public static readonly RUN: MD2Animation = new MD2Animation(40, 45, 10);
    public static readonly ATTACK: MD2Animation = new MD2Animation(46, 53, 10);
    public static readonly PAIN_A: MD2Animation = new MD2Animation(54, 57, 7);
    public static readonly PAIN_B: MD2Animation = new MD2Animation(58, 61, 7);
    public static readonly PAIN_C: MD2Animation = new MD2Animation(62, 65, 7);
    public static readonly JUMP: MD2Animation = new MD2Animation(66, 71, 7);
    public static readonly FLIP: MD2Animation = new MD2Animation(72, 83, 7);
    public static readonly SALUTE: MD2Animation = new MD2Animation(84, 94, 7);
    public static readonly FALLBACK: MD2Animation = new MD2Animation(95, 111, 10);
    public static readonly WAVE: MD2Animation = new MD2Animation(112, 122, 7);
    public static readonly POINTING: MD2Animation = new MD2Animation(123, 134, 6);

    public static readonly CROUCH_STAND: MD2Animation = new MD2Animation(135, 153, 10);
    public static readonly CROUCH_WALK: MD2Animation = new MD2Animation(154, 159, 7);
    public static readonly CROUCH_ATTACK: MD2Animation = new MD2Animation(160, 168, 10);
    public static readonly CROUCH_PAIN: MD2Animation = new MD2Animation(196, 172, 7);
    public static readonly CROUCH_DEATH: MD2Animation = new MD2Animation(173, 177, 5);

    public static readonly DEATH_FALLBACK: MD2Animation = new MD2Animation(178, 183, 7);
    public static readonly DEATH_FALLFORWARD: MD2Animation = new MD2Animation(184, 189, 7);
    public static readonly DEATH_FALLBACKSLOW: MD2Animation = new MD2Animation(190, 197, 7);
    public static readonly BOOM: MD2Animation = new MD2Animation(198, 198, 5);

    constructor(public first: number, public last: number, public fps: number) {

    }

}
