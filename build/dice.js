class Dice {
    constructor() {
        this.isFiveOfaKind = false;
        this.fiveOfaKindCount = 0;
        this.fiveOfaKindBonusAllowed = false;
        this.fiveOfaKindWasSacrificed = false;
        Dice.evaluator = new DiceEvaluator();
        let dieFaceBuilder = new DieFaceBuilder;
        dieFaceBuilder.buildDieFaces(80);
        this.die = new Array();
        for (var i = 0; i < 5; i++) {
            var x = 81 + (i * 90);
            this.die.push(new Die(i, x, 95, 82));
        }
        this.resetTurn();
    }
    unfreezeAll() {
        this.die.forEach(function (thisDie) {
            thisDie.frozen = false;
            thisDie.render();
        });
    }
    resetTurn() {
        this.die.forEach(function (thisDie) {
            thisDie.reset();
        });
        Dice.rollCount = 0;
    }
    resetGame() {
        this.resetTurn();
        this.fiveOfaKindCount = 0;
        this.fiveOfaKindBonusAllowed = false;
        this.fiveOfaKindWasSacrificed = false;
    }
    roll(dice = null) {
        this.die.forEach(function (thisDie, index) {
            if (dice === null) {
                if (!thisDie.frozen) {
                    thisDie.value = Math.floor(Math.random() * 6) + 1;
                    thisDie.lastValue = thisDie.value;
                }
            }
            else {
                thisDie.frozen = dice[index].frozen;
                if (!thisDie.frozen) {
                    thisDie.value = dice[index].value;
                    thisDie.lastValue = thisDie.value;
                }
            }
            thisDie.render();
        });
        Dice.rollCount += 1;
        Dice.evaluator.evaluateDieValues();
    }
    toString() {
        var str = '[';
        for (var i = 0; i < 5; i++) {
            str += this.die[i].value;
        }
        return str + ']';
    }
}
Dice.rollCount = 0;
