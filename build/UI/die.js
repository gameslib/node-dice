class Die {
    constructor(id, location, size) {
        this.color = '';
        this.text = '';
        this.children = null;
        this.value = 1;
        this.id = id;
        this.location = location;
        this.size = size;
        this.value = 1;
        this.buildPath();
        UI.clickables.push(this);
        this.render();
    }
    buildPath() {
        this.path = PathBuilder.BuildRectangle(this.location, this.size, 0);
    }
    clicked(broadcast) {
        if (this.value > 0) {
            this.frozen = !this.frozen;
            this.render();
            app.sounds.play(app.sounds.select);
            if (broadcast) {
                App.socketSend('dieClicked', { 'dieNumber': this.id });
            }
        }
    }
    reset() {
        this.frozen = false;
        this.value = 0;
        this.render();
    }
    hitTest(x, y) {
        return surface.isPointInPath(this.path, x, y);
    }
    render() {
        if (this.frozen) {
            surface.putImageData(Die.frozenFaces[this.value], this.location.left, this.location.top);
        }
        else {
            surface.putImageData(Die.faces[this.value], this.location.left, this.location.top);
        }
    }
}
Die.faces = [new ImageData(1, 1), new ImageData(1, 1), new ImageData(1, 1), new ImageData(1, 1), new ImageData(1, 1), new ImageData(1, 1)];
Die.frozenFaces = [new ImageData(1, 1), new ImageData(1, 1), new ImageData(1, 1), new ImageData(1, 1), new ImageData(1, 1), new ImageData(1, 1)];
