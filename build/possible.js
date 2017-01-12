class Possible {
    evaluate(id) {
        if (id < 6) {
            return this.evaluateNumbers(id);
        }
        else {
            return this.evaluateCommon(id);
        }
    }
    evaluateCommon(id) {
        if (id === UI.FiveOfaKind) {
            if (Dice.evaluator.hasFiveOfaKind) {
                return 50;
            }
            else {
                return 0;
            }
        }
        else if (id === UI.SmallStraight) {
            if (Dice.evaluator.hasSmallStr) {
                return 30;
            }
            else {
                return 0;
            }
        }
        else if (id === UI.LargeStraight) {
            if (Dice.evaluator.hasLargeStr) {
                return 40;
            }
            else {
                return 0;
            }
        }
        else if (id === UI.House) {
            if (Dice.evaluator.hasFullHouse) {
                return 25;
            }
            else {
                return 0;
            }
        }
        else if (id === UI.FourOfaKind) {
            if (Dice.evaluator.hasQuads || Dice.evaluator.hasFiveOfaKind) {
                return Dice.evaluator.sumOfAllDie;
            }
            else {
                return 0;
            }
        }
        else if (id === UI.ThreeOfaKind) {
            if (Dice.evaluator.hasTrips || Dice.evaluator.hasQuads || Dice.evaluator.hasFiveOfaKind) {
                return Dice.evaluator.sumOfAllDie;
            }
            else {
                return 0;
            }
        }
        else if (id === UI.Chance) {
            return Dice.evaluator.sumOfAllDie;
        }
        else {
            return 0;
        }
    }
    evaluateNumbers(id) {
        var hits = 0;
        var target = id + 1;
        for (var i = 0; i < 5; i++) {
            var val = (App.dice.die[i]).value;
            if (val === target) {
                hits += 1;
            }
        }
        return target * hits;
    }
}
