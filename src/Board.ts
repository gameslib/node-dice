//TODO make possible-steal box the color of the currentPlayer
//TODO rotate resize??
//TODO select a name from list of previously used names

class Board {
  static myIndex: number = 0
  static playerScoreElements: labelElement[] = new Array()
  static Surface: CanvasRenderingContext2D
  static canvas: HTMLCanvasElement
  static scoreHeight: number = 95
  static scoreWidth: number = 100
  static scoreElement: ScoreElement[] = new Array
  unclaimedColor: string = 'black'
  myTurn: Boolean = false
  gameOver: boolean = false
  rollButton: ButtonElement
  leftBonus: number = 0
  yahtzBonus: number = 0
  leftTotal: number = 0
  rightTotal: number = 0
  leftScoreElement: labelElement
  static Dice: Dice
  static currentPlayer: Player
  static thisPlayer: Player
  static possible: Possible
  static textColor: string

  constructor() {
    app.sounds = new Sounds()
    App.thisID = App.generateID()
    Board.possible = new Possible()
    Board.canvas = document.getElementById('drawing-surface') as HTMLCanvasElement
    Board.canvas.offsetParent
    Board.Surface = Board.canvas.getContext('2d')
    Board.Surface.lineWidth = 1;
    Board.textColor = 'snow'
    Board.Surface.strokeStyle = 'snow';
    Board.Surface.fillStyle = 'snow'
    Board.Surface.font = "small-caps 18px arial"//Segoe UI" //consolas"//arial"
    Board.Surface.textAlign = 'center'
    Board.Surface.fillRect(0, 0, Board.canvas.width, Board.canvas.height)
    app.infoElement = new labelElement('', 300, 600, 590, 40, Board.textColor, 'black' )
    UI.buildPlayerElements()
    var person = prompt("Please enter your name", "Me")
    App.players[0] = (new Player(App.thisID, person, 'red', 0, Board.playerScoreElements[0]))
    Board.thisPlayer = App.players[0]
    Board.currentPlayer = Board.thisPlayer

    App.socketSend('loggedIn', {
      'id': App.thisID,
      'name': person
    });

    socket.onmessage = (message: any) => {
      var d = JSON.parse(message.data);
      var messageName = d.name;
      var data = d.data
      switch (messageName) {
        case 'setPlayers': // data = {object containing players-objects}
          App.setPlayers(data)
          break;
        case 'updateRoll': // data = { 'id': App.thisID, 'dice': app.dice.die }
          this.rollTheDice(data)
          break;
        case 'updateDie': //  data = { 'dieNumber': index }
          Board.Dice.die[data.dieNumber].clicked()
          break;
        case 'updateScore': // data = { 'scoreNumber': elemIndex }
          Board.scoreElement[parseInt(data.scoreNumber, 10)].clicked()
          break;
        case 'resetTurn': // data = { 'id': App.thisID, 'currentPlayerIndex': currentPlayerIndex}
          Board.currentPlayer = App.players[data.currentPlayerIndex]
          this.resetTurn()
          break;
        case 'resetGame': // data = { 'id': App.thisID, 'currentPlayerIndex': currentPlayerIndex}
          Board.currentPlayer = App.players[data.currentPlayerIndex]
          this.resetGame()
          break;
        default:
          break;
      }
    }
    UI.buildScoreElements()
    Board.Dice = new Dice()
    this.leftScoreElement = new labelElement('^ total = 0', Board.canvas.clientLeft + 162, 555, 265, 90, 'gray', Board.textColor)
    UI.RenderText(this.leftScoreElement)
    this.rollButton = new ButtonElement(210, 9, 175, 75)

    ontouch(Board.canvas,  (touchobj: any, phase: string, distX: number, distY: number) => {
      if (phase !== 'start') { return }
      this.onMouseDown(touchobj)
    })
    this.resetGame()
  }

  onMouseDown(event: MouseEvent) {
    let x = event.pageX - Board.canvas.offsetLeft
    let y = event.pageY - Board.canvas.offsetTop
    if (Board.currentPlayer === Board.thisPlayer) {

      // score clicked?
      for (let index = 0; index < Board.scoreElement.length; index++) {
        if (Board.scoreElement[index].hitTest(x, y)) {
          let thisScoreElement: ScoreElement = Board.scoreElement[index]
          App.socketSend('scoreClicked', {
              'id': App.thisID,
              'scoreNumber': index
            });
          if (thisScoreElement.clicked()) {
            App.socketSend('turnOver', {
              'id': App.thisID
            });
            this.resetTurn()
          }
        }
      }
      // die clicked?
      for (let i = 0; i < 5; i++) {
        if (Board.Dice.die[i].hitTest(x, y)) {
          Board.Dice.die[i].clicked()
          App.socketSend('dieClicked', { 'dieNumber': i });
        }
      }

      if (this.rollButtonClicked(x, y)) {
        if (!this.rollButton.disabled) {
          this.rollTheDice({ id: App.thisID })
        }
      }

    }
  }

  rollButtonClicked(x: number, y: number): boolean {
    let buttonX = 210
    let buttonY = 9
    let buttonWidth = 175
    let buttonHeight = 75
    if (y < buttonY || y > buttonY + buttonHeight) { return false }
    if (x < buttonX || x > buttonX + buttonWidth) { return false }
    return true
  }

  rollTheDice(data: any) {
    app.sounds.play(app.sounds.roll)
    if (this.gameOver) {
      App.socketSend('gameOver', {
        'id': App.thisID
      })
    }
    // if it's us ...
    if (data.id === App.thisID) {
      Board.Dice.roll()
      App.socketSend('playerRolled', {
        'id': App.thisID,
        'dice': Board.Dice.die
      });
    } else {
      Board.Dice.roll(data.dice)
    }

    this.evaluatePossibleScores()
    switch (Dice.rollCount) {
      case 1:
        this.rollButton.text = 'Roll Again'
        break
      case 2:
        this.rollButton.text = 'Last Roll'
        break
      case 3:
        this.rollButton.disabled = true
        this.rollButton.text = 'Select Score'
        break
      default:
        this.rollButton.text = 'Roll Dice'
        Dice.rollCount = 0
    }
  }

  clearPossibleScores() {
    Board.scoreElement.forEach(function (thisElement: any) {
      thisElement.clearPossible()
    })
  }

  evaluatePossibleScores() {
    Board.scoreElement.forEach(function (thisElement: any) {
      thisElement.setPossible()
    })
  }

  resetTurn() {
    this.rollButton.backgroundColor = Board.currentPlayer.color
    this.gameOver = this.isGameComplete()
    this.rollButton.disabled = false
    Board.Dice.resetTurn()
    if (this.gameOver) {
      this.clearPossibleScores()
      this.setLeftScores()
      this.setRightScores()
      if (App.players.length > 1) {
        let winner: Player
        let highscore = 0
        App.players.forEach(function (thisPlayer) {
          if (thisPlayer.score > highscore) {
            highscore = thisPlayer.score
            winner = thisPlayer
          }
        })
        this.showFinalScore(winner)
      } else {
        this.showFinalScore(App.players[Board.myIndex])
      }
    }
    else {
      this.rollButton.text = 'Roll Dice'
      this.clearPossibleScores()
      this.setLeftScores()
      this.setRightScores()
    }
  }

  resetGame() {
    Board.Dice = new Dice()
    Board.Dice.resetGame()
    Board.scoreElement.forEach(function (thisElement: ScoreElement) {
      thisElement.reset()
    })
    UI.resetPlayersScoreElements()
    this.gameOver = false
    this.leftBonus = 0
    this.yahtzBonus = 0
    this.leftTotal = 0
    this.rightTotal = 0
    this.leftScoreElement.text = '^ total = 0'
    App.players.forEach((player: Player) => {
      player.resetScore()
    })
    Board.currentPlayer = App.players[0]
    this.rollButton.backgroundColor = Board.currentPlayer.color
    this.rollButton.text = 'Roll Dice'
    this.rollButton.disabled = false
  }

  showFinalScore(winner: Player) {
    var winMsg: string
    if (winner !== Board.thisPlayer) {
      app.sounds.play(app.sounds.nooo)
      winMsg = winner.name + ' wins!'
    } else {
      app.sounds.play(app.sounds.woohoo)
      winMsg = 'You won!'
    }
    this.rollButton.backgroundColor = 'black'
    this.rollButton.text = winMsg
    app.logLine(winMsg + ' ' + winner.score, app.scoreMsg)
    Board.currentPlayer = App.players[App.myIndex]
  }

  isGameComplete() {
    let result = true
    Board.scoreElement.forEach(function (thisElement: ScoreElement) {
      if (!thisElement.owned) {
        result = false
      }
    })
    return result
  }

  setLeftScores() {
    this.leftTotal = 0

    App.players.forEach((player) => {
      player.score = 0
    })

    var val: number
    for (var i = 0; i < 6; i++) {
      val = Board.scoreElement[i].finalValue
      if (val > 0) {
        this.leftTotal += val
        Board.scoreElement[i].owner.addScore(val)
        if (Board.scoreElement[i].hasFiveOfaKind && (Board.Dice.fiveOfaKindCount > 1)) {
          Board.scoreElement[i].owner.addScore(100)
        }
      }
    }
    if (this.leftTotal > 62) { // award bonus
      this.leftScoreElement.text = '^ total = ' + this.leftTotal.toString() + ' + 35'
      let bonusWinner: Player
      let highleft = 0
      App.players.forEach(function (thisPlayer) {
        if (thisPlayer.score > highleft) {
          highleft = thisPlayer.score
          bonusWinner = thisPlayer
        }
      })
      bonusWinner.addScore(35)
    } else {
      this.leftScoreElement.text = '^ total = ' + this.leftTotal.toString()
    }
    if (this.leftTotal === 0) {
      this.leftScoreElement.text = '^ total = 0'
    }
  }

  setRightScores() {
    let val: number
    let len = Board.scoreElement.length
    for (var i = 6; i < len; i++) {
      val = Board.scoreElement[i].finalValue
      if (val > 0) {
        Board.scoreElement[i].owner.addScore(val)
        if (Board.scoreElement[i].hasFiveOfaKind && (Board.Dice.fiveOfaKindCount > 1) && (i !== UI.FiveOfaKind)) {
          Board.scoreElement[i].owner.addScore(100)
        }
      }
    }
  }

}