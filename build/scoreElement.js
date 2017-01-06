class ScoreElement {
    constructor(id, name1, name2, left, top, isLeftHanded) {
        this.score = '00';
        this.originalColor = 'black';
        this.color = 'black';
        this.owned = false;
        this.id = id;
        this.line1 = name1;
        this.line2 = name2;
        this.name = name1 + ' ' + name2;
        this.x = left;
        this.y = top;
        this.finalValue = 0;
        this.possibleValue = 0;
        this.label = name;
        this.scoringDieset = [0, 0, 0, 0, 0];
        this.isLeftHanded = isLeftHanded;
        if (isLeftHanded) {
            this.path = PathBuilder.BuildLeftScore(left, top);
            this.textLabel1 = new labelElement(this.line1, this.x + 55, this.y + 40, 85, 30, this.color, Board.textColor);
            this.textLabel2 = new labelElement(this.line2, this.x + 55, this.y + 70, 85, 30, this.color, Board.textColor);
            this.scoreLable = new labelElement('', this.x + 132, this.y + 27, 30, 30, this.color, Board.textColor);
        }
        else {
            this.path = PathBuilder.BuildRightScore(left, top);
            this.textLabel1 = new labelElement(this.line1, this.x + 110, this.y + 40, 85, 30, this.color, Board.textColor);
            this.textLabel2 = new labelElement(this.line2, this.x + 110, this.y + 70, 85, 30, this.color, Board.textColor);
            this.scoreLable = new labelElement('', this.x + 28, this.y + 77, 30, 30, this.color, Board.textColor);
        }
    }
    setOwned(value) {
        this.owned = value;
        if (this.owned) {
            this.owner = Board.currentPlayer;
            this.color = this.owner.color;
            this.textLabel1.backgroundColor = this.color;
            this.textLabel2.backgroundColor = this.color;
            this.render(this.color);
            this.renderValue(this.possibleValue.toString());
        }
        else {
            this.owner = null;
            this.textLabel1.backgroundColor = this.originalColor;
            this.textLabel2.backgroundColor = this.originalColor;
            this.render(this.originalColor);
            this.renderValue(ScoreElement.zero);
        }
    }
    setAvailable(value) {
        this.available = value;
        if (this.available) {
            if (this.possibleValue > 0) {
                this.renderValue(this.possibleValue.toString());
            }
        }
        else {
            if (this.owned) {
                this.renderValue(this.possibleValue.toString());
            }
            this.renderValue(this.possibleValue.toString());
        }
    }
    clicked() {
        if (Board.Dice.toString() === '[00000]') {
            return false;
        }
        let scoreTaken = false;
        if (!this.owned) {
            if (this.possibleValue === 0) {
                Board.currentPlayer.lastScore = 'sacrificed ' + this.name + ' ' + Board.Dice.toString();
                app.logLine(Board.currentPlayer.name + ' ' + Board.currentPlayer.lastScore, app.scoreMsg);
            }
            else {
                let wasTaken = (Board.currentPlayer == Board.thisPlayer) ? 'takes ' : 'took ';
                Board.currentPlayer.lastScore = wasTaken + this.name + ' ' + Board.Dice.toString();
                app.logLine(Board.currentPlayer.name + ' ' + Board.currentPlayer.lastScore, app.scoreMsg);
            }
            if (this.id === UI.FiveOfaKind) {
                if (Board.Dice.isFiveOfaKind) {
                    Board.Dice.fiveOfaKindBonusAllowed = true;
                    app.sounds.play(app.sounds.heehee);
                }
                else {
                    Board.Dice.fiveOfaKindWasSacrificed = true;
                    app.sounds.play(app.sounds.dohh);
                }
            }
            this.setValue();
            scoreTaken = true;
        }
        else if (this.available) {
            Board.currentPlayer.lastScore = 'stole ' + this.name + ' ' + Board.Dice.toString() + ' was: ' + this.scoringDieset.toString();
            app.logLine(Board.currentPlayer.name + ' ' + Board.currentPlayer.lastScore, app.scoreMsg);
            this.setOwned(false);
            app.sounds.play(app.sounds.heehee);
            this.setValue();
            scoreTaken = true;
        }
        return scoreTaken;
    }
    setValue() {
        this.setOwned(true);
        var thisValue = this.possibleValue;
        this.finalValue = thisValue;
        this.scoringDieset.forEach((die, index) => {
            this.scoringDieset[index] = Board.Dice.die[index].value;
        });
        if (Board.Dice.isFiveOfaKind) {
            if (Board.Dice.fiveOfaKindBonusAllowed) {
                Board.Dice.fiveOfaKindCount += 1;
                if (this.id !== UI.FiveOfaKind) {
                    this.finalValue += 100;
                }
                this.hasFiveOfaKind = true;
                app.sounds.play(app.sounds.heehee);
            }
            else {
                this.hasFiveOfaKind = false;
                app.sounds.play(app.sounds.cluck);
            }
        }
        else {
            this.hasFiveOfaKind = false;
            if (thisValue === 0) {
                app.sounds.play(app.sounds.dohh);
            }
            else {
                app.sounds.play(app.sounds.cluck);
            }
        }
    }
    setPossible() {
        this.possibleValue = Board.possible.evaluate(this.id);
        if (!this.owned) {
            if (this.possibleValue === 0) {
                this.renderValue(ScoreElement.zero);
            }
            else {
                this.renderValue(this.possibleValue.toString());
            }
            this.setAvailable(true);
        }
        else if (Board.currentPlayer !== this.owner) {
            if (this.possibleValue > this.finalValue) {
                if (!this.hasFiveOfaKind) {
                    this.setAvailable(true);
                    this.renderValue(this.possibleValue.toString());
                }
            }
        }
    }
    reset() {
        this.setOwned(false);
        this.finalValue = 0;
        this.possibleValue = 0;
        this.color = this.originalColor;
        this.scoreLable.backgroundColor = this.originalColor;
        this.render(this.originalColor);
        this.renderValue(ScoreElement.zero);
        this.hasFiveOfaKind = false;
    }
    clearPossible() {
        this.possibleValue = 0;
        this.setAvailable(false);
        if (!this.owned) {
            this.finalValue = 0;
            this.renderValue(ScoreElement.zero);
        }
        else {
            this.renderValue(this.finalValue.toString());
        }
    }
    hitTest(x, y) {
        return Board.Surface.isPointInPath(this.path, x, y);
    }
    render(thisColor) {
        Board.Surface.fillStyle = thisColor;
        Board.Surface.fill(this.path);
        UI.RenderText(this.textLabel1);
        UI.RenderText(this.textLabel2);
    }
    renderValue(scoretext) {
        let scoreBoxColor = (this.available) ? '#225522' : this.color;
        if (scoretext === ScoreElement.zero) {
            scoreBoxColor = this.color;
        }
        this.scoreLable.backgroundColor = scoreBoxColor;
        this.scoreLable.text = scoretext;
    }
}
ScoreElement.zero = '';
