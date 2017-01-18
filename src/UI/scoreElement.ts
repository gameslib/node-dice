
class ScoreElement implements iUIElement {
  id: number
  clickable: boolean
  path: Path2D
  location: iLocation
  size: iSize
  children: iUIElement[] = []
  isLeftHanded: boolean
  text = ''
  color: string = 'black'
  label1: string
  label2: string


  constructor(id: number, location: iLocation, size: iSize, isLeftHanded: boolean, label1: string, label2: string) {
    this.id = id
    this.location = location
    this.size = size
    this.isLeftHanded = isLeftHanded
    this.label1 = label1
    this.label2 = label2
    this.buildPath()

    Events.on('UpdateScoreElement' + this.id, (data: any) => {
      this.color = data.color
      this.children[0].color = this.color
      this.children[1].color = this.color
      this.render()
      this.renderValue(data.valueString, data.available)
    })

    Events.on('RenderValue' + this.id, (data: any) => {
      this.renderValue(data.valueString, data.available)
    })

  }

  buildPath() {
    let textSize = { width: 85, height: 30 }
    let scoreSize = { width: 30, height: 30 }

    if (this.isLeftHanded) {
      this.path = PathBuilder.BuildLeftScore(this.location, this.size, 10)
      this.children.push(new Label(0, this.label1, { left: this.location.left + 55, top: this.location.top + 40 }, textSize, this.color, UI.textColor, false),
        new Label(1, this.label2, { left: this.location.left + 55, top: this.location.top + 70 }, textSize, this.color, UI.textColor, false),
        new Label(2, '', { left: this.location.left + 129, top: this.location.top + 29 }, scoreSize, this.color, UI.textColor, false))
    } else {
      this.path = PathBuilder.BuildRightScore(this.location, this.size, 10)
      this.children.push(new Label(0,this.label1, { left: this.location.left + 100, top: this.location.top + 40 }, textSize, this.color, UI.textColor, false),
        new Label(1, this.label2, { left: this.location.left + 100, top: this.location.top + 70 }, textSize, this.color, UI.textColor, false),
        new Label(2, '', { left: this.location.left + 22, top: this.location.top + 79 }, scoreSize, this.color, UI.textColor, false))
    }
  }

  onClick(broadcast:boolean, x: number, y: number) {
    console.log('score-' + this.id + ' clicked')
    App.socketSend('ScoreClicked', {
      'id': App.thisID,
      'scoreNumber': this.id
    });
    if (Game.scoreItems[this.id].clicked()) {
      App.socketSend('TurnOver', {
        'id': App.thisID
      });
      Events.fire('ScoreWasSelected',{})
      //this.isGameComplete()
      //this.resetTurn()
    }
  }

  render() {
    surface.fillStyle = this.color
    surface.fill(this.path);
    this.children[0].render()
    this.children[1].render()
  }

  renderValue(scoretext: string, available: boolean) {
    let scoreBoxColor = (available) ? 'Green' : this.color
    if (scoretext === ScoreComponent.zero) { scoreBoxColor = this.color }
    this.children[2].color = scoreBoxColor
    this.children[2].text = scoretext
  }

}