// node requirements
const httpServer = require('http').createServer(httpHamdler).listen(83);
const url = require('url');
const fs = require('fs');
const path = require('path');
const WebSocketServer = require('ws').Server

// serves any file from the root down
let socketServer = new WebSocketServer({ server: httpServer })

// HTTP handler
function httpHamdler(req: any, res: any) {
  // parse URL
  const parsedUrl = url.parse(req.url);
  // extract URL path
  let pathname = `.${parsedUrl.pathname}`;

  // maps file extention to MIME types
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
  }

  fs.exists(pathname, function (exist: any) {
    if (!exist) {
      // if the file is not found, return 404
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    }
    // if is a directory, then look for index.html
    if (fs.statSync(pathname).isDirectory()) {
      pathname += '/index.html';
    }
    // read file from file system
    fs.readFile(pathname, function (err: any, data: any) {
      if (err) {
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        // based on the URL path, extract the file extention. e.g. .js, .doc, ...
        const ext = path.parse(pathname).ext
        // if the file is found, set Content-type and send data
        res.setHeader('Content-type', mimeType[ext] || 'text/plain');
        res.end(data);
      }
    });
  });
};

// Socket Server vars
//var numberOfPlayers: number = 0
var players: iPlayer[] = []
var playerColors = ['#800000', '#008000', 'GoldenRod', 'RoyalBlue']
var currentPlayerIndex: number = 0

// creates a new 'client' closure on each new socket connection
socketServer.on('connection', function (client: any) {
  // we can use this 'client' closure to send messages to
  // the client, or to add specific listeners for the client
  client.id = ''

  // listen for messages from the client
  client.on('message', (message: any) => {
    var msg = JSON.parse(message);
    switch (msg.name) {
      case 'RegisterPlayer': // data = {'id': id,'name': person}
        client.id = msg.data.id
        players.push({ index: players.length, id: msg.data.id, name: msg.data.name, color: playerColors[players.length] })
        // sends this to every connected player including this new one
        broadcastAll(client, 'RegisterPlayers', players)
        broadcastAll(client, 'ResetGame', { currentPlayerIndex: 0 })
        break;
      case 'PlayerRolled': // data = {'id': App.thisID, 'dice': app.dice.die}
        // sends to everyone except the originating client.
        broadcast(client, 'UpdateRoll', msg.data)
        break;
      case 'DieClicked': //  data = { 'dieNumber': index }
        broadcast(client, 'UpdateDie', msg.data)
        break;
      case 'ScoreClicked': // data = { 'id': senderID, 'scoreNumber': elemIndex }
        broadcast(client, 'UpdateScore', msg.data)
        break;
      case 'TurnOver': // data = { 'id': App.thisID }
        currentPlayerIndex += 1
        if (currentPlayerIndex === players.length) {
          currentPlayerIndex = 0
        }
        msg.data.currentPlayerIndex = currentPlayerIndex
        broadcastAll(client, 'ResetTurn', msg.data)
        break;
      case 'GameOver': // data = { 'id': App.thisID }
        currentPlayerIndex = 0
        broadcastAll(client, 'SetPlayers', players)
        broadcastAll(client, 'ResetGame', { currentPlayerIndex: 0 })
        break;
      default:
        break;
    }
  })

  client.on('close', (message: any) => {
    for (var i = 0; i < players.length; i++) {
      var player = players[i];
      if (players[i].id === client.id) {
        players.splice(i, 1);
      }
    }
    setTimeout(() => {
      refreshPlayers()
      broadcastAll(client, 'SetPlayers', players)
    }, 30);
    setTimeout(() => {
      currentPlayerIndex = 0
      broadcastAll(client, 'ResetGame', { currentPlayerIndex: currentPlayerIndex })
    }, 60);
  })
})

var refreshPlayers = function () {
  for (var i = 0; i < players.length; i++) {
    players[i].color = playerColors[i]
  }
}

var broadcast = function (client: any, name: string, data: any) {
  for (var i in socketServer.clients) {
    if (client !== socketServer.clients[i]) {
      socketServer.clients[i].send(JSON.stringify({ name: name, data: data }));
    }
  }
}

var broadcastAll = function (client: any, name: string, data: any) {
  for (var i in socketServer.clients) {
    socketServer.clients[i].send(JSON.stringify({ name: name, data: data }));
  }
}
interface iPlayer {
  index: number
  id: string
  name: string
  color: string
}