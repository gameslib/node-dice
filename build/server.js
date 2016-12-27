const server = require('http').createServer(httpHamdler).listen(81);
const WebSocketServer = require('ws').Server;
const staticFileServer = require('node-static');
let fileServer = new staticFileServer.Server('./');
let socketServer = new WebSocketServer({ server });
var numberOfPlayers = 0;
var players = {};
var playerColors = ['#f00', '#0f0', 'yellow', 'blue'];
var currentPlayerIndex = 0;
function httpHamdler(request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response);
    });
    request.resume();
}
socketServer.on('connection', function (client) {
    client.id = numberOfPlayers;
    client.on('message', (message) => {
        var d = JSON.parse(message);
        switch (d.name) {
            case 'loggedIn':
                numberOfPlayers = Object.keys(players).length;
                players[numberOfPlayers] = { id: d.data.id, name: d.data.name, color: playerColors[numberOfPlayers] };
                numberOfPlayers = Object.keys(players).length;
                broadcastAll(client, 'setPlayers', players);
                broadcastAll(client, 'resetGame', { currentPlayerIndex: 0 });
                break;
            case 'playerRolled':
                broadcast(client, 'updateRoll', d.data);
                break;
            case 'dieClicked':
                broadcast(client, 'updateDie', d.data);
                break;
            case 'scoreClicked':
                broadcast(client, 'updateScore', d.data);
                break;
            case 'turnOver':
                currentPlayerIndex += 1;
                if (currentPlayerIndex > numberOfPlayers - 1) {
                    currentPlayerIndex = 0;
                }
                d.data.currentPlayerIndex = currentPlayerIndex;
                broadcastAll(client, 'resetTurn', d.data);
                break;
            case 'gameOver':
                currentPlayerIndex = 0;
                broadcastAll(client, 'setPlayers', players);
                broadcastAll(client, 'resetGame', { currentPlayerIndex: 0 });
                break;
            default:
                break;
        }
    });
    client.on('close', (message) => {
        delete players[client.id];
        numberOfPlayers = Object.keys(players).length;
        broadcastAll(client, 'setPlayers', players);
        setTimeout(() => {
            currentPlayerIndex = 0;
            broadcastAll(client, 'resetGame', { currentPlayerIndex: currentPlayerIndex });
        }, 30);
    });
});
var broadcast = function (client, name, data) {
    for (var i in socketServer.clients) {
        if (client !== socketServer.clients[i]) {
            socketServer.clients[i].send(JSON.stringify({ name: name, data: data }));
        }
    }
};
var broadcastAll = function (client, name, data) {
    for (var i in socketServer.clients) {
        socketServer.clients[i].send(JSON.stringify({ name: name, data: data }));
    }
};
