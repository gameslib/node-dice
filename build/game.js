class Game {
    constructor() {
        this.leftBonus = 0;
        this.fiveOkindBonus = 0;
        this.leftTotal = 0;
        this.rightTotal = 0;
        this.uiRollState = { text: '', color: '', disabled: false };
        app.sounds = new Sounds();
        App.thisID = App.generateID();
        App.playerScoreElements = new Array();
        ScoreComponent.possible = Possible.getInstance();
        UI.initialize();
        let person = 'bbb';
        App.players[0] = (new Player(App.thisID, person, 'red', 0, App.playerScoreElements[0]));
        App.thisPlayer = App.players[0];
        App.currentPlayer = App.thisPlayer;
        App.socketSend('LoggedIn', {
            id: App.thisID,
            name: person
        });
        socket.onmessage = (message) => {
            let d = JSON.parse(message.data);
            let messageName = d.name;
            let data = d.data;
            switch (messageName) {
                case 'SetPlayers':
                    App.setPlayers(data);
                    break;
                case 'UpdateRoll':
                    this.rollTheDice(data);
                    break;
                case 'UpdateDie':
                    App.dice.die[data.dieNumber].onClick(false, 0, 0);
                    break;
                case 'UpdateScore':
                    Game.scoreItems[parseInt(data.scoreNumber, 10)].clicked();
                    break;
                case 'ResetTurn':
                    this.isGameComplete();
                    App.currentPlayer = App.players[data.currentPlayerIndex];
                    this.resetTurn();
                    break;
                case 'ResetGame':
                    App.currentPlayer = App.players[data.currentPlayerIndex];
                    this.resetGame();
                    break;
                default:
                    break;
            }
        };
        Events.on('ResetGame', () => {
            App.socketSend('GameOver', {
                'id': App.thisID
            });
            this.resetGame();
        });
        Events.on('GameOver', () => {
            this.clearPossibleScores();
            this.setLeftScores();
            this.setRightScores();
            this.showFinalScore(this.getWinner());
        });
        Events.on('ScoreWasSelected', () => {
            this.isGameComplete();
            this.resetTurn();
        });
        Events.on('RollButtonClicked', () => {
            this.rollTheDice({ id: App.thisID });
        });
        this.resetGame();
    }
    static getInstance() {
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    }
    rollTheDice(data) {
        console.log('id: ' + data.id + ' myId: ' + App.thisID);
        if (data.id === App.thisID) {
            app.sounds.play(app.sounds.roll);
            App.dice.roll();
            App.socketSend('PlayerRolled', {
                'id': App.thisID,
                'dice': App.dice.die
            });
        }
        else {
            App.dice.roll(data.dice);
        }
        this.evaluatePossibleScores();
        switch (Dice.rollCount) {
            case 1:
                this.uiRollState.text = 'Roll Again';
                break;
            case 2:
                this.uiRollState.text = 'Last Roll';
                break;
            case 3:
                this.uiRollState.disabled = true;
                this.uiRollState.text = 'Select Score';
                break;
            default:
                this.uiRollState.text = 'Roll Dice';
                Dice.rollCount = 0;
        }
        this.updateRollUi();
    }
    updateRollUi() {
        Events.fire('RollUpdate', (this.uiRollState));
    }
    getWinner() {
        if (App.players.length = 1)
            return App.players[App.myIndex];
        let thisWinner;
        let highscore = 0;
        App.players.forEach(function (thisPlayer) {
            if (thisPlayer.score > highscore) {
                highscore = thisPlayer.score;
                thisWinner = thisPlayer;
            }
        });
        return thisWinner;
    }
    clearPossibleScores() {
        Game.scoreItems.forEach(function (thisElement) {
            thisElement.clearPossible();
        });
    }
    evaluatePossibleScores() {
        Game.scoreItems.forEach(function (thisElement) {
            thisElement.setPossible();
        });
    }
    resetTurn() {
        this.uiRollState.color = App.currentPlayer.color;
        this.uiRollState.disabled = false;
        this.updateRollUi();
        App.dice.resetTurn();
        this.uiRollState.text = 'Roll Dice';
        this.clearPossibleScores();
        this.setLeftScores();
        this.setRightScores();
    }
    resetGame() {
        App.dice.resetGame();
        Game.scoreItems.forEach(function (thisComponent) {
            thisComponent.reset();
        });
        UI.resetPlayersScoreElements();
        this.leftBonus = 0;
        this.fiveOkindBonus = 0;
        this.leftTotal = 0;
        this.rightTotal = 0;
        UI.leftScoreElement.text = '^ total = 0';
        App.players.forEach((player) => {
            player.resetScore();
        });
        App.currentPlayer = App.players[0];
        this.uiRollState.color = App.currentPlayer.color;
        this.uiRollState.text = 'Roll Dice';
        this.uiRollState.disabled = false;
        this.updateRollUi();
    }
    showFinalScore(winner) {
        var winMsg;
        if (winner !== App.thisPlayer) {
            app.sounds.play(app.sounds.nooo);
            winMsg = winner.name + ' wins!';
        }
        else {
            app.sounds.play(app.sounds.woohoo);
            winMsg = 'You won!';
        }
        this.uiRollState.color = 'black';
        this.uiRollState.text = winMsg;
        this.updateRollUi();
        app.logLine(winMsg + ' ' + winner.score, app.scoreMsg);
        UI.popup.show(winMsg + ' ' + winner.score);
        App.currentPlayer = App.players[App.myIndex];
    }
    isGameComplete() {
        let result = true;
        Game.scoreItems.forEach(function (thisComponent) {
            if (!thisComponent.owned) {
                result = false;
            }
        });
        if (result === true) {
            Events.fire('GameOver', '');
        }
    }
    setLeftScores() {
        this.leftTotal = 0;
        App.players.forEach((player) => {
            player.score = 0;
        });
        var val;
        for (var i = 0; i < 6; i++) {
            val = Game.scoreItems[i].finalValue;
            if (val > 0) {
                this.leftTotal += val;
                Game.scoreItems[i].owner.addScore(val);
                if (Game.scoreItems[i].hasFiveOfaKind && (App.dice.fiveOfaKindCount > 1)) {
                    Game.scoreItems[i].owner.addScore(100);
                }
            }
        }
        if (this.leftTotal > 62) {
            UI.leftScoreElement.text = '^ total = ' + this.leftTotal.toString() + ' + 35';
            let bonusWinner;
            let highleft = 0;
            App.players.forEach(function (thisPlayer) {
                if (thisPlayer.score > highleft) {
                    highleft = thisPlayer.score;
                    bonusWinner = thisPlayer;
                }
            });
            bonusWinner.addScore(35);
        }
        else {
            UI.leftScoreElement.text = '^ total = ' + this.leftTotal.toString();
        }
        if (this.leftTotal === 0) {
            UI.leftScoreElement.text = '^ total = 0';
        }
    }
    setRightScores() {
        let val;
        let len = Game.scoreItems.length;
        for (var i = 6; i < len; i++) {
            val = Game.scoreItems[i].finalValue;
            if (val > 0) {
                Game.scoreItems[i].owner.addScore(val);
                if (Game.scoreItems[i].hasFiveOfaKind && (App.dice.fiveOfaKindCount > 1) && (i !== Possible.FiveOfaKind)) {
                    Game.scoreItems[i].owner.addScore(100);
                }
            }
        }
    }
}
Game.scoreItems = [];
