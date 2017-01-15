
class Button implements iUIElement {
  id: number
  get text(): string {
    return this.children[0].text
  }
  set text(newText: string) {
    this.children[0].text = newText
    this.render()
  }

  _backgroundColor: string = 'black'
  get color(): string {
    return this._backgroundColor
  }
  set color(color: string) {
    this._backgroundColor = color
    this.children[0].color = color
    this.render()
  }
  location: iLocation
  size: iSize
  path: Path2D
  children: iUIElement[] = []
  disabled: boolean = false

  firstPass: boolean // used for shadow control
  textLabel: Label

  constructor(location: iLocation, size: iSize) {
    this.children.push(new Label(0, 'Roll Dice', { left: location.left + 90, top: location.top + 40 }, { width: size.width - 25, height: 40 }, 'blue', UI.textColor))
    this.location = location
    this.size = size
    this.buildPath()
    this.firstPass = true
    this.render()
    UI.clickables.push(this)

    Events.on('RollUpdate', (data: { text: string, color: string, disabled: boolean }) => {
      this.disabled = data.disabled
      this._backgroundColor = data.color
      this.children[0].color = data.color
      this.text = data.text
    })

  }

  buildPath() {
    this.path = PathBuilder.BuildRectangle(this.location, this.size, 10)
  }

  clicked(broadcast: boolean) {
    if (!this.disabled) {
      if(broadcast) {
        Events.fire('RollButtonClicked', {})
      }
    }
  }

  render() {
    if (this.firstPass) {
      // turn shadow on
      surface.shadowColor = 'burlywood'
    }
    surface.fillStyle = this._backgroundColor
    surface.fill(this.path);
    surface.fillStyle = UI.textColor
    if (this.firstPass) {
      this.firstPass = false
      surface.shadowColor = 'transparent'
    }

    this.children[0].render()
  }

}
