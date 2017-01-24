/**
 * Application defines the set of Stores, Models, ViewModels, and Views,
 * that an application consists of. It automatically loads all of those dependencies
 * and can optionally specify a launch function that will be called when everything is ready.

  application({
    name: 'MyApp',

    models: ['User', 'Group'],
    stores: ['Users'],
    controllers: ['Users'],
    views: ['Main', 'ShowUser'],

    launch: function() {
        Ext.create('MyApp.view.Main');
    }
  })

*/



const HOST = location.origin.replace(/^http/, 'ws')
const socket: WebSocket = new WebSocket(HOST);
var surface: CanvasRenderingContext2D

class App {
  static thisID: string
  static myIndex: number = 0
  static players: Player[] = new Array
  static playerScoreElements: Label[]
  static dice: Dice
  static currentPlayer: Player
  static thisPlayer: Player
  sounds: Sounds
  scoresDialog: any
  possible: Possible
  game: Game
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
    'viewModel/game',
    'viewModel/dice',
    'viewModel/diceEvaluator',
    'viewModel/player',
    'viewModel/possible',
    'viewModel/scoreComponent',

    'view/popup',
    'view/button',
    'view/die.js',
    'view/dieBuilder',
    'view/label',
    'view/pathBuilder',
    'view/scoreElement',
    'view/ui',
    'framework/canvasVue',
    'framework/events',
    'framework/sounds',
    'framework/touch'
  ]
)

window.onload = function () {
  var game = Game.getInstance()
}