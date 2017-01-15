
//TODO: rotate resize??
//TODO: select a name from list of previously used names
//todo: build UI popup for Win msg,
class Game {

  static scoreItems: ScoreComponent[] = []
  leftBonus: number = 0
  fiveOkindBonus: number = 0
  leftTotal: number = 0
  rightTotal: number = 0
  uiRollState = { text: '', color: '', disabled: false }
  // singlton instance
  private static instance: Game;
  static getInstance() {
    if (!Game.instance) {
      Game.instance = new Game();
    }
    return Game.instance;
  }


  private constructor() {
    app.sounds = new Sounds()
    App.thisID = App.generateID()
    App.playerScoreElements = new Array()
    ScoreComponent.possible = Possible.getInstance()
    UI.initialize()
    let person = 'bbb'//prompt("Please enter your name", "Me")
    App.players[0] = (new Player(App.thisID, person, 'red', 0, App.playerScoreElements[0]))
    App.thisPlayer = App.players[0]
    App.currentPlayer = App.thisPlayer

    App.socketSend('loggedIn', {
      id: App.thisID,
      name: person
    });

    socket.onmessage = (message: any) => {
      let d = JSON.parse(message.data)
      let messageName = d.name
      let data = d.data
      switch (messageName) {
        case 'setPlayers': // data = {object containing players-objects}
          App.setPlayers(data)
          break;
        case 'updateRoll': // data = { 'id': App.thisID, 'dice': app.dice.die }
          this.rollTheDice(data)
          break;
        case 'updateDie': //  data = { 'dieNumber': index }
          App.dice.die[data.dieNumber].clicked(false)
          break;
        case 'updateScore': // data = { 'scoreNumber': elemIndex }
          Game.scoreItems[parseInt(data.scoreNumber, 10)].clicked()
          break;
        case 'resetTurn': // data = { 'id': App.thisID, 'currentPlayerIndex': currentPlayerIndex}
          this.isGameComplete()
          App.currentPlayer = App.players[data.currentPlayerIndex]
          this.resetTurn()
          break;
        case 'resetGame': // data = { 'id': App.thisID, 'currentPlayerIndex': currentPlayerIndex}
          App.currentPlayer = App.players[data.currentPlayerIndex]
          this.resetGame()
          break;
        default:
          break;
      }
    }

    Events.on('GameOver', () => {
      App.socketSend('gameOver', {
        'id': App.thisID
      })
      this.clearPossibleScores()
      this.setLeftScores()
      this.setRightScores()
      this.showFinalScore(this.getWinner())
      this.resetGame()
    })

    Events.on('ScoreWasSelected', () => {
      this.isGameComplete()
      this.resetTurn()
    })

    Events.on('RollButtonClicked', () => {
      this.rollTheDice({id: App.thisID} )
    })

    this.resetGame()
  } // end constructor

  rollTheDice(data: any) {
    // if it's us ..
    console.log('id: ' + data.id + ' myId: ' + App.thisID)
    if (data.id === App.thisID) {
      app.sounds.play(app.sounds.roll)
      App.dice.roll()
      App.socketSend('playerRolled', {
        'id': App.thisID,
        'dice': App.dice.die
      });
    } else {
      App.dice.roll(data.dice)
    }

    this.evaluatePossibleScores()
    switch (Dice.rollCount) {
      case 1:
        this.uiRollState.text = 'Roll Again'
        break
      case 2:
        this.uiRollState.text = 'Last Roll'
        break
      case 3:
        this.uiRollState.disabled = true
        this.uiRollState.text = 'Select Score'
        break
      default:
        this.uiRollState.text = 'Roll Dice'
        Dice.rollCount = 0
    }
    this.updateRollUi()
  }

  updateRollUi() {
    Events.fire('RollUpdate', (this.uiRollState ))
  }

  getWinner() {
    if (App.players.length = 1) return App.players[App.myIndex]
    let thisWinner: Player
    let highscore = 0
    App.players.forEach(function (thisPlayer) {
      if (thisPlayer.score > highscore) {
        highscore = thisPlayer.score
        thisWinner = thisPlayer
      }
    })
    return thisWinner
  }

  clearPossibleScores() {
    Game.scoreItems.forEach(function (thisElement: any) {
      thisElement.clearPossible()
    })
  }

  evaluatePossibleScores() {
    Game.scoreItems.forEach(function (thisElement: any) {
      thisElement.setPossible()
    })
  }

  resetTurn() {
    this.uiRollState.color = App.currentPlayer.color
    this.uiRollState.disabled = false
    this.updateRollUi()
    App.dice.resetTurn()
    this.uiRollState.text = 'Roll Dice'
    this.clearPossibleScores()
    this.setLeftScores()
    this.setRightScores()
  }

  resetGame() {
    App.dice.resetGame()
    Game.scoreItems.forEach(function (thisComponent: ScoreComponent) {
      thisComponent.reset()
    })
    UI.resetPlayersScoreElements()
    this.leftBonus = 0
    this.fiveOkindBonus = 0
    this.leftTotal = 0
    this.rightTotal = 0
    UI.leftScoreElement.text = '^ total = 0'
    App.players.forEach((player: Player) => {
      player.resetScore()
    })
    App.currentPlayer = App.players[0]
    this.uiRollState.color = App.currentPlayer.color
    this.uiRollState.text = 'Roll Dice'
    this.uiRollState.disabled = false
    this.updateRollUi()
  }

  showFinalScore(winner: Player) {
    var winMsg: string
    if (winner !== App.thisPlayer) {
      app.sounds.play(app.sounds.nooo)
      winMsg = winner.name + ' wins!'
    } else {
      app.sounds.play(app.sounds.woohoo)
      winMsg = 'You won!'
    }
    this.uiRollState.color = 'black'
    this.uiRollState.text = winMsg
    this.updateRollUi()
    app.logLine(winMsg + ' ' + winner.score, app.scoreMsg)
    alert(winMsg + ' ' + winner.score)
    App.currentPlayer = App.players[App.myIndex]
  }

  isGameComplete() {
    let result = true
    Game.scoreItems.forEach(function (thisComponent: ScoreComponent) {
      if (!thisComponent.owned) {
        result = false
      }
    })
    if (result === true) {
      Events.fire('GameOver', '')
    }
  }

  setLeftScores() {
    this.leftTotal = 0

    App.players.forEach((player) => {
      player.score = 0
    })

    var val: number
    for (var i = 0; i < 6; i++) {
      val = Game.scoreItems[i].finalValue
      if (val > 0) {
        this.leftTotal += val
        Game.scoreItems[i].owner.addScore(val)
        if (Game.scoreItems[i].hasFiveOfaKind && (App.dice.fiveOfaKindCount > 1)) {
          Game.scoreItems[i].owner.addScore(100)
        }
      }
    }
    if (this.leftTotal > 62) { // award bonus
      UI.leftScoreElement.text = '^ total = ' + this.leftTotal.toString() + ' + 35'
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
      UI.leftScoreElement.text = '^ total = ' + this.leftTotal.toString()
    }
    if (this.leftTotal === 0) {
      UI.leftScoreElement.text = '^ total = 0'
    }
  }

  setRightScores() {
    let val: number
    let len = Game.scoreItems.length
    for (var i = 6; i < len; i++) {
      val = Game.scoreItems[i].finalValue
      if (val > 0) {
        Game.scoreItems[i].owner.addScore(val)
        if (Game.scoreItems[i].hasFiveOfaKind && (App.dice.fiveOfaKindCount > 1) && (i !== Possible.FiveOfaKind)) {
          Game.scoreItems[i].owner.addScore(100)
        }
      }
    }
  }
}