//
class ScoreButtonVM implements iViewModel {
  static possible: Possible
  static zero: string = ''
  id: number
  available = false
  name: string
  container: Container
  finalValue: number
  possibleValue: number
  owned: boolean = false
  scoringDieset: number[]
  owner: PlayerVM
  hasFiveOfaKind: boolean
  baseColor: string = 'black'
  dice: Dice

  constructor(id: number, name: string, container: Container) {
    this.id = id
    this.container = container
    this.dice = container.viewModel.dice
    this.name = name
    this.finalValue = 0
    this.possibleValue = 0
    this.scoringDieset = [0, 0, 0, 0, 0]
  }

  setOwned(value: boolean) {
    this.owned = value
    if (this.owned) {
      this.owner = app.currentPlayer;
      this.updateScoreElement(this.owner.color, this.possibleValue.toString())
  } else {
      this.owner = null
      this.updateScoreElement(null, ScoreButtonVM.zero)
    }
  }

  renderValue(value: string) {
    let eventName = 'RenderValue' + this.id
    Events.fire(eventName,
      {
        valueString: value,
        available: this.available
      })
  }

  updateScoreElement(color: string, value: string) {
    let eventName = 'UpdateScoreElement' + this.id
    Events.fire(eventName,
      {
        color: color,
        valueString: value,
        available: this.available
      })
  }

  setAvailable(value: boolean) {
    this.available = value
    if (this.available) {
      if (this.possibleValue > 0) {
        this.renderValue(this.possibleValue.toString())
      }
    } else {
      if (this.owned) {
        this.renderValue(this.possibleValue.toString())
      }
      this.renderValue(this.possibleValue.toString())
    }
  }

  clicked() {
    if (this.dice.toString() === '[00000]') { return false }
    let currentPlayer = app.currentPlayer;
    let scoreTaken = false
    if (!this.owned) {
      if (this.possibleValue === 0) {
        currentPlayer.lastScore = 'sacrificed ' + this.name + ' ' + this.dice.toString()
        app.logLine(currentPlayer.name + ' ' + currentPlayer.lastScore, app.scoreMsg, this.container.infoElement)
      } else {
        let wasTaken = (currentPlayer == app.me) ? 'takes ' : 'took '
        currentPlayer.lastScore = wasTaken + this.name + ' ' + this.dice.toString()
        app.logLine(currentPlayer.name + ' ' + currentPlayer.lastScore, app.scoreMsg, this.container.infoElement)
      }
      if (this.id === Possible.FiveOfaKind) {
        if (this.dice.isFiveOfaKind) {
          this.dice.fiveOfaKindBonusAllowed = true
          app.sounds.play(app.sounds.heehee)
        } else {
          this.dice.fiveOfaKindWasSacrificed = true
          app.sounds.play(app.sounds.dohh)
        }
      }
      this.setValue()
      scoreTaken = true
    }
    else if (this.available) {
      currentPlayer.lastScore = 'stole ' + this.name + ' ' + this.dice.toString() + ' was: ' + this.scoringDieset.toString()
      app.logLine(currentPlayer.name + ' ' + currentPlayer.lastScore, app.scoreMsg, this.container.infoElement)
      this.setOwned(false)
      app.sounds.play(app.sounds.heehee)
      this.setValue()
      scoreTaken = true
    }
    return scoreTaken
  }

  setValue() {
    this.setOwned(true)
    var thisValue = this.possibleValue
    this.finalValue = thisValue
    this.scoringDieset.forEach((die: number, index: number) => {
      this.scoringDieset[index] = this.dice.die[index].value
    })
    if (this.dice.isFiveOfaKind) {
      if (this.dice.fiveOfaKindBonusAllowed) {
        this.dice.fiveOfaKindCount += 1
        if (this.id !== Possible.FiveOfaKind) {
          this.finalValue += 100
        }
        this.hasFiveOfaKind = true
        app.sounds.play(app.sounds.heehee)
      } else {
        this.hasFiveOfaKind = false
        app.sounds.play(app.sounds.cluck)
      }
    } else {
      this.hasFiveOfaKind = false
      if (thisValue === 0) {
        app.sounds.play(app.sounds.dohh)
      } else {
        app.sounds.play(app.sounds.cluck)
      }
    }
  }

  setPossible() {
    this.possibleValue = ScoreButtonVM.possible.evaluate(this.id)
    if (!this.owned) {
      if (this.possibleValue === 0) {
        this.renderValue(ScoreButtonVM.zero)
      } else {
        this.renderValue(this.possibleValue.toString())
      }
      this.setAvailable(true)
    } else if (app.currentPlayer !== this.owner) {
      if (this.possibleValue > this.finalValue) {
        if (!this.hasFiveOfaKind) {
          this.setAvailable(true)
          this.renderValue(this.possibleValue.toString())
        }
      }
    }
  }

  reset() {
    this.setOwned(false)
    this.finalValue = 0
    this.possibleValue = 0
    this.updateScoreElement(this.baseColor, ScoreButtonVM.zero)
    this.hasFiveOfaKind = false
  }

  clearPossible() {
    this.possibleValue = 0
    this.setAvailable(false)
    if (!this.owned) {
      this.finalValue = 0
      this.renderValue(ScoreButtonVM.zero)
    }
    else {
      this.renderValue(this.finalValue.toString())
    }
  }
}