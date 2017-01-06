class UI {
    static buildScoreElements() {
        let scTop = 190;
        let scLeft = Board.canvas.clientLeft + 25;
        let scRight = scLeft + Board.scoreWidth + 5;
        let righOffset = (Board.scoreWidth * 2) + 80;
        Board.scoreElement.push(new ScoreElement(0, 'Ones', '', scLeft, scTop, true));
        Board.scoreElement.push(new ScoreElement(1, 'Twos', '', scRight, scTop, false));
        Board.scoreElement.push(new ScoreElement(2, 'Threes', '', scLeft, scTop + 100, true));
        Board.scoreElement.push(new ScoreElement(3, 'Fours', '', scRight, scTop + 100, false));
        Board.scoreElement.push(new ScoreElement(4, 'Fives', '', scLeft, scTop + 200, true));
        Board.scoreElement.push(new ScoreElement(5, 'Sixes', '', scRight, scTop + 200, false));
        Board.scoreElement.push(new ScoreElement(UI.ThreeOfaKind, 'Three', 'O-Kind', scLeft + righOffset, scTop, true));
        Board.scoreElement.push(new ScoreElement(UI.FourOfaKind, 'Four', 'O-Kind', scRight + righOffset, scTop, false));
        Board.scoreElement.push(new ScoreElement(UI.SmallStraight, 'Small', 'Straight', scLeft + righOffset, scTop + 100, true));
        Board.scoreElement.push(new ScoreElement(UI.LargeStraight, 'Large', 'Straight', scRight + righOffset, scTop + 100, false));
        Board.scoreElement.push(new ScoreElement(UI.House, 'Full', 'House', scLeft + righOffset, scTop + 200, true));
        Board.scoreElement.push(new ScoreElement(UI.FiveOfaKind, 'Five', 'O-Kind', scRight + righOffset, scTop + 200, false));
        Board.scoreElement.push(new ScoreElement(UI.Chance, 'Chance', '', scLeft + righOffset, scTop + 300, true));
        UI.renderScoreElements();
    }
    static renderScoreElements() {
        Board.Surface.shadowColor = 'burlywood';
        Board.Surface.shadowBlur = 10;
        Board.Surface.shadowOffsetX = 3;
        Board.Surface.shadowOffsetY = 3;
        for (let i = 0; i < Board.scoreElement.length; i++) {
            Board.scoreElement[i].render('black');
        }
    }
    static buildPlayerElements() {
        Board.playerScoreElements = new Array;
        Board.playerScoreElements[0] = new labelElement('', 100, 40, 125, 35, Board.textColor, 'black');
        Board.playerScoreElements[1] = new labelElement('', 100, 65, 125, 35, Board.textColor, 'black');
        Board.playerScoreElements[2] = new labelElement('', 475, 40, 125, 35, Board.textColor, 'black');
        Board.playerScoreElements[3] = new labelElement('', 475, 65, 125, 35, Board.textColor, 'black');
    }
    static resetPlayersScoreElements() {
        for (var i = 0; i < 4; i++) {
            Board.playerScoreElements[i].textColor = 'black';
            Board.playerScoreElements[i].text = '';
        }
    }
    static RenderText(t) {
        Board.Surface.fillStyle = t.backgroundColor;
        Board.Surface.fillRect(t.rectX, t.rectY, t.width, t.height);
        Board.Surface.fillStyle = t.textColor;
        Board.Surface.strokeStyle = t.textColor;
        Board.Surface.fillText(t.text, t.left, t.top);
        Board.Surface.strokeText(t.text, t.left, t.top);
    }
}
UI.ThreeOfaKind = 6;
UI.FourOfaKind = 7;
UI.SmallStraight = 8;
UI.LargeStraight = 9;
UI.House = 10;
UI.FiveOfaKind = 11;
UI.Chance = 12;
class ButtonElement {
    constructor(left, top, width, height) {
        this._backgroundColor = 'black';
        this.disabled = false;
        this.textLabel = new labelElement('Roll Dice', left + 90, top + 40, width - 25, 40, 'blue', Board.textColor);
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        let path = new Path2D();
        this.path = PathBuilder.BuildRectangle(left, top, width, height);
        this.firstPass = true;
        this.render();
    }
    get text() {
        return this.textLabel.text;
    }
    set text(newText) {
        this.textLabel.text = newText;
        this.render();
    }
    get backgroundColor() {
        return this._backgroundColor;
    }
    set backgroundColor(color) {
        this._backgroundColor = color;
        this.textLabel.backgroundColor = color;
        this.render();
    }
    render() {
        if (this.firstPass) {
            Board.Surface.shadowColor = 'burlywood';
            Board.Surface.shadowBlur = 10;
            Board.Surface.shadowOffsetX = 3;
            Board.Surface.shadowOffsetY = 3;
        }
        Board.Surface.fillStyle = this._backgroundColor;
        Board.Surface.fill(this.path);
        Board.Surface.fillStyle = Board.textColor;
        if (this.firstPass) {
            this.firstPass = false;
            Board.Surface.shadowColor = 'transparent';
            Board.Surface.shadowBlur = 0;
            Board.Surface.shadowOffsetX = 0;
            Board.Surface.shadowOffsetY = 0;
        }
        UI.RenderText(this.textLabel);
    }
}
class labelElement {
    get text() {
        return this._text;
    }
    set text(newText) {
        this._text = newText;
        UI.RenderText(this);
    }
    constructor(text, left, top, width, height, backgroundColor, textColor) {
        this.left = left;
        this.rectX = left - (width * 0.52);
        this.top = top;
        this.rectY = top - (height * 0.7);
        this.width = width;
        this.height = height;
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
        this.text = text;
    }
}
