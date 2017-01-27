
class Label extends UIElement {
  private _text: string
  get text(): string {
    return this._text
  }
  set text(newText: string) {
    this._text = newText
    this.render()
    this.geometry.width = Math.floor(surface.measureText(newText).width)
    if (this.geometry.width < 35) { this.geometry.width = 35 }
    this.textLocation.left = this.geometry.left - (this.geometry.width * 0.5)
  }

  textLocation = { left: 0, top: 0 }
  textColor: string

  constructor(id: string, text: string, geometry: iGeometry, color = 'black', textColor = UI.textColor, enabled: boolean) {
    super(id, geometry, color, enabled)
    this.textLocation.left = geometry.left - (geometry.width * 0.5)
    this.textLocation.top = geometry.top - (geometry.height * 0.7)
    this.textColor = textColor
    this.buildPath()
    this.text = text
  }

  buildPath() {
    let p = new Path2D
    p.rect(this.textLocation.left, this.textLocation.top, this.geometry.width, this.geometry.height)
    this.path = p
  }

  touched(broadcast: boolean, x: number, y: number) {
    if (broadcast) {
      App.socketSend('label-' + this.id, { label: this.id })
    }
  }

  render() {
    surface.fillStyle = this.color
    surface.fillRect(this.textLocation.left, this.textLocation.top, this.geometry.width, this.geometry.height)
    surface.fillStyle = this.textColor
    surface.strokeStyle = this.textColor
    surface.fillText(this.text, this.geometry.left, this.geometry.top)
    surface.strokeText(this.text, this.geometry.left, this.geometry.top)
  }
}
