
// *************** Include libraries *************************
const nodeStatic = require('node-static') // for serving files
const http = require('http').createServer(handler)
var io = require('socket.io')(http)
io.serveClient( true ); // the server will serve the client js file

//TODO:
// need to control the current player (after game win)
// ************** local declarations *************************
var numberOfPlayers: number = 0
var players: any = {}
var playerColors = ['#f00', '#0f0', 'yellow', 'blue']
var currentPlayerIndex: number = 0

// make all the files in the current folder accessible from the web
const fileServer = new nodeStatic.Server('./', { // './' is the folder containing our html, etc
  cache: 0	// don't cache
})

// ***************** create our server **************************
// This is the port for our web server.
// you will need to go to http://localhost:8080 to see it
http.listen(8080);

// you will need to go to http://localhost:8080 to see it
function handler( request:any, response:any ) {
	request.addListener( 'end', function() {
		fileServer.serve( request, response );
	});
	request.resume();
}

// **************** socket io *************************************
// Listen for incoming connections from clients
io.on('connection', function (client: any) {
  console.log('client succesfully connected with id: '+ client.id)
  client.on('disconnect', function(){
    delete players[client.id]
    numberOfPlayers = Object.keys(players).length
    console.log('Socket disconnected client id: '+ client.id + ' new count = ' + numberOfPlayers)
    io.emit('setPlayers', players)
  })

  // listen for and broadcast dice events
  client.on('loggedIn', function (data: any) {
    numberOfPlayers = Object.keys(players).length
    console.log(data.name + ' logged in as ' + client.id)
    players[client.id] = { id: client.id, name: data.name, color: playerColors[numberOfPlayers] }
    numberOfPlayers = Object.keys(players).length
    console.log ('players count = '+ numberOfPlayers)
    // sends this to every connected player including this new one
    io.sockets.emit('setPlayers', players)
    console.info(players)
  })

  // listen for and broadcast roll events
  client.on('playerRolled', function (data: any) {
    // sends to everyone except the originating client.
    client.broadcast.emit('updateRoll', data)
  })

  // listen for and broadcast dice events
  client.on('dieClicked', function (data: any) {
    client.broadcast.emit('updateDie', data)
  })

  // listen for and broadcast Score events
  client.on('scoreClicked', function (data: any) {
    console.log ('player selected score # '+ data.scoreNumber)
    client.broadcast.emit('updateScore', data)
  })
    // listen for and broadcast turnOver events
  client.on('turnOver', function (data: any) {
    currentPlayerIndex += 1
    if (currentPlayerIndex > numberOfPlayers-1) {
      currentPlayerIndex = 0
    }
    data.currentPlayerIndex = currentPlayerIndex
    console.log ('turnOver: '+ data.currentPlayerIndex)
    io.sockets.emit('resetTurn', data)
  })
})
