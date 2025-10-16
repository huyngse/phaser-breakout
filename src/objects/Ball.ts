import Phaser from "phaser";
import { gameConfig } from "../config/gameConfig";
import type Paddle from "./Paddle";

export default class Ball {
    public sprite!: Phaser.Physics.Arcade.Image;

    constructor(
        private scene: Phaser.Scene,
        x: number, y: number, texture: string) {
        this.sprite = this.scene.physics.add.image(x, y, texture);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setBounce(1, 1);
        this.sprite.setDisplaySize(gameConfig.ball.radius * 2, gameConfig.ball.radius * 2);

        this.setInitialVelocity();
    }

    update() {
        if (!this.sprite.body) return;
        const velocity = this.sprite.body.velocity;
        const speed = gameConfig.ball.speed;
        const normalized = velocity.clone().normalize();

        const minY = 0.3;
        if (Math.abs(normalized.y) < minY) {
            normalized.y = normalized.y < 0 ? -minY : minY;
            normalized.x = Math.sqrt(1 - normalized.y ** 2) * (normalized.x < 0 ? -1 : 1);
        }
        this.sprite.setVelocity(normalized.x * speed, normalized.y * speed);
    }

    reset(x: number, y: number) {
        this.sprite.setPosition(x, y);
        this.setInitialVelocity();
    }

    collideWithPaddle(paddle: Paddle) {
        this.scene.physics.add.collider(this.sprite, paddle.sprite, () => paddle.hitBall(this.sprite));
    }

    setInitialVelocity() {
        this.sprite.setVelocity(Math.random() * 400 - 200, -300);
    }
}