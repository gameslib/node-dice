
class Dice {
    static evaluator: DiceEvaluator
    static rollCount: number = 0
    die: Die[]
    isFiveOfaKind: boolean = false
    fiveOfaKindCount: number = 0
    fiveOfaKindBonusAllowed: boolean = false
    fiveOfaKindWasSacrificed: boolean = false

    constructor() {
        Dice.evaluator = new DiceEvaluator()
        const dieElem: HTMLCanvasElement = document.getElementById('die0') as HTMLCanvasElement
        let dieFaceBuilder = new DieFaceBuilder
        dieFaceBuilder.buildDieFaces(dieElem.getContext('2d'))
        /*this.die = [
        new Die(0, document.getElementById('die0') as HTMLCanvasElement),
        new Die(1, document.getElementById('die1') as HTMLCanvasElement),
        new Die(2, document.getElementById('die2') as HTMLCanvasElement),
        new Die(3, document.getElementById('die3') as HTMLCanvasElement),
        new Die(4, document.getElementById('die4') as HTMLCanvasElement)
        ]*/
        this.die = new Array()
        for (var i = 0; i < app.numberOfDie; i++) {
            this.die.push(new Die(i, document.getElementById('die' + i.toString())))
        }

        this.resetTurn()
    }

    unfreezeAll() {
        this.die.forEach(function(thisDie) {
            thisDie.frozen = false
            thisDie.render()
        })
    }

    resetTurn() {
        this.die.forEach(function(thisDie) {
            thisDie.reset()
        })
        Dice.rollCount = 0
    }

    resetGame() {
        this.resetTurn()
        this.fiveOfaKindCount = 0
        this.fiveOfaKindBonusAllowed = false
        this.fiveOfaKindWasSacrificed = false
    }

    roll(dice: Die[] = null) {
        this.die.forEach(function(thisDie, index) {
          if(dice === null) {
            if (!thisDie.frozen) {
                thisDie.value = Math.floor(Math.random() * 6) + 1
                thisDie.lastValue = thisDie.value
            }
          } else {
            thisDie.frozen = dice[index].frozen
            if (!thisDie.frozen) {
                thisDie.value = dice[index].value
                thisDie.lastValue = thisDie.value
            }
          }
            thisDie.render()
        })
        Dice.rollCount += 1
        Dice.evaluator.evaluateDieValues()
    }

    toString() {
        var str = '['
        for (var i = 0; i < app.numberOfDie; i++) {
            str += this.die[i].value
        }
        return str + ']'
    }
}