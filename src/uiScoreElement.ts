
class UIScoreElement implements iUIElement {

  path: Path2D
  location: iLocation
  size: iSize
  parent: iUIElement
  children: iUIElement[] = []
  isLeftHanded: boolean
  text =''
  originalColor: string = 'black'
  color: string = 'black'
  label1: string
  label2: string
  available = false

  constructor(location: iLocation, size: iSize, isLeftHanded: boolean, label1: string, label2: string) {
    this.location = location
    this.size = size
    this.isLeftHanded = isLeftHanded
    this.label1 = label1
    this.label2 = label2
    this.buildPath()
  }

  buildPath(): void {
    let textSize = {width: 85, height: 30}
    let scoreSize = {width: 30, height: 30}

    if (this.isLeftHanded) {
      this.path = PathBuilder.BuildLeftScore(this.location, this.size, 10)
      this.children.push(new Label(this.label1, {left: this.location.left + 55, top:this.location.top + 40}, textSize, this.color, Board.textColor),
        new Label(this.label2, {left: this.location.left + 55, top:this.location.top + 70}, textSize, this.color, Board.textColor),
        new Label('', {left: this.location.left + 129, top: this.location.top + 29}, scoreSize, this.color, Board.textColor))
    } else {
      this.path = PathBuilder.BuildRightScore(this.location, this.size, 10)
      this.children.push(new Label(this.label1, {left: this.location.left + 100, top: this.location.top + 40}, textSize, this.color, Board.textColor),
        new Label(this.label2, {left: this.location.left + 100, top: this.location.top + 70}, textSize, this.color, Board.textColor),
        new Label('', {left: this.location.left + 22, top: this.location.top + 79}, scoreSize, this.color, Board.textColor))
    }
  }

  hitTest(x: number, y: number) {
    return surface.isPointInPath(this.path, x, y); // New
  }

  render() {
    surface.fillStyle = this.color
    surface.fill(this.path);
    this.children[0].render()
    this.children[1].render()
  }

  renderValue(scoretext: string) {
    let scoreBoxColor = (this.available) ? 'Green' : this.color
    if (scoretext === ScoreElement.zero) {scoreBoxColor = this.color}
    //let sl = this.children[2] as Label
    this.children[2].color = scoreBoxColor
    this.children[2].text = scoretext
  }

}