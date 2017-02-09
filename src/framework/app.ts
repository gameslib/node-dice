
class App {
  socket: WebSocket
  sounds: Sounds
  me: PlayerVM
  currentPlayer: PlayerVM
  players: Players

  playSounds: boolean = true
  lastScoreMessage: string = ''
  scoreMsg: number = 1
  tooltipMsg: number = 2
  resetMsg: number = 3

  constructor() {
   let HOST = location.origin.replace(/^http/, 'ws')
   this.socket = new WebSocket(HOST);
 }

  socketSend(name: string, data: any) {
    if (this.socket) {
      var msg = JSON.stringify({ name: name, data: data })
      this.socket.send(msg);
    } else {
      //throw new Error('No open WebSocket connections.')
      while(!(this.socket)){console.log('No open WebSocket connections.')}
      this.socketSend(name,data)
    }
    return this;
  }

  // 1 = score-message, 2 = tooltip-message, 3 = reset-message
  logLine(message: string, type: number, lbl: Label) {
    let result = message
    if (type === 1) {
      this.lastScoreMessage = result
    } else if (type === 3) {
      result = this.lastScoreMessage
    }
    lbl.text = result
  }

}

var app = new App()

modules.load(
  [
    'model/dice',
    'model/players',
    'model/diceEvaluator',
    'model/possible',

    'viewModel/buttonVM',
    'viewModel/containerVM',
    'viewModel/dieVM',
    'viewModel/labelVM',
    'viewModel/playerVM',
    'viewModel/scoreButtonVM',

    'view/popup',
    'view/button',
    'view/die.js',
    'view/factories',
    'view/label',
    'view/scoreButton',
    'view/container',

    'framework/events',
    'framework/sounds'
  ]
)

window.onload = function () {
  var UI = new Container(document.getElementById('drawing-surface') as HTMLCanvasElement)
}