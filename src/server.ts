// Import libraries
// First, we need to require the http library, and then create a new server
// we need to tell this server to listen on a particular port
// must use the name 'server' to support 'ws'
const server = require('http').createServer(httpHamdler).listen(81)  // go to http://localhost:81
// Now, we create the Web Socket Server on the back of the HTTP server that we established
const WebSocketServer = require('ws').Server
const staticFileServer = require('node-static')

// make all the files in the current folder accessible from the web
let fileServer = new staticFileServer.Server('./')
// servers any file from the root down
let socketServer = new WebSocketServer({ server })


// ************** local declarations *************************
var numberOfPlayers: number = 0
var players: any = {}
var playerColors = ['#f00', '#0f0', 'yellow', 'blue']
var currentPlayerIndex: number = 0

// Whenever the URL of the socket server is opened in a browser
function httpHamdler(request: any, response: any) {
  request.addListener('end', function () {
    fileServer.serve(request, response)
  })
  request.resume()
}

socketServer.on('connection', function (client: any) {
  // we can use this connection 'client' to send messages to
  // the client, or add specific listeners for the client
  client.id = numberOfPlayers

  client.on('message', (message: any) => {
    var d = JSON.parse(message);
    console.log('message: ' + d.name + ' data = ' + d.data.name)
    switch (d.name) {
      case 'loggedIn': // data = {'id': id,'name': person}
        numberOfPlayers = Object.keys(players).length
        players[numberOfPlayers] = { id: d.data.id, name: d.data.name, color: playerColors[numberOfPlayers] }
        numberOfPlayers = Object.keys(players).length
        // sends this to every connected player including this new one
        broadcastAll(client, 'setPlayers', players)
        broadcastAll(client, 'resetGame', { currentPlayerIndex: 0 })
        break;
      case 'playerRolled': // data = {'id': App.thisID, 'dice': app.dice.die}
        // sends to everyone except the originating client.
        broadcast(client, 'updateRoll', d.data)
        break;
      case 'dieClicked': //  data = { 'dieNumber': index }
        broadcast(client, 'updateDie', d.data)
        break;
      case 'scoreClicked': // data = { 'scoreNumber': elemIndex }
        broadcast(client, 'updateScore', d.data)
        break;
      case 'turnOver': // data = { 'id': App.thisID }
        currentPlayerIndex += 1
        if (currentPlayerIndex > numberOfPlayers - 1) {
          currentPlayerIndex = 0
        }
        d.data.currentPlayerIndex = currentPlayerIndex
        broadcastAll(client, 'resetTurn', d.data)
        break;
      default:
        break;
    }
  })

  client.on('close', (message: any) => {
    console.log('message: close  data = ' + client.id)
    delete players[client.id]
    numberOfPlayers = Object.keys(players).length
    broadcastAll(client, 'setPlayers', players)
        console.log('broadcastAll setPlayers')
    setTimeout(() => {
      console.log('broadcastAll resetGame')
      currentPlayerIndex = 0
      broadcastAll(client, 'resetGame', { currentPlayerIndex: currentPlayerIndex })
    }, 30);
 })

})

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
