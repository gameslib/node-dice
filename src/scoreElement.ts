
class ScoreElement{

  // We'll use a single 'Possible' object for
  // all instances of ScoreElements (to save memory)
  static possible: Possible
  element: HTMLElement
  id: number
  name: string
  finalValue: number
  possibleValue: number
  valueElement: HTMLElement
  label: string
  originalColor: any
  owned: boolean = false
  scoringDieset: number[]
  owner: Player
  available: boolean
  hasFiveOfaKind: boolean

  constructor(elem: HTMLElement, id: number, name: string) {
    this.element = elem
    this.id = id
    this.name = name
    this.finalValue = 0
    this.possibleValue = 0
    this.valueElement = elem.querySelector('.score-value') as HTMLElement
    this.element.addEventListener('mouseover',() => {
      if(this.owned){
        app.logLine(this.scoringDieset.toString(),app.tooltipMsg)
      }
    })
    this.element.addEventListener('mouseout',() => {
      app.logLine('', app.resetMsg)
    })
    this.label = name
    this.element.querySelector('.score-label').textContent = name
    this.originalColor = elem.style.backgroundColor
    this.scoringDieset = [0,0,0,0,0]
    ScoreElement.possible = new Possible()
  }

  setOwned(value: boolean) {
    this.owned = value
    if (this.owned) {
      this.valueElement.classList.add('locked')
      this.owner = Game.currentPlayer
      this.element.style.backgroundColor = this.owner.color
    }
    else {
      this.valueElement.classList.remove('locked')
      this.owner = null
      this.element.style.backgroundColor = this.originalColor
    }
  }

  setAvailable(value: boolean) {
    this.available = value
    if (this.available) {
      this.valueElement.classList.remove('locked')
      this.valueElement.classList.add('available')
    }
    else {
      if (this.owned) {
        this.valueElement.classList.add('locked')
      }
      this.valueElement.classList.remove('available')
    }
  }

  clicked() {
    let scoreTaken = false
    if (!this.owned) {
      if(this.possibleValue === 0) {
        Game.currentPlayer.lastScore = 'sacrificed ' + this.name + ' ' + app.dice.toString()
        app.logLine(Game.currentPlayer.name + ' ' + Game.currentPlayer.lastScore, app.scoreMsg)
      } else {
        let wasTaken = (Game.currentPlayer == Game.thisPlayer) ? 'takes ': 'took '
        Game.currentPlayer.lastScore = wasTaken + this.name + ' ' + app.dice.toString()
        app.logLine(Game.currentPlayer.name + ' ' + Game.currentPlayer.lastScore, app.scoreMsg)
      }
      if (this.id === UI.FiveOfaKind) {
        if (app.dice.isFiveOfaKind) {
          app.dice.fiveOfaKindBonusAllowed = true
          app.sounds.play(app.sounds.heehee)
        } else {
          app.dice.fiveOfaKindWasSacrificed = true
          app.sounds.play(app.sounds.dohh)
        }
      }
      this.setValue()
      scoreTaken =  true
    }
    else if (this.available) {
      Game.currentPlayer.lastScore = 'stole ' + this.name + ' ' + app.dice.toString() + ' was: ' + this.scoringDieset.toString()
      app.logLine(Game.currentPlayer.name + ' ' + Game.currentPlayer.lastScore, app.scoreMsg)
      this.setOwned(false)
      app.sounds.play(app.sounds.heehee)
      this.setValue()
      scoreTaken =  true
    }
    console.log(Game.currentPlayer.name + ' ' + Game.currentPlayer.lastScore, app.scoreMsg)
    return scoreTaken
  }
  setValue() {
    this.setOwned(true)
    var thisValue = this.possibleValue
    this.finalValue = thisValue
    this.scoringDieset.forEach(( die: number, index: number) => {
      this.scoringDieset[index] = app.dice.die[index].value
    })
    if (app.dice.isFiveOfaKind) {
      if (app.dice.fiveOfaKindBonusAllowed) {
        app.dice.fiveOfaKindCount += 1
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
        this.valueElement.textContent = ''
      }
      else {
        this.valueElement.textContent = this.possibleValue.toString()
      }
      this.setAvailable(true)

    }
    else {
      if (Game.currentPlayer !== this.owner) {
        if (this.possibleValue > this.finalValue) {
          if (!this.hasFiveOfaKind) {
            this.setAvailable(true)
            this.valueElement.textContent = this.possibleValue.toString()
          }
        }
      }
    }
  }

  reset() {
    this.setOwned(false)
    this.finalValue = 0
    this.possibleValue = 0
    this.element.style.backgroundColor = 'black'
    this.valueElement.textContent = ''
    this.hasFiveOfaKind = false
  }

  clearPossible() {
    this.possibleValue = 0
    this.setAvailable(false)
    if (!this.owned) {
      this.finalValue = 0
      this.valueElement.textContent = ''
    }
    else {
      this.valueElement.textContent = this.finalValue.toString()
    }
  }
}