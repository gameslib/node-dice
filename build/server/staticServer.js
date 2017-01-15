const httpServer = require('http').createServer(httpHamdler).listen(83);
const url = require('url');
const fs = require('fs');
const path = require('path');
const WebSocketServer = require('ws').Server;
let socketServer = new WebSocketServer({ server: httpServer });
function httpHamdler(req, res) {
    const parsedUrl = url.parse(req.url);
    let pathname = `.${parsedUrl.pathname}`;
    const mimeType = {
        '.ico': 'image/x-icon',
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.eot': 'appliaction/vnd.ms-fontobject',
        '.ttf': 'aplication/font-sfnt'
    };
    fs.exists(pathname, function (exist) {
        if (!exist) {
            res.statusCode = 404;
            res.end(`File ${pathname} not found!`);
            return;
        }
        if (fs.statSync(pathname).isDirectory()) {
            pathname += '/index.html';
        }
        fs.readFile(pathname, function (err, data) {
            if (err) {
                res.statusCode = 500;
                res.end(`Error getting the file: ${err}.`);
            }
            else {
                const ext = path.parse(pathname).ext;
                res.setHeader('Content-type', mimeType[ext] || 'text/plain');
                res.end(data);
            }
        });
    });
}
;
var numberOfPlayers = 0;
var players = {};
var playerColors = ['#800000', '#008000', 'GoldenRod', 'RoyalBlue'];
var currentPlayerIndex = 0;
socketServer.on('connection', function (client) {
    client.id = numberOfPlayers;
    client.on('message', (message) => {
        var d = JSON.parse(message);
        switch (d.name) {
            case 'loggedIn':
                numberOfPlayers = Object.keys(players).length;
                players[numberOfPlayers] = { id: d.data.id, name: d.data.name, color: playerColors[numberOfPlayers] };
                console.log('Player name: ' + d.data.name + '  id: ' + d.data.id + '  color: ' + playerColors[numberOfPlayers] + ' signed in.    Number of players = ' + numberOfPlayers);
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
        console.log('client  id: ' + client.id + ' closed.  Number of players = ' + numberOfPlayers);
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
