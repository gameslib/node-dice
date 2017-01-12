class Die {
    constructor(index, location, size) {
        this.size = 80;
        this.value = 1;
        this.lastValue = 1;
        this.index = index;
        this.location = location;
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
        if (x < this.location.left || x > this.location.left + this.size) {
            return false;
        }
        if (y < this.location.top || y > this.location.top + this.size) {
            return false;
        }
        return true;
    }
    render() {
        if (this.frozen) {
            surface.putImageData(Die.frozenFaces[this.value], this.location.left, this.location.top);
        }
        else {
            surface.putImageData(Die.faces[this.value], this.location.left, this.location.top);
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
