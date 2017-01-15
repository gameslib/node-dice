class ScoreComponent {
    constructor(id, name1, name2) {
        this.available = false;
        this.owned = false;
        this.baseColor = 'black';
        this.id = id;
        this.name = name1 + ' ' + name2;
        this.finalValue = 0;
        this.possibleValue = 0;
        this.scoringDieset = [0, 0, 0, 0, 0];
    }
    setOwned(value) {
        this.owned = value;
        if (this.owned) {
            this.owner = App.currentPlayer;
            this.updateScoreElement(this.owner.color, this.possibleValue.toString());
        }
        else {
            this.owner = null;
            this.updateScoreElement(null, ScoreComponent.zero);
        }
    }
    renderValue(value) {
        let eventName = 'RenderValue' + this.id;
        Events.fire(eventName, {
            valueString: value,
            available: this.available
        });
    }
    updateScoreElement(color, value) {
        let eventName = 'UpdateScoreElement' + this.id;
        Events.fire(eventName, {
            color: color,
            valueString: value,
            available: this.available
        });
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
        if (App.dice.toString() === '[00000]') {
            return false;
        }
        let scoreTaken = false;
        if (!this.owned) {
            if (this.possibleValue === 0) {
                App.currentPlayer.lastScore = 'sacrificed ' + this.name + ' ' + App.dice.toString();
                app.logLine(App.currentPlayer.name + ' ' + App.currentPlayer.lastScore, app.scoreMsg);
            }
            else {
                let wasTaken = (App.currentPlayer == App.thisPlayer) ? 'takes ' : 'took ';
                App.currentPlayer.lastScore = wasTaken + this.name + ' ' + App.dice.toString();
                app.logLine(App.currentPlayer.name + ' ' + App.currentPlayer.lastScore, app.scoreMsg);
            }
            if (this.id === Possible.FiveOfaKind) {
                if (App.dice.isFiveOfaKind) {
                    App.dice.fiveOfaKindBonusAllowed = true;
                    app.sounds.play(app.sounds.heehee);
                }
                else {
                    App.dice.fiveOfaKindWasSacrificed = true;
                    app.sounds.play(app.sounds.dohh);
                }
            }
            this.setValue();
            scoreTaken = true;
        }
        else if (this.available) {
            App.currentPlayer.lastScore = 'stole ' + this.name + ' ' + App.dice.toString() + ' was: ' + this.scoringDieset.toString();
            app.logLine(App.currentPlayer.name + ' ' + App.currentPlayer.lastScore, app.scoreMsg);
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
            this.scoringDieset[index] = App.dice.die[index].value;
        });
        if (App.dice.isFiveOfaKind) {
            if (App.dice.fiveOfaKindBonusAllowed) {
                App.dice.fiveOfaKindCount += 1;
                if (this.id !== Possible.FiveOfaKind) {
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
        this.possibleValue = ScoreComponent.possible.evaluate(this.id);
        if (!this.owned) {
            if (this.possibleValue === 0) {
                this.renderValue(ScoreComponent.zero);
            }
            else {
                this.renderValue(this.possibleValue.toString());
            }
            this.setAvailable(true);
        }
        else if (App.currentPlayer !== this.owner) {
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
        this.updateScoreElement(this.baseColor, ScoreComponent.zero);
        this.hasFiveOfaKind = false;
    }
    clearPossible() {
        this.possibleValue = 0;
        this.setAvailable(false);
        if (!this.owned) {
            this.finalValue = 0;
            this.renderValue(ScoreComponent.zero);
        }
        else {
            this.renderValue(this.finalValue.toString());
        }
    }
}
ScoreComponent.zero = '';
