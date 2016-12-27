class UI {

  static scoreElements: ScoreElement[]
  static node: HTMLElement[]

  // scoring indexes
  static Aces: number = 0
  static Deuces: number = 1
  static Treys: number = 2
  static Fours: number = 3
  static Fives: number = 4
  static Sixes: number = 5

  static ThreeOfaKind: number = 6
  static FourOfaKind: number = 7
  static SmallStraight: number = 8
  static LargeStraight: number = 9
  static House: number = 10
  static FiveOfaKind: number = 11
  static Chance: number = 12

  constructor() {
    UI.scoreElements = new Array()
    UI.node = new Array()
    let $ = (name: string) => { return document.getElementById(name) }
    UI.node.push($('ones'), $('twos'), $('threes'), $('fours'), $('fives'), $('sixes'),
      $('three_kind'), $('four_kind'),
      $('small_straight'), $('large_straight'),
      $('house'), $('five_kind'), $('chance'))
  }

  static buildPlayerElements(game: Game){
    App.playerElements = new Array
    App.playerElements[0] = document.getElementById('player1')
    App.playerElements[1] = document.getElementById('player2')
    App.playerElements[2] = document.getElementById('player3')
    App.playerElements[3] = document.getElementById('player4')
  }

  static resetScoreElements() {
    App.playerElements[0].textContent = '.'
    App.playerElements[0].style.color = 'black'

    App.playerElements[1].textContent = '.'
    App.playerElements[1].style.color = 'black'

    App.playerElements[2].textContent = '.'
    App.playerElements[2].style.color = 'black'

    App.playerElements[3].textContent = '.'
    App.playerElements[3].style.color = 'black'
  }

  static buildScoreElements(game: Game) {
    let $ = (name: string) => { return document.getElementById(name) }
    game.rollButton = $('rollButton') as HTMLButtonElement
    game.leftScoreElement = $('leftScore')

    UI.scoreElements = new Array
    UI.scoreElements.push(
      new ScoreElement(UI.node[UI.Aces], UI.Aces, 'Ones'),
      new ScoreElement(UI.node[UI.Deuces], UI.Deuces, 'Twos'),
      new ScoreElement(UI.node[UI.Treys], UI.Treys, 'Threes'),
      new ScoreElement(UI.node[UI.Fours], UI.Fours, 'Fours'),
      new ScoreElement(UI.node[UI.Fives], UI.Fives, 'Fives'),
      new ScoreElement(UI.node[UI.Sixes], UI.Sixes, 'Sixes'),
      new ScoreElement(UI.node[UI.ThreeOfaKind], UI.ThreeOfaKind, 'Three of a Kind'),
      new ScoreElement(UI.node[UI.FourOfaKind], UI.FourOfaKind, 'Four of a Kind'),
      new ScoreElement(UI.node[UI.SmallStraight], UI.SmallStraight, 'Small Straight'),
      new ScoreElement(UI.node[UI.LargeStraight], UI.LargeStraight, 'Large Straight'),
      new ScoreElement(UI.node[UI.House], UI.House, 'Full House'),
      new ScoreElement(UI.node[UI.FiveOfaKind], UI.FiveOfaKind, 'Five of a Kind'),
      new ScoreElement(UI.node[UI.Chance], UI.Chance, 'Chance')
    )
  }
}