
class ScoreButton implements iView {
  index: number
  id: string
  geometry: iGeometry
  ctx: CanvasRenderingContext2D
  container: Container
  path: Path2D
  color: string
  enabled: boolean
  visible: boolean
  children: iView[] = []
  viewModel: iViewModel
  isLeftHanded: boolean
  text = ''
  upperText: string
  lowerText: string
  scoreBox: Label
  upperName: Label
  lowerName: Label

  constructor(index: number, geometry: iGeometry, isLeftHanded: boolean, name: string, container: Container, vm:iViewModel) {
    this.enabled = true
    this.geometry = geometry
    this.container = container
    this.viewModel = vm
    this.ctx = container.ctx
    this.color = 'black'
    this.children = []
    if (this.enabled) {this.register(container)}
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

  register(container: Container){
    container.targetElements.push(this)
  }

  buildPath() {
    let textSize = { width: 85, height: 30 }
    let scoreSize = { width: 30, height: 30 }
    const { left, top } = this.geometry
    if (this.isLeftHanded) {
      this.path = Factories.BuildLeftScore(new PathGeometry(this.geometry))
      this.children.push(
        new Label(this.id + '-upperText', this.upperText, { left: left + 55, top: top + 40 , width: 85, height: 30 }, this.color, 'snow', false, this.container),
        new Label(this.id + '-lowerText', this.lowerText, { left: left + 55, top: top + 70 , width: 85, height: 30 }, this.color, 'snow', false, this.container),
        new Label(this.id + '-score', '', { left: left + 129, top: top + 29,  width: 30, height: 30 }, this.color, 'snow', false, this.container))
    } else {
      this.path = Factories.BuildRightScore(new PathGeometry(this.geometry))
      this.children.push(
        new Label(this.id + '-upperText', this.upperText, { left: left + 100, top: top + 40 , width: 85, height: 30 }, this.color, 'snow', false, this.container),
        new Label(this.id + '-lowerText', this.lowerText, { left: left + 100, top: top + 70 , width: 85, height: 30 }, this.color, 'snow', false, this.container),
        new Label(this.id + '-score', '', { left: left + 22, top: top + 79,  width: 30, height: 30 }, this.color, 'snow', false, this.container))
    }
    this.scoreBox = <Label>this.children[2]
    this.upperName = <Label>this.children[0]
    this.lowerName = <Label>this.children[1]
  }

  touched(broadcast: boolean, x: number, y: number) {
    app.socketSend('ScoreClicked', {
      'id': this.container.id,
      'scoreNumber': this.index
    });
    if ( this.container.viewModel.scoreItems[this.index].clicked()) {
      app.socketSend('TurnOver', {
        'id': this.container.id
      });
      Events.fire(Events.Type.TurnOver, {})
    }
  }

  render() {
    this.ctx.fillStyle = this.color
    this.ctx.fill(this.path);
    this.upperName.render()
    this.lowerName.render()
  }

  private renderScore(scoretext: string, available: boolean) {
    let scoreBoxColor = (available) ? 'Green' : this.color
    if (scoretext === ScoreButtonVM.zero) { scoreBoxColor = this.color }
    this.scoreBox.color = scoreBoxColor
    this.scoreBox.text = scoretext // label.text setter fires render
  }
}