class Game {
    constructor() {
        this.gameOver = false;
        this.leftTotal = 0;
        this.rightTotal = 0;
        this.yahtzBonus = 0;
        this.leftBonus = 0;
        this.self = this;
        UI.buildPlayerElements(this);
        var person = prompt("Please enter your name", "Nick");
        App.thisID = genId();
        App.players[0] = (new Player(App.thisID, person, 'red', 0, App.playerElements[0]));
        Game.thisPlayer = App.players[0];
        Game.currentPlayer = Game.thisPlayer;
        socketSend('loggedIn', {
            'id': App.thisID,
            'name': person
        });
        socket.onmessage = (message) => {
            var d = JSON.parse(message.data);
            var messageName = d.name;
            var data = d.data;
            switch (messageName) {
                case 'setPlayers':
                    setPlayers(data);
                    break;
                case 'updateRoll':
                    this.rollTheDice(data);
                    break;
                case 'updateDie':
                    app.dice.die[data.dieNumber].clicked();
                    break;
                case 'updateScore':
                    UI.scoreElements[parseInt(data.scoreNumber, 10)].clicked();
                    break;
                case 'resetTurn':
                    Game.currentPlayer = App.players[data.currentPlayerIndex];
                    this.resetTurn();
                    break;
                case 'resetGame':
                    Game.currentPlayer = App.players[data.currentPlayerIndex];
                    this.resetGame();
                    break;
                default:
                    break;
            }
        };
        let ui = new UI();
        const self = this;
        app.game = this;
        app.sounds = new Sounds();
        app.dice = new Dice();
        app.possible = new Possible();
        UI.buildScoreElements(this);
        ontouch(Game.doc, function (touchobj, phase, distX, distY) {
            if (phase !== 'start') {
                return;
            }
            var target = touchobj.target;
            if (Game.currentPlayer === Game.thisPlayer) {
                var className = target.getAttribute('class');
                var elementID = target.getAttribute('data-id');
                var index = parseInt(elementID, 10);
                if (elementID === 'rollButton') {
                    self.rollTheDice({ id: App.thisID });
                }
                else if (elementID === 'exit_menu') {
                    window.close();
                    setTimeout(() => { alert("Please close the 'Browser-Tab' to exit this program!"); }, 250);
                }
                else if (elementID === 'status_menu') {
                    alert('status');
                }
                else if (className === 'die') {
                    app.dice.die[index].clicked();
                    socketSend('dieClicked', { 'dieNumber': index });
                }
                else if (className === 'shaddowed score-container'
                    || className === 'score-label'
                    || className === 'score-value available') {
                    if (Dice.evaluator.sumOfAllDie > 0) {
                        let elemIndex = parseInt(elementID, 10);
                        socketSend('scoreClicked', {
                            'id': App.thisID,
                            'scoreNumber': elemIndex
                        });
                        if (UI.scoreElements[elemIndex].clicked()) {
                            socketSend('turnOver', {
                                'id': App.thisID
                            });
                        }
                    }
                }
            }
        });
        this.resetGame();
    }
    showPlayerScores(player) {
        let message;
        message = 'Your Scoring Statistics:' + '\n ' + '\n';
        document.getElementById('scoresContent').textContent = message;
        app.scoresDialog.showModal();
    }
    rollTheDice(data) {
        app.sounds.play(app.sounds.roll);
        if (this.gameOver) {
            socketSend('gameOver', {
                'id': App.thisID
            });
        }
        if (data.id === App.thisID) {
            app.dice.roll();
            socketSend('playerRolled', {
                'id': App.thisID,
                'dice': app.dice.die
            });
        }
        else {
            app.dice.roll(data.dice);
        }
        this.evaluatePossibleScores();
        switch (Dice.rollCount) {
            case 1:
                this.rollButton.textContent = 'Roll Again';
                break;
            case 2:
                this.rollButton.textContent = 'Last Roll';
                break;
            case 3:
                this.rollButton.disabled = true;
                this.rollButton.textContent = 'Select Score';
                break;
            default:
                this.rollButton.textContent = 'Roll Dice';
                Dice.rollCount = 0;
        }
    }
    clearPossibleScores() {
        UI.scoreElements.forEach(function (thisElement) {
            thisElement.clearPossible();
        });
    }
    evaluatePossibleScores() {
        UI.scoreElements.forEach(function (thisElement) {
            thisElement.setPossible();
        });
    }
    resetTurn() {
        this.rollButton.style.backgroundColor = Game.currentPlayer.color;
        this.gameOver = this.isGameComplete();
        this.rollButton.disabled = false;
        app.dice.resetTurn();
        if (this.gameOver) {
            this.clearPossibleScores();
            this.setLeftScores();
            this.setRightScores();
            if (App.players.length > 1) {
                let winner;
                let highscore = 0;
                App.players.forEach(function (thisPlayer) {
                    if (thisPlayer.score > highscore) {
                        highscore = thisPlayer.score;
                        winner = thisPlayer;
                    }
                });
                this.showFinalScore(winner);
            }
            else {
                this.showFinalScore(App.players[App.myIndex]);
            }
        }
        else {
            this.rollButton.textContent = 'Roll Dice';
            this.clearPossibleScores();
            this.setLeftScores();
            this.setRightScores();
        }
    }
    showFinalScore(winner) {
        var winMsg;
        if (winner !== Game.thisPlayer) {
            app.sounds.play(app.sounds.nooo);
            winMsg = ' wins with ';
        }
        else {
            app.sounds.play(app.sounds.woohoo);
            winMsg = ' win with ';
        }
        this.rollButton.innerHTML = 'Roll Dice';
        app.logLine(winner.name + winMsg + winner.score, app.scoreMsg);
        this.rollButton.style.backgroundColor = winner.color;
        Game.currentPlayer = App.players[App.myIndex];
    }
    setLeftScores() {
        this.leftTotal = 0;
        App.players.forEach((player) => {
            player.score = 0;
        });
        var val;
        for (var i = 0; i < 6; i++) {
            val = UI.scoreElements[i].finalValue;
            if (val > 0) {
                this.leftTotal += val;
                UI.scoreElements[i].owner.addScore(val);
                if (UI.scoreElements[i].hasFiveOfaKind && (app.dice.fiveOfaKindCount > 1)) {
                    UI.scoreElements[i].owner.addScore(100);
                }
            }
        }
        if (this.leftTotal > 62) {
            this.leftScoreElement.textContent = '^ total = ' + this.leftTotal.toString() + ' + 35';
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
            this.leftScoreElement.textContent = '^ total = ' + this.leftTotal.toString();
        }
        if (this.leftTotal === 0) {
            this.leftScoreElement.textContent = '^ total = 0';
        }
    }
    setRightScores() {
        let val;
        let len = UI.scoreElements.length;
        for (var i = 6; i < len; i++) {
            val = UI.scoreElements[i].finalValue;
            if (val > 0) {
                UI.scoreElements[i].owner.addScore(val);
                if (UI.scoreElements[i].hasFiveOfaKind && (app.dice.fiveOfaKindCount > 1) && (i !== UI.FiveOfaKind)) {
                    UI.scoreElements[i].owner.addScore(100);
                }
            }
        }
    }
    isGameComplete() {
        let result = true;
        UI.scoreElements.forEach(function (thisElement) {
            if (!thisElement.owned) {
                result = false;
            }
        });
        return result;
    }
    resetGame() {
        app.dice = new Dice();
        app.dice.resetGame();
        UI.scoreElements.forEach(function (thisElement) {
            thisElement.reset();
        });
        UI.resetScoreElements();
        this.gameOver = false;
        this.leftBonus = 0;
        this.yahtzBonus = 0;
        this.leftTotal = 0;
        this.rightTotal = 0;
        this.leftScoreElement.textContent = '^ total = 0';
        App.players.forEach((player) => {
            player.resetScore();
        });
        this.rollButton.style.backgroundColor = Game.currentPlayer.color;
        this.rollButton.textContent = 'Roll Dice';
        this.rollButton.disabled = false;
    }
}
Game.doc = document.body;
