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

        const ballVector = new Phaser.Math.Vector2(1, -1).normalize();
        this.sprite.setVelocity(ballVector.x * gameConfig.ball.speed, ballVector.y * gameConfig.ball.speed);
    }

    update() {
        if (!this.sprite.body) return;
        const velocity = this.sprite.body.velocity;
        const speed = gameConfig.ball.speed;
        const normalized = velocity.clone().normalize();
        this.sprite.setVelocity(normalized.x * speed, normalized.y * speed)
    }

    reset(x: number, y: number) {
        this.sprite.setPosition(x, y);
        const ballVector = new Phaser.Math.Vector2(1, -1).normalize();
        this.sprite.setVelocity(ballVector.x * gameConfig.ball.speed, ballVector.y * gameConfig.ball.speed);
    }

    collideWithPaddle(paddle: Paddle) {
        this.scene.physics.add.collider(this.sprite, paddle.sprite, () => paddle.hitBall(this.sprite));
    }
}