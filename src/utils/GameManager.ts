export default class GameManager extends Phaser.Events.EventEmitter {
    constructor(
        private lifes = 1,
        private level = 1,
        private score = 0,
    ) {
        super();
    }

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
        this.emit("scoreChanged", this.score);
    }

    addLife() {
        console.log("Life added")
        this.lifes = Math.min(3, this.lifes + 1);
        this.emit("lifesChanged", this.lifes);
    }

    loseLife() {
        this.lifes = Math.max(0, this.lifes - 1);
        this.emit("lifesChanged", this.lifes);
    }

    nextLevel() {
        this.level += 1;
        this.emit("levelChanged", this.level);
    }

    reset() {
        this.lifes = 3;
        this.score = 0;
        this.level = 1;
        this.emit("scoreChanged", this.score);
        this.emit("lifesChanged", this.lifes);
        this.emit("levelChanged", this.level);
    }
}