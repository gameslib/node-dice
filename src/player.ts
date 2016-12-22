
class Player {
  id: string
  name: string
  color: any
  score: number
  element: any
  isCurrent: boolean
  rollTimer: any
  lastScore: string

  constructor(id: string, name: string, color: any, score: number, elem: any) {
    this.id = id
    this.name = name
    this.color = color
    this.score = score
    this.element = elem
    this.element.style.color = color
    this.resetScore()
  }

  addScore(value: number) {
    this.score += value
    this.element.textContent = this.name + ' = ' + this.score
  }

  resetScore() {
    this.score = 0
    this.element.textContent = this.name
  }

}