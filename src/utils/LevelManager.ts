import Phaser from "phaser";
import { gameConfig } from "../config/gameConfig";
import { ASSETS } from "../config/assetKeys";
export default class LevelManager {
    private colors = [0xff5555, 0xffaa00, 0x55ff55, 0x5555ff];
    private totalLevels: number = 3;
    private remainingBricks = 0;

    getTotalLevels() {
        return this.totalLevels;
    }

    createBricks(bricksGroup: Phaser.Physics.Arcade.StaticGroup, level: number) {
        bricksGroup.clear(true, true);
        const { rows, cols, width, height, padding, offsetTop, offsetLeft } = gameConfig.brick;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = offsetLeft + col * width;
                const y = offsetTop + row * (height + padding);

                if ((row + col + level) % (2 + level) === 0) continue;

                const brick = bricksGroup.create(x, y, ASSETS.IMAGES.BRICK) as Phaser.Physics.Arcade.Image;
                brick.setDisplaySize(width, height);
                brick.setOrigin(0, 0);
                brick.refreshBody();
                brick.setTint(this.colors[row % this.colors.length])
            }
        }

        this.remainingBricks = bricksGroup.countActive();
    }

    handleBrickDestroyed(onLevelComplete: () => void) {
        this.remainingBricks--;
        if (this.remainingBricks <= 0) {
            onLevelComplete();
        }
    }

    getRemainingBricks() {
        return this.remainingBricks;
    }
}