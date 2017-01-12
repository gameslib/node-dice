
const HOST = location.origin.replace(/^http/, 'ws')
const socket: WebSocket = new WebSocket(HOST);
var surface: CanvasRenderingContext2D

class App {
  static thisID: string
  static myIndex: number = 0
  static players: Player[] = new Array
  static playerScoreElements: Label[]
  static p2id: number
  static dice: Dice
  static currentPlayer: Player
  static thisPlayer: Player
  sounds: Sounds
  scoresDialog: any
  possible: Possible
  game: Board
  numberOfDie: number = 5
  infoElement: Label
  // flags()
  playSounds: boolean = true
  lastScoreMessage: string = ''
  scoreMsg: number = 1
  tooltipMsg: number = 2
  resetMsg: number = 3


  static socketSend(name: string, data: any) {
    if (socket) {
      var msg = JSON.stringify({ name: name, data: data })
      console.log('socket Sent ' + name)
      socket.send(msg);
    } else {
      throw new Error('No open WebSocket connections.')
    }
    return this;
  }

  // 1 = score-message, 2 = tooltip-message, 3 = reset-message
  logLine(message: string, type: number) {
    let result = message
    if (type === 1) {
      this.lastScoreMessage = result
    } else if (type === 3) {
      result = this.lastScoreMessage
    }
    this.infoElement.text = result
  }

  static setPlayers(data: any) {
    App.players = []
    let index = 0
    Object.keys(data).forEach(function (prop) {
      App.players[index] = (new Player(data[prop].id,
        data[prop].name,
        data[prop].color,
        0,
        App.playerScoreElements[index]))
      if (App.thisID === data[prop].id) {
        App.thisPlayer = App.players[index]
        App.myIndex = index
      }
      index += 1
    })
    App.thisPlayer = App.players[App.myIndex]
    App.currentPlayer = App.players[0]
  }

  static generateID() {
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let num = 10;
    let id: string = '';
    for (var i = 0; i < num; i++) {
      chars[i]
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
}

var app = new App()

modules.load(
  [
    'board',
    'dice',
    'diceEvaluator',
    'die',
    'dieBuilder',
    'pathBuilder',
    'player',
    'possible',
    'uiScoreElement',
    'scoreElement',
    'sounds',
    'touch',
    'uiButton',
    'uiLabel',
    'uiElement'
  ]
)

window.onload = function () {
  var board = Board.getInstance()
}