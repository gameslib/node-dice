
class Label implements iView {

  id: string
  geometry: iGeometry
  ctx: CanvasRenderingContext2D
  path: Path2D
  color: string
  enabled: boolean
  visible: boolean
  children: iView[]
  viewModel: iViewModel

  private _text: string
  get text(): string {
    return this._text
  }
  set text(newText: string) {
    this._text = newText
    this.render()
    this.geometry.width = Math.floor(this.ctx.measureText(newText).width)
    if (this.geometry.width < 35) { this.geometry.width = 35 }
    this.textLocation.left = this.geometry.left - (this.geometry.width * 0.5)
  }

  textLocation = { left: 0, top: 0 }
  textColor: string

  constructor(id: string,
              text: string,
              geometry: iGeometry,
              color = 'black',
              textColor = 'snow',
              enabled: boolean,
              container: Container) {
    this.id = id
    this.enabled = enabled
    this.geometry = geometry
    this.ctx = container.ctx
    this.viewModel = new LabelVM()
    this.color = color
    this.children = []
    if (enabled) {this.register(container)}
    this.textLocation.left = geometry.left - (geometry.width * 0.5)
    this.textLocation.top = geometry.top - (geometry.height * 0.7)
    this.textColor = textColor
    this.buildPath()
    this.text = text
  }

  register(container: Container){
    container.targetElements.push(this)
  }

  buildPath() {
    let p = new Path2D
    p.rect(this.textLocation.left, this.textLocation.top, this.geometry.width, this.geometry.height)
    this.path = p
  }

  touched(broadcast: boolean, x: number, y: number) {
    if (broadcast) {
      app.socketSend('label-' + this.id, { label: this.id })
    }
  }

  render() {
    this.ctx.fillStyle = this.color
    this.ctx.fillRect(this.textLocation.left, this.textLocation.top, this.geometry.width, this.geometry.height)
    this.ctx.fillStyle = this.textColor
    this.ctx.strokeStyle = this.textColor
    this.ctx.fillText(this.text, this.geometry.left, this.geometry.top)
    this.ctx.strokeText(this.text, this.geometry.left, this.geometry.top)
  }
}
