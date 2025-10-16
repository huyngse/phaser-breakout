import Phaser from "phaser"
import { ASSETS } from "../config/assetKeys";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super("PreloadScene")
    }

    preload() {
        this.load.image(ASSETS.IMAGES.BACKGROUND, "assets/images/background.png");
        this.load.image(ASSETS.IMAGES.BALL, "assets/images/circle.png");
        this.load.image(ASSETS.IMAGES.BRICK, "assets/images/brick.png");
        this.load.image(ASSETS.IMAGES.PADDLE, "assets/images/paddle.png");
        this.load.image(ASSETS.IMAGES.PADDLE_LONG, "assets/images/paddle-long.png");
        this.load.image(ASSETS.IMAGES.PADDLE_SHORT, "assets/images/paddle-short.png");
        this.load.image(ASSETS.IMAGES.LIFE, "assets/images/heart.png");
        this.load.image(ASSETS.IMAGES.PU_EXPAND, "assets/images/expand-paddle.png");
        this.load.image(ASSETS.IMAGES.PU_MAGNET, "assets/images/magnet.png");
        this.load.image(ASSETS.IMAGES.PU_MULTI_BALL, "assets/images/multi-ball.png");
        this.load.image(ASSETS.IMAGES.PU_SHOOTING, "assets/images/shooting-paddle.png");
        this.load.image(ASSETS.IMAGES.PU_FAST, "assets/images/speed-up.png");
        this.load.image(ASSETS.IMAGES.PU_SHRINK, "assets/images/shrink-paddle.png");
        this.load.image(ASSETS.IMAGES.PU_SLOW, "assets/images/slow-down.png");
        this.load.image(ASSETS.IMAGES.PU_LIFE, "assets/images/heart-sm.png");

        this.load.audio(ASSETS.SOUNDS.BOUNCE, "assets/sounds/sfx_sounds_impact1.wav");
        this.load.audio(ASSETS.SOUNDS.BREAK, "assets/sounds/sfx_sounds_impact7.wav");
        this.load.audio(ASSETS.SOUNDS.POWERUP, "assets/sounds/sfx_sounds_powerup7.wav");
        this.load.audio(ASSETS.SOUNDS.DAMAGE, "assets/sounds/sfx_sounds_damage3.wav");
        this.load.audio(ASSETS.SOUNDS.GAME_OVER, "assets/sounds/sfx_sounds_negative1.wav");
    }

    create() {
        this.scene.start("GameScene");
    }
}