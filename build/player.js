class Player {
    constructor(id, name, color, score, elem) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.score = score;
        this.element = elem;
        this.element.textColor = color;
        this.resetScore();
    }
    addScore(value) {
        this.score += value;
        this.element.textColor = this.color;
        this.element.text = this.name + ' = ' + this.score;
    }
    resetScore() {
        this.score = 0;
        this.element.textColor = this.color;
        this.element.text = this.name;
    }
}
