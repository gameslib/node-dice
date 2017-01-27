
class Button extends UIElement {

  buttonText: Label
  firstPass: boolean // used for shadow control
  textLabel: Label

  constructor(id: string, geometry: iGeometry, enabled: boolean) {
    super(id, geometry, 'black', enabled)
    this.id = id
    this.enabled = true
    this.visible = true
    this.children.push(
        new Label(
            '0',
            'Roll Dice',
            {
              left: geometry.left + 90,
              top: geometry.top + 40,
              width: geometry.width - 25,
              height: 40
            },
            'blue',
            UI.textColor,
            false)
        )
    this.buttonText = this.children[0] as Label
    this.buildPath()
    this.firstPass = true
    this.render()

    Events.on('RollUpdate', (data: { text: string, color: string, enabled: boolean }) => {
      this.enabled = data.enabled
      this.color = data.color  //_background
      this.buttonText.color = data.color
      this.buttonText.text = data.text
      this.render()
    })

  }

  buildPath() {
    this.path = PathBuilder.BuildRectangle(
      new PathGeometry(this.geometry)
    )
  }

  touched(broadcast: boolean, x: number, y: number) {
    if (this.enabled) {
      if (broadcast) {
        Events.fire('RollButtonClicked', {})
      }
    }
  }

  render() {
    //todo: save and restore the surface ... (ctx)
    if (this.firstPass) {
      // turn shadow on
      surface.shadowColor = 'burlywood'
    }
    surface.fillStyle = this.color
    surface.fill(this.path);
    surface.fillStyle = UI.textColor
    if (this.firstPass) {
      this.firstPass = false
      surface.shadowColor = 'transparent'
    }

    this.children[0].render()
  }
}
