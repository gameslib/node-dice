// We embed the client side socket.io code via:
//  <script src="/socket.io/socket.io.js"></script> in index.html
// That particular path is if you're using sio.serveClient( true ) in the server
//
var io: any = io || {}
  //The URL of your web server (the port is set in app.js)
const socket: any = io.connect('192.168.1.143:8080')

socket.on('connect', () => {
  App.id = socket.id
  console.log('my registered id = '+ socket.id)
})

socket.on('setPlayers', (data: any) => {
  App.players = []
  let index = 0
  Object.keys(data).forEach(function(prop) {
    //let index = parseInt(prop)
    App.players[index] = (new Player(data[prop].id, data[prop].name, data[prop].color, 0, App.playerElements[index]))
    if (App.id === data[prop].id) {
      Game.thisPlayer = App.players[index]
      App.myIndex = index
    }
    index += 1
    console.info(App.players)
  })
  Game.thisPlayer = App.players[App.myIndex]
  Game.currentPlayer = App.players[0]
  //myGame.resetGame()
})
var myGame: any

class App {
  static id: string
  static myIndex: number = 0
  static players: Player[] = new Array
  static playerElements: HTMLElement[]
  static p2id: number
  dice: Dice
  sounds: Sounds
  scoresDialog: any
  possible: Possible
  game: Game
  numberOfDie: number = 5
  infoElement: HTMLElement = document.getElementById('info')
  // flags()
  playSounds: boolean = true
  lastScoreMessage:string = ''
  scoreMsg: number = 1
  tooltipMsg: number = 2
  resetMsg: number = 3

  // 1 = score-message, 2 = tooltip-message, 3 = reset-message
  logLine(message: string, type: number) {
    let result = message
    if (type === 1) {
      this.lastScoreMessage = result
    } else if (type === 3) {
      result = this.lastScoreMessage
    }
    this.infoElement.textContent = result
  }
}

var app = new App()

modules.load(
  [
    'UIElements',
    'game',
    'die',
    'dice',
    'dieFaceBuilder',
    'diceEvaluator',
    'player',
    'possible',
    'scoreElement',
    'scoreSelectorAI',
    'sounds',
  ]
)

//const app = new App()
window.onload = function () {
  let $ = (name: string) => { return document.getElementById(name) }

  var myGame = new Game()

  let helpDialog = $('help-dialog') as any
  $('close-help-dialog').addEventListener('click', function () {
    helpDialog.close('thanks!')
  })
  $('help_menu').addEventListener('click', function () {
    helpDialog.showModal()
  })
  let scoresDialog = $('high-scores-dialog') as any
  $('close-scores-dialog').addEventListener('click', function () {
    scoresDialog.close('thanks!')
  })
  $('scores_menu').addEventListener('click', function () {
    scoresDialog.showModal()
  })
  let optionsDialog = $('options-dialog') as any
  $('close-options-dialog').addEventListener('click', function () {
    optionsDialog.close('thanks!')
  })
  $('options_menu').addEventListener('click', function () {
    optionsDialog.showModal()
  })
  const soundsChk = $('soundsChkBox') as any
  soundsChk.addEventListener('click', function () {
    app.playSounds = soundsChk.checked
  })
}