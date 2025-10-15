import Phaser from "phaser";
import { ASSETS } from "../config/assetKeys";
import { gameConfig } from "../config/gameConfig";
import type GameManager from "../utils/GameManager";

const config = gameConfig.HUD;
export default class HUDScene extends Phaser.Scene {
    private gameManager!: GameManager;
    private levelText!: Phaser.GameObjects.Text;
    private scoreText!: Phaser.GameObjects.Text;

    private hearts: Phaser.GameObjects.Image[] = [];

    constructor() {
        super("HUDScene");
    }

    init(data: { manager: GameManager }) {
        this.gameManager = data.manager;
    }

    create() {
        const { width } = this.scale;
        const lifes = this.gameManager.getLifes();
        const heartSpacing = config.heart.spacing;
        const totalWidth = (lifes - 1) * heartSpacing;
        const startX = width / 2 - totalWidth / 2;
        const y = config.heart.y;

        for (let i = 0; i < lifes; i++) {
            const heart = this.add.image(startX + i * heartSpacing, y, ASSETS.IMAGES.LIFE);
            heart.setOrigin(0.5, 0);
            heart.setDisplaySize(config.heart.size, config.heart.size)
            this.hearts.push(heart);
        }

        this.scoreText = this.add.text(config.score.x, y, `SCORE: ${this.gameManager.getScore()}`, {
            ...config.text
        });

        this.levelText = this.add.text(width - config.level.offset_x, y, `LEVEL: ${this.gameManager.getLevel()}`, {
            ...config.text
        }).setOrigin(1, 0);
    }

    updateHUD() {
        this.scoreText.setText(`SCORE: ${this.gameManager.getScore()}`);
        this.levelText.setText(`LEVEL: ${this.gameManager.getLevel()}`);

        const lifes = this.gameManager.getLifes();
        this.hearts.forEach((heart, i) => {
            heart.setVisible(i < lifes);
        })
    }
}