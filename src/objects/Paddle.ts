import Phaser from "phaser";
import { gameConfig } from "../config/gameConfig";
import SoundManager from "../utils/SoundManager";
import { ASSETS } from "../config/assetKeys";
export default class Paddle {
    public sprite: Phaser.Physics.Arcade.Image;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private soundManager: SoundManager;

    constructor(
        private scene: Phaser.Scene,
        x: number, y: number, texture: string
    ) {
        this.sprite = this.scene.physics.add.image(x, y, texture);
        this.sprite.setDisplaySize(gameConfig.paddle.width, gameConfig.paddle.height);
        this.sprite.setImmovable(true);
        this.sprite.setCollideWorldBounds(true);

        this.soundManager = SoundManager.getInstance(this.scene);

        if (this.scene.input.keyboard) {
            this.cursors = this.scene.input.keyboard.createCursorKeys();
        }
    }

    update() {
        if (!this.cursors) return;

        this.sprite.setVelocityX(0);

        const speed = gameConfig.paddle.speed;
        if (this.cursors.left.isDown) {
            this.sprite.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.sprite.setVelocityX(speed);
        }
    }

    hitBall(ball: Phaser.Physics.Arcade.Image) {
        this.soundManager.play(ASSETS.SOUNDS.BOUNCE);
        const diff = ball.x - this.sprite.x;
        ball.setVelocityX(diff * 5);
    }
}