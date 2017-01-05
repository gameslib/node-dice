class Die {
    constructor(index, x, y, size) {
        this.size = 80;
        this.value = 1;
        this.lastValue = 1;
        this.index = index;
        this.x = x;
        this.y = y;
        this.size = size;
        this.value = 1;
        this.render();
    }
    clicked() {
        if (this.value > 0) {
            this.frozen = !this.frozen;
            this.render();
            app.sounds.play(app.sounds.select);
        }
    }
    hitTest(x, y) {
        if (x < this.x || x > this.x + this.size) {
            return false;
        }
        if (y < this.y || y > this.y + this.size) {
            return false;
        }
        return true;
    }
    render() {
        if (this.frozen) {
            Board.Surface.putImageData(Die.frozenFaces[this.value], this.x, this.y);
        }
        else {
            Board.Surface.putImageData(Die.faces[this.value], this.x, this.y);
        }
    }
    reset() {
        this.frozen = false;
        this.value = 0;
        this.render();
    }
}
Die.faces = [new ImageData(1, 1), new ImageData(1, 1), new ImageData(1, 1), new ImageData(1, 1), new ImageData(1, 1), new ImageData(1, 1)];
Die.frozenFaces = [new ImageData(1, 1), new ImageData(1, 1), new ImageData(1, 1), new ImageData(1, 1), new ImageData(1, 1), new ImageData(1, 1)];
