import Phaser from "phaser";
import { ASSETS } from "../config/assetKeys";

export const PowerUpTypes = [
    "life",
    "shrink",
    "expand",
    "multi-ball",
    "magnet",
    "shooting",
    "slow",
    "fast"
] as const;

export type PowerUpType = typeof PowerUpTypes[number];

const powerUpTextures: Record<PowerUpType, string> = {
    "multi-ball": ASSETS.IMAGES.PU_MULTI_BALL,
    expand: ASSETS.IMAGES.PU_EXPAND,
    fast: ASSETS.IMAGES.PU_FAST,
    magnet: ASSETS.IMAGES.PU_MAGNET,
    shooting: ASSETS.IMAGES.PU_SHOOTING,
    shrink: ASSETS.IMAGES.PU_SHRINK,
    slow: ASSETS.IMAGES.PU_SLOW,
    life: ASSETS.IMAGES.PU_LIFE
}

export default class PowerUp extends Phaser.Physics.Arcade.Sprite {
    private powerUpType: PowerUpType;

    constructor(scene: Phaser.Scene, x: number, y: number, type: PowerUpType) {
        super(scene, x, y, powerUpTextures[type]);
        scene.physics.add.existing(this);
        scene.add.existing(this);
        this.setDisplaySize(50, 50);
        this.setBodySize(30, 30);
        this.setVelocityY(100);
        this.powerUpType = type;
    }

    update() {
        if (this.y > this.scene.scale.height) {
            this.deactivate();
        }
    }

    activate(x: number, y: number, type: PowerUpType) {
        this.powerUpType = type;
        this.setTexture(powerUpTextures[type]);
        this.setPosition(x, y);
        this.setVelocityY(100);

        this.setActive(true);
        this.setVisible(true);
        if (this.body) {
            this.body.enable = true;
        }
    }

    deactivate() {
        this.setActive(false);
        this.setVisible(false);
        if (this.body) {
            this.body.stop();
            this.body.reset(this.x, this.y);
            this.body.enable = false;
        }
    }

    getType() {
        return this.powerUpType;
    }
}