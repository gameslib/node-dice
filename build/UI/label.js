class Label {
    constructor(id, text, location, size, color = 'black', textColor = UI.textColor, clickable) {
        this.children = [];
        this.textLocation = { left: 0, top: 0 };
        this.id = id;
        this.clickable = clickable;
        this.location = location;
        this.textLocation.left = location.left - (size.width * 0.5);
        this.size = size;
        this.textLocation.top = location.top - (size.height * 0.7);
        this.size = size;
        this.color = color;
        this.textColor = textColor;
        this.buildPath();
        if (clickable) {
            UI.clickables.push(this);
        }
        this.text = text;
    }
    get text() {
        return this._text;
    }
    set text(newText) {
        this._text = newText;
        this.render();
        this.size.width = Math.floor(surface.measureText(newText).width);
        if (this.size.width < 35) {
            this.size.width = 35;
        }
        this.textLocation.left = this.location.left - (this.size.width * 0.5);
    }
    buildPath() {
        let p = new Path2D;
        p.rect(this.textLocation.left, this.textLocation.top, this.size.width, this.size.height);
        this.path = p;
    }
    onClick(broadcast, x, y) {
        if (broadcast) {
            App.socketSend('label-' + this.id, { label: this.id });
        }
    }
    render() {
        surface.fillStyle = this.color;
        surface.fillRect(this.textLocation.left, this.textLocation.top, this.size.width, this.size.height);
        surface.fillStyle = this.textColor;
        surface.strokeStyle = this.textColor;
        surface.fillText(this.text, this.location.left, this.location.top);
        surface.strokeText(this.text, this.location.left, this.location.top);
    }
}
