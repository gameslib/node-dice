/**
 * The class evaluates a possible score for each ScoreComponet
 * after each roll of the dice.
 * This class is instantiated as a static object (singleton) in
 * the ScoreComponet class.
 * We use each elements ID to evaluate scoring oportunities based on its type.
 * We then calculate and return a posible score value based on current die values.
 */
class Possible {

  // singlton instance
  static ThreeOfaKind: number = 6
  static FourOfaKind: number = 7
  static SmallStraight: number = 8
  static LargeStraight: number = 9
  static House: number = 10
  static FiveOfaKind: number = 11
  static Chance: number = 12

  private static instance: Possible;

  static getInstance() {
    if (!Possible.instance) {
      Possible.instance = new Possible();
    }
    return Possible.instance;
  }

  evaluate(id: number) {
    if (id < 6) {
      return this.evaluateNumbers(id)
    } else {
      return this.evaluateCommon(id)
    }
  }

  evaluateCommon(id: any) {
    if (id === Possible.FiveOfaKind) {
      if (Dice.evaluator.hasFiveOfaKind) {
        return 50
      }
      else {
        return 0
      }
    }
    else if (id === Possible.SmallStraight) {
      if (Dice.evaluator.hasSmallStr) {
        return 30
      }
      else {
        return 0
      }
    }
    else if (id === Possible.LargeStraight) {
      if (Dice.evaluator.hasLargeStr) {
        return 40
      }
      else {
        return 0
      }
    }
    else if (id === Possible.House) {
      if (Dice.evaluator.hasFullHouse) {
        return 25
      }
      else {
        return 0
      }
    }
    else if (id === Possible.FourOfaKind) {
      if (Dice.evaluator.hasQuads || Dice.evaluator.hasFiveOfaKind) {
        return Dice.evaluator.sumOfAllDie
      }
      else {
        return 0
      }
    }
    else if (id === Possible.ThreeOfaKind) {
      if (Dice.evaluator.hasTrips || Dice.evaluator.hasQuads || Dice.evaluator.hasFiveOfaKind) {
        return Dice.evaluator.sumOfAllDie
      }
      else {
        return 0
      }
    }
    else if (id === Possible.Chance) {
      return Dice.evaluator.sumOfAllDie
    }
    else {
      return 0
    }
  }

  evaluateNumbers(id: number) {
    var hits = 0
    var target = id + 1
    for (var i = 0; i < 5; i++) {
      var val = (App.dice.die[i]).value
      if (val === target) {
        hits += 1
      }
    }
    return target * hits
  }
}