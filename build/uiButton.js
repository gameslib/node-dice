class Button {
    constructor(location, size) {
        this._backgroundColor = 'black';
        this.children = [];
        this.disabled = false;
        this.children.push(new Label('Roll Dice', { left: location.left + 90, top: location.top + 40 }, { width: size.width - 25, height: 40 }, 'blue', Board.textColor));
        this.location = location;
        this.size = size;
        this.buildPath();
        this.firstPass = true;
        this.render();
    }
    get text() {
        return this.children[0].text;
    }
    set text(newText) {
        this.children[0].text = newText;
        this.render();
    }
    get color() {
        return this._backgroundColor;
    }
    set color(color) {
        this._backgroundColor = color;
        this.children[0].color = color;
        this.render();
    }
    buildPath() {
        this.path = PathBuilder.BuildRectangle(this.location, this.size, 10);
    }
    hitTest(x, y) {
        return surface.isPointInPath(this.path, x, y);
    }
    render() {
        if (this.firstPass) {
            surface.shadowColor = 'burlywood';
        }
        surface.fillStyle = this._backgroundColor;
        surface.fill(this.path);
        surface.fillStyle = Board.textColor;
        if (this.firstPass) {
            this.firstPass = false;
            surface.shadowColor = 'transparent';
        }
        this.children[0].render();
    }
}
