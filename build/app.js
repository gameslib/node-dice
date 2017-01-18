const HOST = location.origin.replace(/^http/, 'ws');
const socket = new WebSocket(HOST);
var surface;
class App {
    constructor() {
        this.numberOfDie = 5;
        this.playSounds = true;
        this.lastScoreMessage = '';
        this.scoreMsg = 1;
        this.tooltipMsg = 2;
        this.resetMsg = 3;
    }
    static socketSend(name, data) {
        if (socket) {
            var msg = JSON.stringify({ name: name, data: data });
            socket.send(msg);
        }
        else {
            throw new Error('No open WebSocket connections.');
        }
        return this;
    }
    logLine(message, type) {
        let result = message;
        if (type === 1) {
            this.lastScoreMessage = result;
        }
        else if (type === 3) {
            result = this.lastScoreMessage;
        }
        this.infoElement.text = result;
    }
    static setPlayers(data) {
        console.log('setPlayer: ' + data);
        console.info(data);
        App.players = [];
        let index = 0;
        Object.keys(data).forEach(function (prop) {
            App.players[index] = (new Player(data[prop].id, data[prop].name, data[prop].color, 0, App.playerScoreElements[index]));
            if (App.thisID === data[prop].id) {
                App.thisPlayer = App.players[index];
                App.myIndex = index;
            }
            index += 1;
        });
        App.thisPlayer = App.players[App.myIndex];
        App.currentPlayer = App.players[0];
    }
    static generateID() {
        let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let num = 10;
        let id = '';
        for (var i = 0; i < num; i++) {
            chars[i];
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }
}
App.myIndex = 0;
App.players = new Array;
var app = new App();
modules.load([
    'game',
    'dice',
    'diceEvaluator',
    'player',
    'possible',
    'scoreComponent',
    'UI/popup',
    'UI/button',
    'UI/die.js',
    'UI/dieBuilder',
    'UI/label',
    'UI/pathBuilder',
    'UI/scoreElement',
    'UI/ui',
    'util/events',
    'util/sounds',
    'util/touch'
]);
window.onload = function () {
    var game = Game.getInstance();
};
