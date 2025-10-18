import Phaser from "phaser";
import type Paddle from "../objects/Paddle";
import type SoundManager from "./SoundManager";
import PowerUp, { PowerUpTypes, type PowerUpType } from "../objects/PowerUp";
import { ASSETS } from "../config/assetKeys";
import type GameManager from "./GameManager";

type ArcadePhysicsCallback = Phaser.Types.Physics.Arcade.ArcadePhysicsCallback;

export default class PowerUpManager {
    private pool: Phaser.GameObjects.Group;

    constructor(
        private scene: Phaser.Scene,
        private paddle: Paddle,
        private gameManager: GameManager,
        private soundManager: SoundManager
    ) {
        this.pool = scene.add.group({
            classType: PowerUp,
            maxSize: 20,
            runChildUpdate: true
        });
    }

    spawn(brick: Phaser.Physics.Arcade.Image) {
        if (Math.random() < 0.8) {
            const powerUpType = PowerUpTypes[Math.floor(Math.random() * PowerUpTypes.length)];

            let powerUp = this.pool.getFirstDead(false) as PowerUp;
            if (!powerUp) {
                powerUp = new PowerUp(
                    this.scene,
                    brick.x + brick.width / 2,
                    brick.y + brick.height / 2,
                    powerUpType
                );
                this.pool.add(powerUp);
            } else {
                powerUp.activate(
                    brick.x + brick.width / 2,
                    brick.y + brick.height / 2,
                    powerUpType
                )
            }

            this.scene.physics.add.collider(
                powerUp,
                this.paddle.sprite,
                this.collectPowerUp.bind(this) as ArcadePhysicsCallback
            );
        }
    }

    private collectPowerUp(powerUp: PowerUp, paddle: Phaser.Physics.Arcade.Image) {
        this.soundManager.play(ASSETS.SOUNDS.POWERUP, 0.3);
        this.applyPowerUP(powerUp.getType());
        powerUp.deactivate();
    }

    update() { }

    private applyPowerUP(type: PowerUpType, duration = 5000) {
        switch (type) {
            case "expand":
            case "fast":
            case "shrink":
            case "slow":
                this.paddle.applyPowerUp(type, duration);
                break;
            case "life":
                this.gameManager.addLife();
                break;
        }
    }
}