
class ScoreButton extends UIElement {
  index: number
  children: UIElement[] = []
  isLeftHanded: boolean
  text = ''
  upperText: string
  lowerText: string
  scoreBox: Label
  upperName: Label
  lowerName: Label

  constructor(index: number, geometry: iGeometry, isLeftHanded: boolean, name: string) {
    super(name, geometry, 'black', true)
    this.index = index
    this.id = name
    this.isLeftHanded = isLeftHanded
    this.upperText = name.split(' ')[0]
    this.lowerText = name.split(' ')[1] || ''
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
    const { left, top } = this.geometry
    if (this.isLeftHanded) {
      this.path = PathBuilder.BuildLeftScore(new PathGeometry(this.geometry))
      this.children.push(
        new Label(this.id + '-upperText', this.upperText, { left: left + 55, top: top + 40 , width: 85, height: 30 }, this.color, UI.textColor, false),
        new Label(this.id + '-lowerText', this.lowerText, { left: left + 55, top: top + 70 , width: 85, height: 30 }, this.color, UI.textColor, false),
        new Label(this.id + '-score', '', { left: left + 129, top: top + 29,  width: 30, height: 30 }, this.color, UI.textColor, false))
    } else {
      this.path = PathBuilder.BuildRightScore(new PathGeometry(this.geometry))
      this.children.push(
        new Label(this.id + '-upperText', this.upperText, { left: left + 100, top: top + 40 , width: 85, height: 30 }, this.color, UI.textColor, false),
        new Label(this.id + '-lowerText', this.lowerText, { left: left + 100, top: top + 70 , width: 85, height: 30 }, this.color, UI.textColor, false),
        new Label(this.id + '-score', '', { left: left + 22, top: top + 79,  width: 30, height: 30 }, this.color, UI.textColor, false))
    }
    this.scoreBox = <Label>this.children[2]
    this.upperName = <Label>this.children[0]
    this.lowerName = <Label>this.children[1]
  }

  touched(broadcast: boolean, x: number, y: number) {
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