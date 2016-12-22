class Die {
    constructor(index, canvas) {
        this.index = index;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }
    clicked() {
        if (this.value > 0) {
            this.frozen = !this.frozen;
            this.render();
            app.sounds.play(app.sounds.select);
        }
    }
    render() {
        if (this.frozen) {
            this.ctx.putImageData(Die.frozenFaces[this.value], 0, 0);
        }
        else {
            this.ctx.putImageData(Die.faces[this.value], 0, 0);
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
