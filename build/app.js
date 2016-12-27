const HOST = location.origin.replace(/^http/, 'ws');
const socket = new WebSocket(HOST);
var socketSend = function (name, data) {
    if (socket) {
        var msg = JSON.stringify({ name: name, data: data });
        socket.send(msg);
    }
    else {
        throw new Error('No open WebSocket connections.');
    }
    return this;
};
var setPlayers = function (data) {
    App.players = [];
    let index = 0;
    Object.keys(data).forEach(function (prop) {
        App.players[index] = (new Player(data[prop].id, data[prop].name, data[prop].color, 0, App.playerElements[index]));
        if (App.thisID === data[prop].id) {
            Game.thisPlayer = App.players[index];
            App.myIndex = index;
        }
        index += 1;
    });
    Game.thisPlayer = App.players[App.myIndex];
    Game.currentPlayer = App.players[0];
};
var genId = function () {
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let num = 10;
    let id = '';
    for (var i = 0; i < num; i++) {
        chars[i];
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};
var myGame;
class App {
    constructor() {
        this.numberOfDie = 5;
        this.infoElement = document.getElementById('info');
        this.playSounds = true;
        this.lastScoreMessage = '';
        this.scoreMsg = 1;
        this.tooltipMsg = 2;
        this.resetMsg = 3;
    }
    logLine(message, type) {
        let result = message;
        if (type === 1) {
            this.lastScoreMessage = result;
        }
        else if (type === 3) {
            result = this.lastScoreMessage;
        }
        this.infoElement.textContent = result;
    }
}
App.myIndex = 0;
App.players = new Array;
var app = new App();
modules.load([
    'UIElements',
    'game',
    'die',
    'dice',
    'dieFaceBuilder',
    'diceEvaluator',
    'player',
    'possible',
    'scoreElement',
    'scoreSelectorAI',
    'sounds',
]);
window.onload = function () {
    let $ = (name) => { return document.getElementById(name); };
    var myGame = new Game();
    let helpDialog = $('help-dialog');
    $('close-help-dialog').addEventListener('click', function () {
        helpDialog.close('thanks!');
    });
    $('help_menu').addEventListener('click', function () {
        helpDialog.showModal();
    });
    let scoresDialog = $('high-scores-dialog');
    $('close-scores-dialog').addEventListener('click', function () {
        scoresDialog.close('thanks!');
    });
    $('scores_menu').addEventListener('click', function () {
        scoresDialog.showModal();
    });
    let optionsDialog = $('options-dialog');
    $('close-options-dialog').addEventListener('click', function () {
        optionsDialog.close('thanks!');
    });
    $('options_menu').addEventListener('click', function () {
        optionsDialog.showModal();
    });
    const soundsChk = $('soundsChkBox');
    soundsChk.addEventListener('click', function () {
        app.playSounds = soundsChk.checked;
    });
};
