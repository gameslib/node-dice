
class ScoreElement {
  static possible: Possible
  static zero: string = ''
  id: number
  ui: UIScoreElement = null
  name: string
  score: string = '00'
  finalValue: number
  possibleValue: number
  owned: boolean = false
  scoringDieset: number[]
  owner: Player
  hasFiveOfaKind: boolean

  constructor(id: number,
              name1: string,
              name2: string,
              location: {left: number, top: number},
              size: {width: number, height: number},
              isLeftHanded: boolean) {
    this.id = id
    this.finalValue = 0
    this.possibleValue = 0
    this.scoringDieset = [0, 0, 0, 0, 0]
    let textSize = {width: 85, height: 30}
    let scoreSize = {width: 30, height: 30}
    this.ui = new UIScoreElement(location, size, isLeftHanded, name1, name2)
  }

  setOwned(value: boolean) {
    this.owned = value
    if (this.owned) {
      this.owner = App.currentPlayer
      this.ui.color = this.owner.color
      this.ui.children[0].color = this.ui.color
      this.ui.children[1].color = this.ui.color
      this.ui.render()
      this.ui.renderValue(this.possibleValue.toString())
    } else {
      this.owner = null
      this.ui.children[0].color = this.ui.originalColor
      this.ui.children[1].color = this.ui.originalColor
      this.ui.render()
      this.ui.renderValue(ScoreElement.zero)
    }
  }

  setAvailable(value: boolean) {
    this.ui.available = value
    if (this.ui.available) {
      if (this.possibleValue > 0) {
        this.ui.renderValue(this.possibleValue.toString())
      }
    } else {
      if (this.owned) {
        this.ui.renderValue(this.possibleValue.toString())
      }
      this.ui.renderValue(this.possibleValue.toString())
    }
  }

  clicked() {
    if (App.dice.toString() === '[00000]') {return false}
    let scoreTaken = false
    if (!this.owned) {
      if (this.possibleValue === 0) {
        App.currentPlayer.lastScore = 'sacrificed ' + this.name + ' ' + App.dice.toString()
        app.logLine(App.currentPlayer.name + ' ' + App.currentPlayer.lastScore, app.scoreMsg)
      } else {
        let wasTaken = (App.currentPlayer == App.thisPlayer) ? 'takes ' : 'took '
        App.currentPlayer.lastScore = wasTaken + this.name + ' ' + App.dice.toString()
        app.logLine(App.currentPlayer.name + ' ' + App.currentPlayer.lastScore, app.scoreMsg)
      }
      if (this.id === UI.FiveOfaKind) {
        if (App.dice.isFiveOfaKind) {
          App.dice.fiveOfaKindBonusAllowed = true
          app.sounds.play(app.sounds.heehee)
        } else {
          App.dice.fiveOfaKindWasSacrificed = true
          app.sounds.play(app.sounds.dohh)
        }
      }
      this.setValue()
      scoreTaken = true
    }
    else if (this.ui.available) {
      App.currentPlayer.lastScore = 'stole ' + this.name + ' ' + App.dice.toString() + ' was: ' + this.scoringDieset.toString()
      app.logLine(App.currentPlayer.name + ' ' + App.currentPlayer.lastScore, app.scoreMsg)
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
      this.scoringDieset[index] = App.dice.die[index].value
    })
    if (App.dice.isFiveOfaKind) {
      if (App.dice.fiveOfaKindBonusAllowed) {
        App.dice.fiveOfaKindCount += 1
        if (this.id !== UI.FiveOfaKind) {
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
    this.possibleValue = ScoreElement.possible.evaluate(this.id)
    if (!this.owned) {
      if (this.possibleValue === 0) {
        this.ui.renderValue(ScoreElement.zero)
      } else {
        this.ui.renderValue(this.possibleValue.toString())
      }
      this.setAvailable(true)
    } else if (App.currentPlayer !== this.owner) {
      if (this.possibleValue > this.finalValue) {
        if (!this.hasFiveOfaKind) {
          this.setAvailable(true)
          this.ui.renderValue(this.possibleValue.toString())
        }
      }
    }
  }

  reset() {
    this.setOwned(false)
    this.finalValue = 0
    this.possibleValue = 0
    this.ui.color = this.ui.originalColor
    this.ui.children[2].color = this.ui.originalColor
    this.ui.render()
    this.ui.renderValue(ScoreElement.zero)
    this.hasFiveOfaKind = false
  }

  clearPossible() {
    this.possibleValue = 0
    this.setAvailable(false)
    if (!this.owned) {
      this.finalValue = 0
      this.ui.renderValue(ScoreElement.zero)
    }
    else {
      this.ui.renderValue(this.finalValue.toString())
    }
  }
}