/*
todo: Build a View-Factory object
      View takes a Container (container is the Context2D to render to)
      Build a static 'Binder' function that takes a View and a model and returns a ViewModel
      Binding does not mutate the View or the Model
      Use Naming convention to two-way bind the View and model (properties, attributes, state).
      View-Factory to include Pathbuilder
      Named-Paths to have default geometry
      Custom Path object to contain Path2D, Colors, Geometry

      View-Base has State (Clickable, Enabled, Visible)
      Hydrate and Bind from Custom HTML-elements ...
          read the DOM elements,
          hydrate-canvas-element with-css,
          destroy-DOM-element, bind-with-Model
      Path2D from SVG-tag?

  UI.Bind(View, Model) {
    // if view is ViewModel, -> propertyChangedEvent(Host.PropertyName)
    // if view is HTML -> TextContentChangedEvent(elementName)
    // if view is POCO -> Events.fire(eventName)
  }

  MVVM ...  use convention over configuration
  View = Bound to ViewModel ->
      recieves propertyChangedEvents
      monitors state controlled by ViewModel
      fires commands to the ViewModel
      Source of all behaiviors for the view (renders based on model/state changes)

  ViewModel = Binds View and Model (no direct knowledge of the View)
      Maintains a Views state, not its behaiviors
      Subscribes to commands from View(click)
      Manipulates Model data and commands model CRUD

  Model = domain object, no behaiviors
      Fires ModelChanged event to ViewModel
      ViewModel  <- 'Reads', 'Updates -> data
      May implement data services(CRUD) commanded by ViewModel

      Implementation ...
      var shell = Bootstrapper.CreateShell() // shell is ViewModel (top level VM = app)
      viewModelBinder.Bind(shell, thisViewModel)
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

    'view/UIElement',
    'view/popup',
    'view/button',
    'view/die.js',
    'view/dieBuilder',
    'view/label',
    'view/pathBuilder',
    'view/scoreButton',
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