class ScoreSelectorAI {
    constructor() {
        this.zeroRanks = [
            UI.Chance, UI.Aces, UI.Deuces, UI.Treys,
            UI.Fours, UI.Fives, UI.Sixes,
            UI.ThreeOfaKind, UI.FourOfaKind, UI.House,
            UI.SmallStraight, UI.LargeStraight, UI.FiveOfaKind
        ];
        this.scoreRanks = [
            UI.FiveOfaKind, UI.LargeStraight, UI.SmallStraight,
            UI.House, UI.Sixes, UI.Fives, UI.Fours, UI.FourOfaKind,
            UI.Treys, UI.Deuces, UI.Aces, UI.Chance
        ];
        this.holdingMask = 0;
        this.maxDieCount = 0;
        this.targetFaceValue = 0;
        this.binaryFaceValue = [0, 1, 2, 4, 8, 16, 32];
    }
    reset() {
        this.holdingMask = 0;
        this.maxDieCount = 0;
        this.targetFaceValue = 0;
    }
    selectDiceToHold() {
        if (app.dice.isFiveOfaKind) {
            return this.processFiveOfaKind();
        }
        if (!Dice.evaluator.hasTripsOrBetter) {
            if (UI.scoreElements[UI.LargeStraight].available || UI.scoreElements[UI.SmallStraight].available) {
                return this.testForStraights();
            }
        }
        if (UI.scoreElements[UI.House].available) {
            return this.testForFullhouse();
        }
        return this.testForSets();
    }
    processFiveOfaKind() {
        if (UI.scoreElements[UI.FiveOfaKind].available) {
            UI.scoreElements[UI.FiveOfaKind].clicked();
            return true;
        }
        else if (app.dice.fiveOfaKindBonusAllowed) {
            app.dice.die.forEach((thisDie) => {
                thisDie.frozen = true;
                thisDie.render();
            });
            return false;
        }
    }
    testForStraights() {
        if (UI.scoreElements[UI.LargeStraight].available) {
            if (Dice.evaluator.hasLargeStr) {
                UI.scoreElements[UI.LargeStraight].clicked();
                return true;
            }
        }
        else if (UI.scoreElements[UI.SmallStraight].available) {
            if (Dice.evaluator.hasSmallStr) {
                UI.scoreElements[UI.SmallStraight].clicked();
                return true;
            }
        }
        this.holdForStraights();
        return false;
    }
    testForFullhouse() {
        if (Dice.evaluator.hasFullHouse) {
            UI.scoreElements[UI.House].clicked();
            return true;
        }
        else if (Dice.rollCount < 3) {
            if (Dice.evaluator.hasPair || Dice.evaluator.hasTwoPair || Dice.evaluator.hasTripsOrBetter) {
                this.holdMultiples();
                return false;
            }
            else if (this.maxDieCount >= 2) {
                return false;
            }
        }
    }
    testForSets() {
        var _this = this;
        var dieCount = 0;
        for (var faceValue = 1; faceValue < 7; faceValue++) {
            dieCount = Dice.evaluator.countOfDieFaceValue[faceValue];
            if (dieCount >= this.maxDieCount) {
                this.maxDieCount = dieCount;
                this.targetFaceValue = faceValue;
            }
        }
        app.dice.die.forEach(function (thisDie) {
            thisDie.frozen = (thisDie.value === _this.targetFaceValue);
            thisDie.render();
        });
        return false;
    }
    holdForStraights() {
        let _this = this;
        let bValues = this.binaryFaceValue;
        if (this.holdingMask === 0) {
            app.dice.unfreezeAll();
        }
        var gotOne = false;
        for (var faceValue = 6; faceValue >= 1; faceValue--) {
            if ((this.holdingMask & bValues[faceValue]) === bValues[faceValue]) { }
            else {
                gotOne = false;
                app.dice.die.forEach(function (thisDie) {
                    if (thisDie.value === faceValue && !gotOne) {
                        thisDie.frozen = true;
                        thisDie.render();
                        _this.holdingMask += bValues[faceValue];
                        gotOne = true;
                    }
                });
            }
        }
        if (this.holdingMask === (bValues[1] + bValues[2] + bValues[3] + bValues[4] + bValues[6])) {
            this.unfreezeDie(6);
        }
        if (this.holdingMask === (bValues[1] + bValues[2] + bValues[3] + bValues[5] + bValues[6])) {
            this.unfreezeDie(6);
        }
        if (this.holdingMask === (bValues[1] + bValues[2] + bValues[4] + bValues[5] + bValues[6])) {
            this.unfreezeDie(1);
        }
        if (this.holdingMask === (bValues[1] + bValues[3] + bValues[4] + bValues[5] + bValues[6])) {
            this.unfreezeDie(1);
        }
    }
    unfreezeDie(valueToRemove) {
        app.dice.die.forEach(function (thisDie) {
            if (thisDie.value === valueToRemove) {
                thisDie.frozen = false;
                thisDie.render();
            }
        });
        this.holdingMask -= this.binaryFaceValue[valueToRemove];
    }
    holdMultiples() {
        app.dice.unfreezeAll();
        for (var faceValue = 6; faceValue >= 1; faceValue--) {
            if (Dice.evaluator.countOfDieFaceValue[faceValue] >= 2) {
                app.dice.die.forEach(function (thisDie) {
                    if (thisDie.value === faceValue) {
                        thisDie.frozen = true;
                        thisDie.render();
                    }
                });
            }
        }
    }
    pickCategory() {
        let maxCategory = 0;
        let maxPossible = 0;
        let thisElement;
        let selectedElement;
        this.scoreRanks.forEach((index) => {
            thisElement = UI.scoreElements[index];
            if (thisElement.available) {
                if (thisElement.possibleValue > maxPossible) {
                    maxPossible = thisElement.possibleValue;
                    if (thisElement.id < 6) {
                        if (thisElement.possibleValue >= ((thisElement.id + 1) / 3)) {
                            maxPossible += (thisElement.id + 1) * 2;
                        }
                    }
                    selectedElement = thisElement;
                }
            }
        });
        if (maxPossible > 0) {
            selectedElement.clicked();
            return;
        }
        else {
            let index = 0;
            let element = UI.scoreElements[this.zeroRanks[index]];
            while (element.locked) {
                index += 1;
                element = UI.scoreElements[this.zeroRanks[index]];
            }
            maxCategory = this.zeroRanks[index];
        }
        UI.scoreElements[maxCategory].clicked();
    }
}
