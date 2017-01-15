class Possible {
    static getInstance() {
        if (!Possible.instance) {
            Possible.instance = new Possible();
        }
        return Possible.instance;
    }
    evaluate(id) {
        if (id < 6) {
            return this.evaluateNumbers(id);
        }
        else {
            return this.evaluateCommon(id);
        }
    }
    evaluateCommon(id) {
        if (id === Possible.FiveOfaKind) {
            if (Dice.evaluator.hasFiveOfaKind) {
                return 50;
            }
            else {
                return 0;
            }
        }
        else if (id === Possible.SmallStraight) {
            if (Dice.evaluator.hasSmallStr) {
                return 30;
            }
            else {
                return 0;
            }
        }
        else if (id === Possible.LargeStraight) {
            if (Dice.evaluator.hasLargeStr) {
                return 40;
            }
            else {
                return 0;
            }
        }
        else if (id === Possible.House) {
            if (Dice.evaluator.hasFullHouse) {
                return 25;
            }
            else {
                return 0;
            }
        }
        else if (id === Possible.FourOfaKind) {
            if (Dice.evaluator.hasQuads || Dice.evaluator.hasFiveOfaKind) {
                return Dice.evaluator.sumOfAllDie;
            }
            else {
                return 0;
            }
        }
        else if (id === Possible.ThreeOfaKind) {
            if (Dice.evaluator.hasTrips || Dice.evaluator.hasQuads || Dice.evaluator.hasFiveOfaKind) {
                return Dice.evaluator.sumOfAllDie;
            }
            else {
                return 0;
            }
        }
        else if (id === Possible.Chance) {
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
Possible.ThreeOfaKind = 6;
Possible.FourOfaKind = 7;
Possible.SmallStraight = 8;
Possible.LargeStraight = 9;
Possible.House = 10;
Possible.FiveOfaKind = 11;
Possible.Chance = 12;
