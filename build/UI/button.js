class Button {
    constructor(location, size, clickable) {
        this._backgroundColor = 'black';
        this.children = [];
        this.disabled = false;
        this.clickable = clickable;
        this.children.push(new Label(0, 'Roll Dice', { left: location.left + 90, top: location.top + 40 }, { width: size.width - 25, height: 40 }, 'blue', UI.textColor, false));
        this.location = location;
        this.size = size;
        this.buildPath();
        this.firstPass = true;
        this.render();
        if (clickable) {
            UI.clickables.push(this);
        }
        Events.on('RollUpdate', (data) => {
            this.disabled = data.disabled;
            this._backgroundColor = data.color;
            this.children[0].color = data.color;
            this.text = data.text;
        });
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
    onClick(broadcast, x, y) {
        if (!this.disabled) {
            if (broadcast) {
                Events.fire('RollButtonClicked', {});
            }
        }
    }
    render() {
        if (this.firstPass) {
            surface.shadowColor = 'burlywood';
        }
        surface.fillStyle = this._backgroundColor;
        surface.fill(this.path);
        surface.fillStyle = UI.textColor;
        if (this.firstPass) {
            this.firstPass = false;
            surface.shadowColor = 'transparent';
        }
        this.children[0].render();
    }
}
