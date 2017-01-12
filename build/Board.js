class Board {
    constructor() {
        this.myTurn = false;
        this.gameOver = false;
        this.leftBonus = 0;
        this.yahtzBonus = 0;
        this.leftTotal = 0;
        this.rightTotal = 0;
        app.sounds = new Sounds();
        App.thisID = App.generateID();
        App.playerScoreElements = new Array();
        ScoreElement.possible = new Possible();
        let canvas = document.getElementById('drawing-surface');
        surface = canvas.getContext('2d');
        surface.lineWidth = 1;
        Board.textColor = 'snow';
        surface.strokeStyle = 'snow';
        surface.fillStyle = 'snow';
        surface.font = "small-caps 18px arial";
        surface.textAlign = 'center';
        surface.shadowBlur = 10;
        surface.shadowOffsetX = 3;
        surface.shadowOffsetY = 3;
        surface.fillRect(0, 0, canvas.width, canvas.height);
        app.infoElement = new Label('', { left: 300, top: 600 }, { width: 590, height: 35 }, Board.textColor, 'black');
        UI.buildPlayerElements();
        var person = 'me';
        App.players[0] = (new Player(App.thisID, person, 'red', 0, App.playerScoreElements[0]));
        App.thisPlayer = App.players[0];
        App.currentPlayer = App.thisPlayer;
        window.addEventListener("resize", OnResizeCalled, false);
        function OnResizeCalled() {
            this.canvas.style.width = window.innerWidth + 'px';
            this.canvas.style.height = window.innerHeight + 'px';
        }
        App.socketSend('loggedIn', {
            'id': App.thisID,
            'name': person
        });
        socket.onmessage = (message) => {
            var d = JSON.parse(message.data);
            var messageName = d.name;
            var data = d.data;
            switch (messageName) {
                case 'setPlayers':
                    App.setPlayers(data);
                    break;
                case 'updateRoll':
                    this.rollTheDice(data);
                    break;
                case 'updateDie':
                    App.dice.die[data.dieNumber].clicked();
                    break;
                case 'updateScore':
                    UI.scoreElement[parseInt(data.scoreNumber, 10)].clicked();
                    break;
                case 'resetTurn':
                    App.currentPlayer = App.players[data.currentPlayerIndex];
                    this.resetTurn();
                    break;
                case 'resetGame':
                    App.currentPlayer = App.players[data.currentPlayerIndex];
                    this.resetGame();
                    break;
                default:
                    break;
            }
        };
        let scoreHeight = 95;
        let scoreWidth = 150;
        UI.buildScoreElements(180, canvas.clientLeft + 30, scoreWidth, scoreHeight);
        App.dice = new Dice();
        this.leftScoreElement = new Label('^ total = 0', { left: canvas.clientLeft + 162, top: 545 }, { width: 265, height: 90 }, 'gray', Board.textColor);
        this.leftScoreElement.render();
        this.rollButton = new Button({ left: 210, top: 9 }, { width: 175, height: 75 });
        ontouch(canvas, (touchobj, phase, distX, distY) => {
            if (phase !== 'start') {
                return;
            }
            this.onMouseDown(touchobj, canvas);
        });
        this.resetGame();
    }
    static getInstance() {
        if (!Board.instance) {
            Board.instance = new Board();
        }
        return Board.instance;
    }
    onMouseDown(event, canvas) {
        let x = event.pageX - canvas.offsetLeft;
        let y = event.pageY - canvas.offsetTop;
        if (App.currentPlayer === App.thisPlayer) {
            for (let index = 0; index < UI.scoreElement.length; index++) {
                if (UI.scoreElement[index].ui.hitTest(x, y)) {
                    let thisScoreElement = UI.scoreElement[index];
                    App.socketSend('scoreClicked', {
                        'id': App.thisID,
                        'scoreNumber': index
                    });
                    if (thisScoreElement.clicked()) {
                        App.socketSend('turnOver', {
                            'id': App.thisID
                        });
                        this.resetTurn();
                    }
                }
            }
            for (let i = 0; i < 5; i++) {
                if (App.dice.die[i].hitTest(x, y)) {
                    App.dice.die[i].clicked();
                    App.socketSend('dieClicked', { 'dieNumber': i });
                }
            }
            if (this.rollButtonClicked(x, y)) {
                if (!this.rollButton.disabled) {
                    this.rollTheDice({ id: App.thisID });
                }
            }
        }
    }
    rollButtonClicked(x, y) {
        let buttonX = 210;
        let buttonY = 9;
        let buttonWidth = 175;
        let buttonHeight = 75;
        if (y < buttonY || y > buttonY + buttonHeight) {
            return false;
        }
        if (x < buttonX || x > buttonX + buttonWidth) {
            return false;
        }
        return true;
    }
    rollTheDice(data) {
        app.sounds.play(app.sounds.roll);
        if (this.gameOver) {
            App.socketSend('gameOver', {
                'id': App.thisID
            });
        }
        if (data.id === App.thisID) {
            App.dice.roll();
            App.socketSend('playerRolled', {
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
                this.rollButton.text = 'Roll Again';
                break;
            case 2:
                this.rollButton.text = 'Last Roll';
                break;
            case 3:
                this.rollButton.disabled = true;
                this.rollButton.text = 'Select Score';
                break;
            default:
                this.rollButton.text = 'Roll Dice';
                Dice.rollCount = 0;
        }
    }
    clearPossibleScores() {
        UI.scoreElement.forEach(function (thisElement) {
            thisElement.clearPossible();
        });
    }
    evaluatePossibleScores() {
        UI.scoreElement.forEach(function (thisElement) {
            thisElement.setPossible();
        });
    }
    resetTurn() {
        this.rollButton.color = App.currentPlayer.color;
        this.gameOver = this.isGameComplete();
        this.rollButton.disabled = false;
        App.dice.resetTurn();
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
            this.rollButton.text = 'Roll Dice';
            this.clearPossibleScores();
            this.setLeftScores();
            this.setRightScores();
        }
    }
    resetGame() {
        App.dice = new Dice();
        App.dice.resetGame();
        UI.scoreElement.forEach(function (thisElement) {
            thisElement.reset();
        });
        UI.resetPlayersScoreElements();
        this.gameOver = false;
        this.leftBonus = 0;
        this.yahtzBonus = 0;
        this.leftTotal = 0;
        this.rightTotal = 0;
        this.leftScoreElement.text = '^ total = 0';
        App.players.forEach((player) => {
            player.resetScore();
        });
        App.currentPlayer = App.players[0];
        this.rollButton.color = App.currentPlayer.color;
        this.rollButton.text = 'Roll Dice';
        this.rollButton.disabled = false;
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
        this.rollButton.color = 'black';
        this.rollButton.text = winMsg;
        app.logLine(winMsg + ' ' + winner.score, app.scoreMsg);
        App.currentPlayer = App.players[App.myIndex];
    }
    isGameComplete() {
        let result = true;
        UI.scoreElement.forEach(function (thisElement) {
            if (!thisElement.owned) {
                result = false;
            }
        });
        return result;
    }
    setLeftScores() {
        this.leftTotal = 0;
        App.players.forEach((player) => {
            player.score = 0;
        });
        var val;
        for (var i = 0; i < 6; i++) {
            val = UI.scoreElement[i].finalValue;
            if (val > 0) {
                this.leftTotal += val;
                UI.scoreElement[i].owner.addScore(val);
                if (UI.scoreElement[i].hasFiveOfaKind && (App.dice.fiveOfaKindCount > 1)) {
                    UI.scoreElement[i].owner.addScore(100);
                }
            }
        }
        if (this.leftTotal > 62) {
            this.leftScoreElement.text = '^ total = ' + this.leftTotal.toString() + ' + 35';
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
            this.leftScoreElement.text = '^ total = ' + this.leftTotal.toString();
        }
        if (this.leftTotal === 0) {
            this.leftScoreElement.text = '^ total = 0';
        }
    }
    setRightScores() {
        let val;
        let len = UI.scoreElement.length;
        for (var i = 6; i < len; i++) {
            val = UI.scoreElement[i].finalValue;
            if (val > 0) {
                UI.scoreElement[i].owner.addScore(val);
                if (UI.scoreElement[i].hasFiveOfaKind && (App.dice.fiveOfaKindCount > 1) && (i !== UI.FiveOfaKind)) {
                    UI.scoreElement[i].owner.addScore(100);
                }
            }
        }
    }
}
