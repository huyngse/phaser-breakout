import Phaser from "phaser"
import { ASSETS } from "../config/assetKeys";
import { gameConfig } from "../config/gameConfig";
import Paddle from "../objects/Paddle";
import Ball from "../objects/Ball";
import SoundManager from "../utils/SoundManager";
import GameManager from "../utils/GameManager";
import PowerUp, { PowerUpTypes } from "../objects/PowerUp";

type ArcadePhysicsCallback = Phaser.Types.Physics.Arcade.ArcadePhysicsCallback;

export default class GameScene extends Phaser.Scene {
    private paddle!: Paddle;
    private ball!: Ball;
    private bricks!: Phaser.Physics.Arcade.StaticGroup;
    private soundManager!: SoundManager;
    private gameManager!: GameManager;
    private ballWaitingToReset = false;

    private powerUpPool!: Phaser.GameObjects.Group;

    constructor() {
        super("GameScene");
    }

    create() {
        this.soundManager = SoundManager.getInstance(this);
        this.gameManager = new GameManager();

        this.physics.world.setBoundsCollision(true, true, true, false);
        this.paddle = new Paddle(this, 400, 550, ASSETS.IMAGES.PADDLE);

        this.add.image(0, 0, ASSETS.IMAGES.BACKGROUND).setOrigin(0, 0).setDepth(-1);
        this.ball = new Ball(this, 400, 530, ASSETS.IMAGES.BALL);
        this.ball.collideWithPaddle(this.paddle);

        this.bricks = this.physics.add.staticGroup();
        const { rows, cols, width, height, padding, offsetTop, offsetLeft } = gameConfig.brick;
        const colors = [0xff5555, 0xffaa00, 0x55ff55, 0x5555ff];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = offsetLeft + col * width;
                const y = offsetTop + row * (height + padding);

                const brick = this.bricks.create(x, y, ASSETS.IMAGES.BRICK) as Phaser.Physics.Arcade.Image;
                brick.setDisplaySize(width, height);
                brick.setOrigin(0, 0);
                brick.refreshBody();
                brick.setTint(colors[row % colors.length])
            }
        }

        this.physics.add.collider(this.ball.sprite, this.bricks, this.hitBrick.bind(this) as ArcadePhysicsCallback);

        this.powerUpPool = this.add.group({
            classType: PowerUp,
            maxSize: 20,
            runChildUpdate: true
        })

        this.scene.launch("HUDScene", { manager: this.gameManager });
        this.scene.bringToTop("HUDScene");
    }

    update() {
        this.paddle.update();
        this.ball.update();

        if (this.ball.sprite.y > this.scale.height && !this.ballWaitingToReset) {
            this.handleBallFall();
        }
    }

    private handleBallFall() {
        this.gameManager.loseLife();
        if (this.gameManager.getLifes() > 0) {
            this.soundManager.play(ASSETS.SOUNDS.DAMAGE);
            this.ballWaitingToReset = true;
            this.time.delayedCall(
                1000,
                () => {
                    this.ball.reset(this.paddle.sprite.x, this.paddle.sprite.y - 20);
                    this.ballWaitingToReset = false;
                }
            );
        } else {
            this.soundManager.play(ASSETS.SOUNDS.GAME_OVER);
            this.scene.launch("GameOverScene", { manager: this.gameManager });
            this.scene.bringToTop("GameOverScene");
            this.scene.pause();
        }
    }

    hitBrick(ball: Phaser.Physics.Arcade.Image, brick: Phaser.Physics.Arcade.Image) {
        this.soundManager.play(ASSETS.SOUNDS.BREAK);
        this.gameManager.addScore(10);

        if (Math.random() < 0.8) {
            const powerUpType = PowerUpTypes[Math.floor(Math.random() * PowerUpTypes.length)];

            let powerUp = this.powerUpPool.getFirstDead(false) as PowerUp;
            if (!powerUp) {
                powerUp = new PowerUp(this, brick.x + brick.width / 2, brick.y + brick.height / 2, powerUpType);
                this.powerUpPool.add(powerUp);
            } else {
                powerUp.activate(brick.x + brick.width / 2, brick.y + brick.height / 2, powerUpType)
            }

            this.physics.add.collider(powerUp, this.paddle.sprite, this.collectPowerUp.bind(this) as ArcadePhysicsCallback);
        }

        brick.destroy();
    }

    collectPowerUp(powerUp: PowerUp, paddle: Phaser.Physics.Arcade.Image) {
        this.soundManager.play(ASSETS.SOUNDS.POWERUP, 0.3);
        powerUp.deactivate();
    }
}