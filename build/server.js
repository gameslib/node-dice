const nodeStatic = require('node-static');
const http = require('http').createServer(handler);
var io = require('socket.io')(http);
io.serveClient(true);
var numberOfPlayers = 0;
var players = {};
var playerColors = ['#f00', '#0f0', 'yellow', 'blue'];
var currentPlayerIndex = 0;
const fileServer = new nodeStatic.Server('./', {
    cache: 0
});
http.listen(8080);
function handler(request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response);
    });
    request.resume();
}
io.on('connection', function (client) {
    console.log('client succesfully connected with id: ' + client.id);
    client.on('disconnect', function () {
        delete players[client.id];
        numberOfPlayers = Object.keys(players).length;
        console.log('Socket disconnected client id: ' + client.id + ' new count = ' + numberOfPlayers);
        io.emit('setPlayers', players);
    });
    client.on('loggedIn', function (data) {
        numberOfPlayers = Object.keys(players).length;
        console.log(data.name + ' logged in as ' + client.id);
        players[client.id] = { id: client.id, name: data.name, color: playerColors[numberOfPlayers] };
        numberOfPlayers = Object.keys(players).length;
        console.log('players count = ' + numberOfPlayers);
        io.sockets.emit('setPlayers', players);
        console.info(players);
    });
    client.on('playerRolled', function (data) {
        client.broadcast.emit('updateRoll', data);
    });
    client.on('dieClicked', function (data) {
        client.broadcast.emit('updateDie', data);
    });
    client.on('scoreClicked', function (data) {
        console.log('player selected score # ' + data.scoreNumber);
        client.broadcast.emit('updateScore', data);
    });
    client.on('turnOver', function (data) {
        currentPlayerIndex += 1;
        if (currentPlayerIndex > numberOfPlayers - 1) {
            currentPlayerIndex = 0;
        }
        data.currentPlayerIndex = currentPlayerIndex;
        console.log('turnOver: ' + data.currentPlayerIndex);
        io.sockets.emit('resetTurn', data);
    });
});
