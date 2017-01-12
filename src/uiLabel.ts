
class Label implements iUIElement{
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
  path: Path2D //TODO
  parent: iUIElement
  children: iUIElement[] = []
  textLocation: iLocation = { left: 0, top: 0 }
  color: string
  textColor: string

  constructor(text: string, location: iLocation, size: iSize, color: string, textColor: string) {
    this.location = location
    this.textLocation.left = location.left - (size.width * 0.5)
    this.size = size
    this.textLocation.top = location.top - (size.height * 0.7)
    this.size = size
    this.color = color
    this.textColor = textColor
    this.text = text
  }

  buildPath (): Path2D {
    return new Path2D
  }

  hitTest(x: number, y: number) {
    return false;
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
