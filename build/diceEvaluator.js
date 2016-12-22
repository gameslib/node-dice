class DiceEvaluator {
    constructor() {
        this.smallLow = 15;
        this.smallMid = 30;
        this.smallHigh = 60;
        this.largeLow = 31;
        this.largeHigh = 62;
        this.fullMask = 63;
        this.binaryFaceValue = [0, 1, 2, 4, 8, 16, 32];
        this.countOfDieFaceValue = [0, 0, 0, 0, 0, 0, 0];
        this.sumOfAllDie = 0;
        this.straightsMask = 0;
        this.hasPair = false;
        this.hasTwoPair = false;
        this.hasTrips = false;
        this.hasQuads = false;
        this.hasFiveOkind = false;
        this.hasFiveOfaKind = false;
        this.hasTripsOrBetter = false;
        this.hasFullHouse = false;
        this.hasSmallStr = false;
        this.hasLargeStr = false;
        this.hasFullStr = false;
    }
    evaluateDieValues() {
        this.countOfDieFaceValue = [0, 0, 0, 0, 0, 0, 0];
        this.sumOfAllDie = 0;
        for (var i = 0; i < app.numberOfDie; i++) {
            var val = app.dice.die[i].value;
            this.sumOfAllDie += val;
            if (val > 0) {
                this.countOfDieFaceValue[val] += 1;
            }
        }
        this.evaluateFaceValues();
        this.setScoringFlags();
        app.dice.isFiveOfaKind = this.testForYatzy();
    }
    setScoringFlags() {
        this.hasPair = false;
        this.hasTwoPair = false;
        this.hasTrips = false;
        this.hasQuads = false;
        this.hasFiveOkind = false;
        this.hasFiveOfaKind = false;
        this.hasTripsOrBetter = false;
        this.hasFullHouse = false;
        this.hasSmallStr = false;
        this.hasLargeStr = false;
        this.hasFullStr = false;
        var mask = this.straightsMask;
        for (var i = 0; i < 7; i++) {
            if (this.countOfDieFaceValue[i] === 5) {
                this.hasFiveOfaKind = true;
                this.hasTripsOrBetter = true;
            }
            if (this.countOfDieFaceValue[i] === 4) {
                this.hasQuads = true;
                this.hasTripsOrBetter = true;
            }
            if (this.countOfDieFaceValue[i] === 3) {
                this.hasTrips = true;
                this.hasTripsOrBetter = true;
            }
            if (this.countOfDieFaceValue[i] === 2) {
                if (this.hasPair) {
                    this.hasTwoPair = true;
                }
                this.hasPair = true;
            }
        }
        this.hasFullHouse = (this.hasTrips && this.hasPair);
        this.hasLargeStr = ((mask & this.largeLow) === this.largeLow ||
            (mask & this.largeHigh) === this.largeHigh);
        this.hasSmallStr = ((mask & this.smallLow) === this.smallLow ||
            (mask & this.smallMid) === this.smallMid ||
            (mask & this.smallHigh) === this.smallHigh);
    }
    testForYatzy() {
        if (this.hasFiveOfaKind) {
            if (app.dice.fiveOfaKindWasSacrificed) {
                app.sounds.play(app.sounds.dohh);
            }
            else {
                app.sounds.play(app.sounds.woohoo);
            }
            return true;
        }
        return false;
    }
    evaluateFaceValues() {
        var die = app.dice.die;
        this.straightsMask = 0;
        for (var thisValue = 1; thisValue <= 6; thisValue++) {
            if (die[0].value === thisValue ||
                die[1].value === thisValue ||
                die[2].value === thisValue ||
                die[3].value === thisValue ||
                die[4].value === thisValue ||
                die[app.numberOfDie - 1].value === thisValue) {
                this.straightsMask += this.binaryFaceValue[thisValue];
            }
        }
    }
    testForMultiples(multipleSize, thisManySets) {
        var count = 0, hits = 0, sum = 0;
        for (var dieValue = 6; dieValue >= 1; dieValue--) {
            count = this.countOfDieFaceValue[dieValue];
            if (count >= multipleSize) {
                hits += 1;
                sum += (multipleSize * dieValue);
                if (hits === thisManySets) {
                    return sum;
                }
            }
        }
        return 0;
    }
}
