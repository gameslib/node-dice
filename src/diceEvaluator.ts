
class DiceEvaluator {

  smallLow: number = 15
  smallMid: number = 30
  smallHigh: number = 60
  largeLow: number = 31
  largeHigh: number = 62
  fullMask: number = 63

  binaryFaceValue: [number] = [0, 1, 2, 4, 8, 16, 32]
  countOfDieFaceValue: [number] = [0, 0, 0, 0, 0, 0, 0]
  sumOfAllDie: number = 0
  straightsMask: number = 0

  hasPair: Boolean = false
  hasTwoPair: Boolean = false
  hasTrips: Boolean = false
  hasQuads: Boolean = false
  hasFiveOkind: Boolean = false
  hasFiveOfaKind: Boolean = false
  hasTripsOrBetter: Boolean = false
  hasFullHouse: Boolean = false
  hasSmallStr: Boolean = false
  hasLargeStr: Boolean = false
  hasFullStr: Boolean = false

  evaluateDieValues() {
    this.countOfDieFaceValue = [0, 0, 0, 0, 0, 0, 0]
    this.sumOfAllDie = 0
    for (var i = 0; i < 5; i++) {
      var val = Board.Dice.die[i].value
      this.sumOfAllDie += val
      if (val > 0) {
        this.countOfDieFaceValue[val] += 1
      }
    }
    this.evaluateFaceValues()
    this.setScoringFlags()
    Board.Dice.isFiveOfaKind = this.testForYatzy()
  }

  setScoringFlags() {
    this.hasPair = false
    this.hasTwoPair = false
    this.hasTrips = false
    this.hasQuads = false
    this.hasFiveOkind = false
    this.hasFiveOfaKind = false
    this.hasTripsOrBetter = false
    this.hasFullHouse = false
    this.hasSmallStr = false
    this.hasLargeStr = false
    this.hasFullStr = false
    var mask = this.straightsMask
    for (var i = 0; i < 7; i++) {
      if (this.countOfDieFaceValue[i] === 5) {
        this.hasFiveOfaKind = true
        this.hasTripsOrBetter = true
      }

      if (this.countOfDieFaceValue[i] === 4) {
        this.hasQuads = true
        this.hasTripsOrBetter = true
      }

      if (this.countOfDieFaceValue[i] === 3) {
        this.hasTrips = true
        this.hasTripsOrBetter = true
      }

      if (this.countOfDieFaceValue[i] === 2) {
        if (this.hasPair) {
          this.hasTwoPair = true
        }
        this.hasPair = true
      }
    }

    this.hasFullHouse = (this.hasTrips && this.hasPair)
    this.hasLargeStr = (
        (mask & this.largeLow) === this.largeLow ||
        (mask & this.largeHigh) === this.largeHigh
        )
    this.hasSmallStr = (
        (mask & this.smallLow) === this.smallLow ||
        (mask & this.smallMid) === this.smallMid ||
        (mask & this.smallHigh) === this.smallHigh
      )
  }

  testForYatzy() {
    if (this.hasFiveOfaKind) {
      if (Board.Dice.fiveOfaKindWasSacrificed) {
        app.sounds.play(app.sounds.dohh)
      }
      else {
        app.sounds.play(app.sounds.woohoo)
      }
      return true
    }
    return false
  }

  evaluateFaceValues() {
    var die = Board.Dice.die
    this.straightsMask = 0
    for (var thisValue = 1; thisValue <= 6; thisValue++) {
      if (die[0].value === thisValue ||
        die[1].value === thisValue ||
        die[2].value === thisValue ||
        die[3].value === thisValue ||
        die[4].value === thisValue ) {
        this.straightsMask += this.binaryFaceValue[thisValue]
      }
    }
  }

  testForMultiples(multipleSize: number, thisManySets: number) {
    var count = 0,
      hits = 0,
      sum = 0
    for (var dieValue = 6; dieValue >= 1; dieValue--) {
      count = this.countOfDieFaceValue[dieValue]
      if (count >= multipleSize) {
        hits += 1
        sum += (multipleSize * dieValue)
        if (hits === thisManySets) {
          return sum
        }
      }
    }
    return 0
  }
}