
class Label implements iUIElement {
  id: number
  clickable: boolean
  private _text: string
  get text(): string {
    return this._text
  }
  set text(newText: string) {
    this._text = newText
    this.render()
    this.size.width = Math.floor(surface.measureText(newText).width)
    if (this.size.width < 35) { this.size.width = 35 }
    this.textLocation.left = this.location.left - (this.size.width * 0.5)
  }

  location: iLocation
  size: iSize
  path: Path2D
  children: iUIElement[] = []
  textLocation: iLocation = { left: 0, top: 0 }
  color: string
  textColor: string

  constructor(id: number, text: string, location: iLocation, size: iSize, color = 'black', textColor = UI.textColor, clickable: boolean) {
    this.id = id
    this.clickable = clickable
    this.location = location
    this.textLocation.left = location.left - (size.width * 0.5)
    this.size = size
    this.textLocation.top = location.top - (size.height * 0.7)
    this.size = size
    this.color = color
    this.textColor = textColor
    this.buildPath()
    if (clickable) {
      UI.clickables.push(this)
    }
    this.text = text
  }

  buildPath() {
    let p = new Path2D
    p.rect(this.textLocation.left, this.textLocation.top, this.size.width, this.size.height)
    this.path = p
  }

  onClick(broadcast: boolean, x: number, y: number) {
    if (broadcast) {
      App.socketSend('label-' + this.id, { label: this.id })
    }
  }

  render() {
    surface.fillStyle = this.color
    surface.fillRect(this.textLocation.left, this.textLocation.top, this.size.width, this.size.height)
    surface.fillStyle = this.textColor
    surface.strokeStyle = this.textColor
    surface.fillText(this.text, this.location.left, this.location.top)
    surface.strokeText(this.text, this.location.left, this.location.top)
  }
}
