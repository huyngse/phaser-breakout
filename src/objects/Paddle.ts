import Phaser from "phaser";
import { gameConfig } from "../config/gameConfig";
import SoundManager from "../utils/SoundManager";
import { ASSETS } from "../config/assetKeys";
import type { PowerUpType } from "./PowerUp";

export default class Paddle {
    public sprite: Phaser.Physics.Arcade.Image;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private soundManager: SoundManager;

    private baseSpeed: number;
    private activePowerUps: Set<PowerUpType> = new Set();

    constructor(
        private scene: Phaser.Scene,
        x: number, y: number, texture: string
    ) {
        this.sprite = this.scene.physics.add.image(x, y, texture);
        this.sprite.setImmovable(true);
        this.sprite.setCollideWorldBounds(true);

        this.baseSpeed = gameConfig.paddle.speed;

        this.soundManager = SoundManager.getInstance(this.scene);

        if (this.scene.input.keyboard) {
            this.cursors = this.scene.input.keyboard.createCursorKeys();
        }
    }

    update() {
        if (!this.cursors) return;


        let speed = this.baseSpeed;

        if (this.activePowerUps.has("fast")) {
            speed *= 1.5;
        } else if (this.activePowerUps.has("slow")) {
            speed *= 0.5;
        }

        this.sprite.setVelocityX(0);

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

    applyPowerUp(type: PowerUpType, duration: number = 5000) {
        if (this.activePowerUps.has(type)) return;

        this.activePowerUps.add(type);

        switch (type) {
            case "expand":
                if (this.activePowerUps.has("shrink")) {
                    this.activePowerUps.delete("shrink");
                }
                this.sprite.setTexture(ASSETS.IMAGES.PADDLE_LONG);
                this.sprite.setSize(this.sprite.displayWidth, this.sprite.displayHeight);
                break;
            case "shrink":
                if (this.activePowerUps.has("expand")) {
                    this.activePowerUps.delete("expand");
                }
                this.sprite.setTexture(ASSETS.IMAGES.PADDLE_SHORT);
                this.sprite.setSize(this.sprite.displayWidth, this.sprite.displayHeight);
                break;
        }

        this.scene.time.delayedCall(duration, () => {
            this.activePowerUps.delete(type);
            switch (type) {
                case "expand":
                case "shrink":
                    this.sprite.setTexture(ASSETS.IMAGES.PADDLE);
                    this.sprite.setSize(this.sprite.displayWidth, this.sprite.displayHeight);
                    break;
            }
        })

    }
}