
class PlayerVM implements iViewModel {
  id: string
  view: Label
  name: string
  color: any
  score: number

  isCurrent: boolean
  rollTimer: any
  lastScore: string

  constructor(view: any, id: string, name: string, color: any, score: number) {
    this.id = id
    this.name = name
    this.color = color
    this.score = score
    this.view = view
    this.view.textColor = color
    this.resetScore()
  }

  addScore(value: number) {
    this.score += value
    this.view.textColor = this.color
    this.view.text = this.name + ' = ' + this.score
  }

  resetScore() {
    this.score = 0
    this.view.textColor = this.color
    this.view.text = this.name
   }

}