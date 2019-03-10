export enum MD2AnimationNames {
    STAND,
    RUN,
    ATTACK,
    PAIN_A,
    PAIN_B,
    PAIN_C,
    JUMP,
    FLIP,
    SALUTE,
    FALLBACK,
    WAVE,
    POINTING,
    CROUCH_STAND,
    CROUCH_WALK,
    CROUCH_ATTACK,
    CROUCH_PAIN,
    CROUCH_DEATH,
    DEATH_FALLBACK,
    DEATH_FALL_FORWARD,
    DEATH_FALLVBACK_SLOW,
    BOOM
}

interface Animation {
    first: number;
    last: number;
    fps: number;
}

const animations: Array<Animation> = [
    { first: 0, last: 39, fps: 9 },   // STAND
    { first: 40, last: 45, fps: 10 },   // RUN
    { first: 46, last: 53, fps: 10 },   // ATTACK
    { first: 54, last: 57, fps: 7 },   // PAIN_A
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
