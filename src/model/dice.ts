
class Dice {
  static evaluator: DiceEvaluator
  rollCount: number = 0
  dieSize = 82
  die: DieVM[] //Die[]
  isFiveOfaKind: boolean = false
  fiveOfaKindCount: number = 0
  fiveOfaKindBonusAllowed: boolean = false
  fiveOfaKindWasSacrificed: boolean = false

  constructor(container: Container) {
    Dice.evaluator = new DiceEvaluator(this)
    this.die = []
  }

  unfreezeAll() {
    this.die.forEach(function (thisDie) {
      thisDie.frozen = false
    })
  }

  resetTurn() {
    this.die.forEach(function (thisDie) {
      thisDie.reset()
    })
    this.rollCount = 0
  }

  resetGame() {
    this.resetTurn()
    this.isFiveOfaKind = false
    this.fiveOfaKindCount = 0
    this.fiveOfaKindBonusAllowed = false
    this.fiveOfaKindWasSacrificed = false
  }

  // if local 'roll', dice parameter will be null
  // otherwise, dice parameter will be the values
  // from another players roll
  roll(die: DieVM[] = null) {
    this.die.forEach(function (thisDie, index) {
      if (die === null) {
        if (!thisDie.frozen) {
          thisDie.value = Math.floor(Math.random() * 6) + 1
        }
      } else {
        thisDie.frozen = die[index].frozen
        if (!thisDie.frozen) {
          thisDie.value = die[index]._value
        }
      }
    })
    this.rollCount += 1
    Dice.evaluator.evaluateDieValues()
  }

  toString() {
    var str = '['
    for (var i = 0; i < 5; i++) {
      str += this.die[i].value
    }
    return str + ']'
  }
}