class Player {
    constructor(id, name, color, score, elem) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.score = score;
        this.element = elem;
        this.element.style.color = color;
        this.resetScore();
    }
    addScore(value) {
        this.score += value;
        this.element.textContent = this.name + ' = ' + this.score;
    }
    resetScore() {
        this.score = 0;
        this.element.textContent = this.name;
    }
}
