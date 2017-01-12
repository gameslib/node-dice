class UI {
    static buildScoreElements(top, left, width, height) {
        UI.scoreElement = new Array();
        let se = UI.scoreElement;
        let scTop = top;
        let scLeft = left;
        let scRight = scLeft + (width * 0.72);
        let righOffset = (width * 2) - (width * 0.15);
        let size = { width: width, height: height };
        se.push(new ScoreElement(0, 'Ones', '', { left: scLeft, top: scTop }, size, true));
        se.push(new ScoreElement(1, 'Twos', '', { left: scRight, top: scTop }, size, false));
        se.push(new ScoreElement(2, 'Threes', '', { left: scLeft, top: scTop + 100 }, size, true));
        se.push(new ScoreElement(3, 'Fours', '', { left: scRight, top: scTop + 100 }, size, false));
        se.push(new ScoreElement(4, 'Fives', '', { left: scLeft, top: scTop + 200 }, size, true));
        se.push(new ScoreElement(5, 'Sixes', '', { left: scRight, top: scTop + 200 }, size, false));
        se.push(new ScoreElement(UI.ThreeOfaKind, 'Three', 'O-Kind', { left: scLeft + righOffset, top: scTop }, size, true));
        se.push(new ScoreElement(UI.FourOfaKind, 'Four', 'O-Kind', { left: scRight + righOffset, top: scTop }, size, false));
        se.push(new ScoreElement(UI.SmallStraight, 'Small', 'Straight', { left: scLeft + righOffset, top: scTop + 100 }, size, true));
        se.push(new ScoreElement(UI.LargeStraight, 'Large', 'Straight', { left: scRight + righOffset, top: scTop + 100 }, size, false));
        se.push(new ScoreElement(UI.House, 'Full', 'House', { left: scLeft + righOffset, top: scTop + 200 }, size, true));
        se.push(new ScoreElement(UI.FiveOfaKind, 'Five', 'O-Kind', { left: scRight + righOffset, top: scTop + 200 }, size, false));
        se.push(new ScoreElement(UI.Chance, 'Chance', '', { left: scLeft + righOffset, top: scTop + 300 }, size, true));
        UI.renderScoreElements();
    }
    static renderScoreElements() {
        surface.shadowColor = 'burlywood';
        surface.shadowBlur = 10;
        surface.shadowOffsetX = 3;
        surface.shadowOffsetY = 3;
        for (let i = 0; i < UI.scoreElement.length; i++) {
            UI.scoreElement[i].ui.render();
        }
    }
    static buildPlayerElements() {
        App.playerScoreElements = new Array;
        App.playerScoreElements[0] = new Label('', { left: 100, top: 40 }, { width: 125, height: 35 }, Board.textColor, 'black');
        App.playerScoreElements[1] = new Label('', { left: 100, top: 65 }, { width: 125, height: 35 }, Board.textColor, 'black');
        App.playerScoreElements[2] = new Label('', { left: 475, top: 40 }, { width: 125, height: 35 }, Board.textColor, 'black');
        App.playerScoreElements[3] = new Label('', { left: 475, top: 65 }, { width: 125, height: 35 }, Board.textColor, 'black');
    }
    static resetPlayersScoreElements() {
        for (var i = 0; i < 4; i++) {
            App.playerScoreElements[i].textColor = 'black';
            App.playerScoreElements[i].text = '';
        }
    }
}
UI.ThreeOfaKind = 6;
UI.FourOfaKind = 7;
UI.SmallStraight = 8;
UI.LargeStraight = 9;
UI.House = 10;
UI.FiveOfaKind = 11;
UI.Chance = 12;
