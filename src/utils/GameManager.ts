export default class GameManager {
    constructor(
        private lifes = 3,
        private level = 1,
        private score = 0,
    ) { }

    getLifes() {
        return this.lifes;
    }

    getLevel() {
        return this.level;
    }

    getScore() {
        return this.score;
    }

    addScore(amount: number) {
        this.score += amount;
    }

    loseLife() {
        this.lifes = Math.max(0, this.lifes - 1);
    }

    nextLevel() {
        this.level += 1;
    }

    reset() {
        this.lifes = 3;
        this.score = 0;
        this.level = 1;
    }
}