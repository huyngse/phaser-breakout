import Phaser from "phaser"
import { ASSETS } from "../config/assetKeys";
import Paddle from "../objects/Paddle";
import Ball from "../objects/Ball";
import SoundManager from "../utils/SoundManager";
import GameManager from "../utils/GameManager";
import LevelManager from "../utils/LevelManager";
import PowerUpManager from "../utils/PowerUpManager";

type ArcadePhysicsCallback = Phaser.Types.Physics.Arcade.ArcadePhysicsCallback;

export default class GameScene extends Phaser.Scene {
    private paddle!: Paddle;
    private bricks!: Phaser.Physics.Arcade.StaticGroup;
    private soundManager!: SoundManager;
    private gameManager!: GameManager;
    private levelManager!: LevelManager;
    private powerUpManager!: PowerUpManager;
    private balls: Ball[] = [];
    private ballWaitingToReset = false;

    constructor() {
        super("GameScene");
    }

    create() {
        this.soundManager = SoundManager.getInstance(this);
        this.gameManager = new GameManager();
        this.levelManager = new LevelManager();

        this.physics.world.setBoundsCollision(true, true, true, false);
        this.paddle = new Paddle(this, 400, 550, ASSETS.IMAGES.PADDLE);

        this.add.image(0, 0, ASSETS.IMAGES.BACKGROUND).setOrigin(0, 0).setDepth(-1);
        const ball = new Ball(this, 400, 530, ASSETS.IMAGES.BALL);
        this.balls = [ball];

        this.bricks = this.physics.add.staticGroup();
        this.levelManager.createBricks(this.bricks, this.gameManager.getLevel());

        this.addBallColliders(ball);
        this.powerUpManager = new PowerUpManager(this, this.paddle, this.gameManager, this.soundManager);

        this.scene.launch("HUDScene", { manager: this.gameManager });
        this.scene.bringToTop("HUDScene");
    }

    update() {
        this.paddle.update();

        this.balls.forEach(ball => {
            ball.update();
            if (ball.sprite.y > this.scale.height && !this.ballWaitingToReset) {
                this.handleBallFall(ball);
            }
        });
    }

    private handleBallFall(ball: Ball) {
        ball.sprite.destroy();
        this.balls = this.balls.filter(b => b !== ball);

        if (this.balls.length === 0) {
            this.gameManager.loseLife();
            if (this.gameManager.getLifes() > 0) {
                this.soundManager.play(ASSETS.SOUNDS.DAMAGE);
                this.ballWaitingToReset = true;
                this.time.delayedCall(
                    1000,
                    () => {
                        const newBall = new Ball(this, this.paddle.sprite.x, this.paddle.sprite.y - 20, ASSETS.IMAGES.BALL);
                        this.addBallColliders(newBall);
                        this.balls = [newBall];
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
    }

    public activateMultiBall() {
        const newBalls: Ball[] = [];
        this.balls.forEach((originalBall) => {
            for (let i = 0; i < 2; i++) {
                const newBall = new Ball(
                    this,
                    originalBall.sprite.x,
                    originalBall.sprite.y,
                    ASSETS.IMAGES.BALL
                )
                this.addBallColliders(newBall);
                newBalls.push(newBall);
            }
        })
        this.balls.push(...newBalls);
    }

    hitBrick(ball: Phaser.Physics.Arcade.Image, brick: Phaser.Physics.Arcade.Image) {
        this.soundManager.play(ASSETS.SOUNDS.BREAK);
        this.gameManager.addScore(10);

        this.powerUpManager.spawn(brick);
        brick.destroy();
        this.levelManager.handleBrickDestroyed(this.handleLevelComplete.bind(this));
    }



    private handleLevelComplete() {
        this.soundManager.play(ASSETS.SOUNDS.NEXT_LEVEL);
        if (this.gameManager.getLevel() < this.levelManager.getTotalLevels()) {
            this.time.delayedCall(1000, () => {
                this.gameManager.nextLevel();
                this.levelManager.createBricks(this.bricks, this.gameManager.getLevel());
                const newBall = new Ball(this, this.paddle.sprite.x, this.paddle.sprite.y - 20, ASSETS.IMAGES.BALL);
                this.addBallColliders(newBall);
                this.balls = [newBall];
            })
        } else {
            this.soundManager.play(ASSETS.SOUNDS.VICTORY);
            this.scene.launch("GameOverScene", { manager: this.gameManager });
            this.scene.bringToTop("GameOverScene");
            this.scene.pause();
        }
    }

    private addBallColliders(ball: Ball) {
        this.physics.add.collider(ball.sprite, this.bricks, this.hitBrick.bind(this) as ArcadePhysicsCallback);
        ball.collideWithPaddle(this.paddle);
    }
}