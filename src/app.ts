
const HOST = location.origin.replace(/^http/, 'ws')
const socket: WebSocket = new WebSocket(HOST);

class App {
  static thisID: string
  static myIndex: number = 0
  static players: Player[] = new Array
  static playerElements: HTMLElement[]
  static p2id: number
  dice: Dice
  sounds: Sounds
  scoresDialog: any
  possible: Possible
  game: Board
  numberOfDie: number = 5
  infoElement: TextElement
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
    UI.RenderText(this.infoElement)
  }

  static setPlayers(data: any) {
    App.players = []
    let index = 0
    Object.keys(data).forEach(function (prop) {
      App.players[index] = (new Player(data[prop].id,
        data[prop].name,
        data[prop].color,
        0,
        Board.playerScoreElements[index]))
      if (App.thisID === data[prop].id) {
        Board.thisPlayer = App.players[index]
        App.myIndex = index
      }
      index += 1
    })
    Board.thisPlayer = App.players[App.myIndex]
    Board.currentPlayer = App.players[0]
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
    'UIElements',
    'board',
    'die',
    'dice',
    'dieFaceBuilder',
    'pathBuilder',
    'diceEvaluator',
    'player',
    'possible',
    'scoreElement',
    'sounds',
    'touch'
  ]
)

window.onload = function () {
  var myBoard = new Board()
}