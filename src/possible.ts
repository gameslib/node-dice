/**
 * The class evaluates a possible score for each scroreElement
 * after each roll of the dice.
 * This class is instantiated as a static object (singleton) in
 * the ScoreElement class.
 * We use each elements ID to evaluate scoring oportunities based on its type
 * We then calculate and return a posible score value based on the current die values
 */
class Possible  {

    evaluate(id: number) {
        if (id < 6) {
            return this.evaluateNumbers(id)
        }else {
            return this.evaluateCommon(id)
        }
    }

    evaluateCommon(id: any) {
        if (id === UI.FiveOfaKind) {
            if (Dice.evaluator.hasFiveOfaKind) {
                return 50
            }
            else {
                return 0
            }
        }
        else if (id === UI.SmallStraight) {
            if (Dice.evaluator.hasSmallStr) {
                return 30
            }
            else {
                return 0
            }
        }
        else if (id === UI.LargeStraight) {
            if (Dice.evaluator.hasLargeStr) {
                return 40
            }
            else {
                return 0
            }
        }
        else if (id === UI.House) {
            if (Dice.evaluator.hasFullHouse) {
                return 25
            }
            else {
                return 0
            }
        }
        else if (id === UI.FourOfaKind) {
            if (Dice.evaluator.hasQuads || Dice.evaluator.hasFiveOfaKind) {
                return Dice.evaluator.sumOfAllDie
            }
            else {
                return 0
            }
        }
        else if (id === UI.ThreeOfaKind) {
            if (Dice.evaluator.hasTrips || Dice.evaluator.hasQuads || Dice.evaluator.hasFiveOfaKind) {
                return Dice.evaluator.sumOfAllDie
            }
            else {
                return 0
            }
        }
        else if (id === UI.Chance) {
            return Dice.evaluator.sumOfAllDie
        }
        else {
            return 0
        }
    }

    evaluateNumbers(id: number) {
        var hits = 0
        var target = id + 1
        for (var i = 0; i < app.numberOfDie; i++) {
            var val = (app.dice.die[i]).value
            if (val === target) {
                hits += 1
            }
        }
        return target * hits
    }
}