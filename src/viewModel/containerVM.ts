/**
"properties flow down; actions flow up"
Data flows in one direction from parent (a ViewModel) to child (the View).
For communication between two components that don't have a parent-child relationship,
we use our global Events-Bus system.
Events can be thought of as a "middleman" for all state changes in the application.
Components don't communicate directly between each other, but rather all state changes
must go through the single source of truth, the Events-Bus.
The component initiating a change is only concerned with dispatching the change to
the Events-Bus, and doesn't have to worry about a list of other components
that need the state change.

Views
Data from ViewModels are displayed in Views. When a View uses data from a ViewModel it
must also subscribe to change events from that ViewModel. Then when the ViewModel
emits a change the View will recieve the new data and re-render. Actions are typically
dispatched from Views as the user interacts with parts of the application's
interface (clicks/moves...).
 */

class ContainerVM implements iViewModel {

  scoreItems: ScoreButtonVM[] = []

  view: Container
  leftBonus: number = 0
  fiveOkindBonus: number = 0
  leftTotal: number = 0
  rightTotal: number = 0
  rollButtomState = { text: '', color: '', enabled: true }
  dice: Dice

  constructor(container: Container) {
    this.view = container
    app.players = new Players(container)
    app.sounds = new Sounds()
    this.dice = new Dice(container)
    ScoreButtonVM.possible = Possible.getInstance(this.dice)
    let person = container.id //prompt("Please enter your name", "Me")
    app.socket.onmessage = (message: any) => {
      let type = Events.Type
      let d = JSON.parse(message.data)
      let messageType = d.name
      let data = d.data
      switch (messageType) {
        case type.RegisterPlayers: // data = {object containing players-objects}
          app.players.setPlayers(data)
          break;
        case type.UpdateRoll: // data = { 'id': App.thisID, 'dice': app.dice.die }
          this.rollTheDice(data)
          break;
        case type.UpdateDie: //  data = { 'dieNumber': index }
          this.dice.die[data.dieNumber].touched(false, 0, 0)
          break;
        case type.UpdateScore: // data = { 'scoreNumber': elemIndex }
          this.scoreItems[parseInt(data.scoreNumber, 10)].clicked()
          break;
        case type.ResetTurn: // data = { 'id': App.thisID, 'currentPlayerIndex': currentPlayerIndex}
          if (this.isGameComplete()) {

          } else {
            app.currentPlayer = app.players.playerVMs[data.currentPlayerIndex]
            this.resetTurn()
          }
          break;
        case type.ResetGame: // data = { 'id': App.thisID, 'currentPlayerIndex': currentPlayerIndex}
          app.currentPlayer = app.players[data.currentPlayerIndex]
          this.resetGame()
          break;
        default:
          break;
      }
    }

    Events.on(Events.Type.ResetGame, () => {
      app.socketSend(Events.Type.GameOver, {
        'id': this.view.id
      })
      //todo: this.resetGame()
    })

    Events.on(Events.Type.GameOver, () => {
      this.clearPossibleScores()
      this.setLeftScores()
      this.setRightScores()
      this.showFinalScore(this.getWinner())
    })

    Events.on(Events.Type.TurnOver, () => {
      if (this.isGameComplete()) {
        Events.fire(Events.Type.GameOver, '')
      } else {
        this.resetTurn()
      }
    })

    Events.on(Events.Type.RollButtonClicked, () => {
      this.rollTheDice({ id: this.view.id })
    })

    app.socketSend(Events.Type.RegisterPlayer, {
      id: this.view.id,
      name: person
    });
  }

  rollTheDice(data: any) {
    // if it's us ..
    if (data.id === this.view.id) {
      app.sounds.play(app.sounds.roll)
      this.dice.roll()
      app.socketSend(Events.Type.PlayerRolled, {
        'id': this.view.id,
        'dice': this.dice.die
      });
    } else {
      this.dice.roll(data.dice)
    }

    this.evaluatePossibleScores()
    switch (this.dice.rollCount) {
      case 1:
        this.rollButtomState.text = 'Roll Again'
        break
      case 2:
        this.rollButtomState.text = 'Last Roll'
        break
      case 3:
        this.rollButtomState.enabled = false
        this.rollButtomState.text = 'Select Score'
        break
      default:
        this.rollButtomState.text = 'Roll Dice'
        this.dice.rollCount = 0
    }
    this.updateRollButtom()
  }

  updateRollButtom() {
    Events.fire(Events.Type.RollUpdate, (this.rollButtomState))
  }

  getWinner() {
    if (app.players.playerVMs.length = 1) return app.players[this.view.myIndex]
    let thisWinner: PlayerVM
    let highscore = 0
    app.players.playerVMs.forEach(function (thisPlayer) {
      if (thisPlayer.score > highscore) {
        highscore = thisPlayer.score
        thisWinner = thisPlayer
      }
    })
    return thisWinner
  }

  clearPossibleScores() {
    this.scoreItems.forEach(function (thisElement: any) {
      thisElement.clearPossible()
    })
  }

  evaluatePossibleScores() {
    this.scoreItems.forEach(function (thisElement: any) {
      thisElement.setPossible()
    })
  }

  resetTurn() {
    this.rollButtomState.color = app.currentPlayer.color
    this.rollButtomState.enabled = true
    this.updateRollButtom()
    this.dice.resetTurn()
    this.rollButtomState.text = 'Roll Dice'
    this.clearPossibleScores()
    this.setLeftScores()
    this.setRightScores()
  }

  resetGame() {
    this.dice.resetGame()
    this.scoreItems.forEach(function (thisComponent: ScoreButtonVM) {
      thisComponent.reset()
    })
    //todo: this.view.reset() // resets all elements
    this.view.resetPlayersScoreElements()
    this.leftBonus = 0
    this.fiveOkindBonus = 0
    this.leftTotal = 0
    this.rightTotal = 0
    if (this.view.leftScoreTotalLabel) {
      this.view.leftScoreTotalLabel.text = '^ total = 0'
    }
    app.players.playerVMs.forEach((player: PlayerVM) => {
      player.resetScore()
    })
    app.currentPlayer = app.players.playerVMs[0]
    this.rollButtomState.color = app.currentPlayer.color
    this.rollButtomState.text = 'Roll Dice'
    this.rollButtomState.enabled = true
    this.updateRollButtom()
  }

  showFinalScore(winner: PlayerVM) {
    var winMsg: string
    if (winner !== app.me) {
      app.sounds.play(app.sounds.nooo)
      winMsg = winner.name + ' wins!'
    } else {
      app.sounds.play(app.sounds.woohoo)
      winMsg = 'You won!'
    }
    this.rollButtomState.color = 'black'
    this.rollButtomState.text = winMsg
    this.updateRollButtom()
    app.logLine(winMsg + ' ' + winner.score, app.scoreMsg, this.view.infoElement)
    this.view.popup.show(winMsg + ' ' + winner.score)
    app.currentPlayer = app.players[this.view.myIndex]
  }

  isGameComplete() {
    let result = true
    this.scoreItems.forEach(function (thisComponent: ScoreButtonVM) {
      if (!thisComponent.owned) {
        result = false
      }
    })
    return result
  }

  setLeftScores() {
    this.leftTotal = 0

    app.players.playerVMs.forEach((player) => {
      player.score = 0
    })

    var val: number
    for (var i = 0; i < 6; i++) {
      val = this.scoreItems[i].finalValue
      if (val > 0) {
        this.leftTotal += val
        this.scoreItems[i].owner.addScore(val)
        if (this.scoreItems[i].hasFiveOfaKind && (this.dice.fiveOfaKindCount > 1)) {
          this.scoreItems[i].owner.addScore(100)
        }
      }
    }
    if (this.leftTotal > 62) { // award bonus
      this.view.leftScoreTotalLabel.text = '^ total = ' + this.leftTotal.toString() + ' + 35'
      let bonusWinner: PlayerVM
      let highleft = 0
      app.players.playerVMs.forEach(function (thisPlayer) {
        if (thisPlayer.score > highleft) {
          highleft = thisPlayer.score
          bonusWinner = thisPlayer
        }
      })
      bonusWinner.addScore(35)
    } else {
      this.view.leftScoreTotalLabel.text = '^ total = ' + this.leftTotal.toString()
    }
    if (this.leftTotal === 0) {
      this.view.leftScoreTotalLabel.text = '^ total = 0'
    }
  }

  setRightScores() {
    let val: number
    let len = this.scoreItems.length
    for (var i = 6; i < len; i++) {
      val = this.scoreItems[i].finalValue
      if (val > 0) {
        this.scoreItems[i].owner.addScore(val)
        if (this.scoreItems[i].hasFiveOfaKind && (this.dice.fiveOfaKindCount > 1) && (i !== Possible.FiveOfaKind)) {
          this.scoreItems[i].owner.addScore(100)
        }
      }
    }
  }
}