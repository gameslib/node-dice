class ScoreElement {
    constructor(id, location, size, isLeftHanded, label1, label2) {
        this.children = [];
        this.text = '';
        this.color = 'black';
        this.id = id;
        this.location = location;
        this.size = size;
        this.isLeftHanded = isLeftHanded;
        this.label1 = label1;
        this.label2 = label2;
        this.buildPath();
        Events.on('UpdateScoreElement' + this.id, (data) => {
            this.color = data.color;
            this.children[0].color = this.color;
            this.children[1].color = this.color;
            this.render();
            this.renderValue(data.valueString, data.available);
        });
        Events.on('RenderValue' + this.id, (data) => {
            this.renderValue(data.valueString, data.available);
        });
    }
    buildPath() {
        let textSize = { width: 85, height: 30 };
        let scoreSize = { width: 30, height: 30 };
        if (this.isLeftHanded) {
            this.path = PathBuilder.BuildLeftScore(this.location, this.size, 10);
            this.children.push(new Label(this.label1, { left: this.location.left + 55, top: this.location.top + 40 }, textSize, this.color, UI.textColor), new Label(this.label2, { left: this.location.left + 55, top: this.location.top + 70 }, textSize, this.color, UI.textColor), new Label('', { left: this.location.left + 129, top: this.location.top + 29 }, scoreSize, this.color, UI.textColor));
        }
        else {
            this.path = PathBuilder.BuildRightScore(this.location, this.size, 10);
            this.children.push(new Label(this.label1, { left: this.location.left + 100, top: this.location.top + 40 }, textSize, this.color, UI.textColor), new Label(this.label2, { left: this.location.left + 100, top: this.location.top + 70 }, textSize, this.color, UI.textColor), new Label('', { left: this.location.left + 22, top: this.location.top + 79 }, scoreSize, this.color, UI.textColor));
        }
    }
    hitTest(x, y) {
        return surface.isPointInPath(this.path, x, y);
    }
    clicked() {
        console.log('score-' + this.id + ' clicked');
        App.socketSend('scoreClicked', {
            'id': App.thisID,
            'scoreNumber': this.id
        });
        if (Game.scoreItems[this.id].clicked()) {
            App.socketSend('turnOver', {
                'id': App.thisID
            });
            Events.fire('ScoreWasSelected', {});
        }
    }
    render() {
        surface.fillStyle = this.color;
        surface.fill(this.path);
        this.children[0].render();
        this.children[1].render();
    }
    renderValue(scoretext, available) {
        let scoreBoxColor = (available) ? 'Green' : this.color;
        if (scoretext === ScoreComponent.zero) {
            scoreBoxColor = this.color;
        }
        this.children[2].color = scoreBoxColor;
        this.children[2].text = scoretext;
    }
}
