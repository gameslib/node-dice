
class ScoreElement implements UIElement {
  index: number
  id: string
  enabled: boolean
  visible: boolean = true
  path: Path2D
  location: iLocation
  size: iSize
  children: UIElement[] = []
  isLeftHanded: boolean
  text = ''
  color: string = 'black'
  upperText: string
  lowerText: string
  scoreBox: Label
  upperName: Label
  lowerName: Label

  constructor(index: number, location: iLocation, size: iSize, isLeftHanded: boolean, upperText: string, lowerText: string) {
    this.index = index
    this.id = upperText + '-' + lowerText
    this.location = location
    this.size = size
    this.isLeftHanded = isLeftHanded
    this.upperText = upperText
    this.lowerText = lowerText
    this.buildPath()

    Events.on('UpdateScoreElement' + this.index, (data: any) => {
      this.color = data.color
      this.upperName.color = this.color
      this.lowerName.color = this.color
      this.render()
      this.renderScore(data.valueString, data.available)
    })

    Events.on('RenderValue' + this.index, (data: any) => {
      this.renderScore(data.valueString, data.available)
    })

  }

  buildPath() {
    let textSize = { width: 85, height: 30 }
    let scoreSize = { width: 30, height: 30 }
    const { left, top } = this.location
    //console.log(left + ' ' + top)
    if (this.isLeftHanded) {
      this.path = PathBuilder.BuildLeftScore(this.location, this.size, 10)
      //console.log(left + ' ' + top)
      this.children.push(
        new Label(this.id + '-upperText', this.upperText, { left: left + 55, top: top + 40 }, textSize, this.color, UI.textColor, false),
        new Label(this.id + '-lowerText', this.lowerText, { left: left + 55, top: top + 70 }, textSize, this.color, UI.textColor, false),
        new Label(this.id + '-score', '', { left: left + 129, top: top + 29 }, scoreSize, this.color, UI.textColor, false))
    } else {
      this.path = PathBuilder.BuildRightScore(this.location, this.size, 10)
      this.children.push(
        new Label(this.id + '-upperText', this.upperText, { left: left + 100, top: top + 40 }, textSize, this.color, UI.textColor, false),
        new Label(this.id + '-lowerText', this.lowerText, { left: left + 100, top: top + 70 }, textSize, this.color, UI.textColor, false),
        new Label(this.id + '-score', '', { left: left + 22, top: top + 79 }, scoreSize, this.color, UI.textColor, false))
    }
    this.scoreBox = <Label>this.children[2]
    this.upperName = <Label>this.children[0]
    this.lowerName = <Label>this.children[1]
  }

  onClick(broadcast: boolean, x: number, y: number) {
    App.socketSend('ScoreClicked', {
      'id': App.thisID,
      'scoreNumber': this.index
    });
    if (Game.scoreItems[this.index].clicked()) {
      App.socketSend('TurnOver', {
        'id': App.thisID
      });
      Events.fire('ScoreWasSelected', {})
      //this.isGameComplete()
      //this.resetTurn()
    }
  }

  render() {
    surface.fillStyle = this.color
    surface.fill(this.path);
    this.upperName.render()
    this.lowerName.render()
  }

  private renderScore(scoretext: string, available: boolean) {
    let scoreBoxColor = (available) ? 'Green' : this.color
    if (scoretext === ScoreComponent.zero) { scoreBoxColor = this.color }
    this.scoreBox.color = scoreBoxColor
    this.scoreBox.text = scoretext // label.text setter fires render
  }
}