import Phaser from "phaser";
import type GameManager from "../utils/GameManager";

export interface GameOverData {
    manager: GameManager;
}

export default class GameOverScene extends Phaser.Scene {
    private gameManager!: GameManager;
    private restartButton!: Phaser.GameObjects.Text;

    constructor() {
        super("GameOverScene");
    }

    init(data: GameOverData) {
        this.gameManager = data.manager;
    }

    create() {
        const { width, height } = this.scale;

        this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0, 0);
        this.add.text(width / 2, height / 2 - 100, "GAME OVER", {
            fontSize: "32px",
            color: "#fff"
        }).setOrigin(0.5, 0);

        this.add.text(width / 2, height / 2 - 50, `SCORE: ${this.gameManager.getScore()}`, {
            fontSize: "24px",
            color: "#fff"
        }).setOrigin(0.5, 0);

        this.add.text(width / 2, height / 2 - 20, `LEVEL: ${this.gameManager.getLevel()}`, {
            fontSize: "24px",
            color: "#fff"
        }).setOrigin(0.5, 0);

        this.restartButton = this.add.text(width / 2, height / 2 + 30, `RESTART`, {
            fontSize: "24px",
            color: "#fff"
        }).setOrigin(0.5, 0)
            .setInteractive({ useHandCursor: true });

        this.restartButton.on("pointerup", () => {
            this.scene.stop("GameScene");
            this.scene.stop("HUDScene");
            this.scene.stop("GameOverScene");
            this.scene.start("GameScene");
        })
    }
}