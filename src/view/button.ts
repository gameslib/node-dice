
class Button implements iView {

  id: string
  geometry: iGeometry
  ctx: CanvasRenderingContext2D
  path: Path2D
  color: string
  enabled: boolean
  visible: boolean
  children: iView[] = []
  buttonText: Label
  firstPass: boolean // used for shadow control
  textLabel: Label
  viewModel: iViewModel

  constructor(id: string, geometry: iGeometry, enabled: boolean, container: Container) {
    this.geometry = geometry
    this.ctx = container.ctx
    this.viewModel = new ButtonVM()
    this.color = 'black'
    this.enabled = enabled
    this.id = id
    this.enabled = true
    this.visible = true
    if (enabled) { this.register(container) }
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
        'snow',
        false,
        container)
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
  register(container: Container) {
    container.targetElements.push(this)
  }

  buildPath() {
    this.path = Factories.BuildRectangle(
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
      this.ctx.shadowColor = 'burlywood'
    }
    this.ctx.fillStyle = this.color
    this.ctx.fill(this.path);
    this.ctx.fillStyle = 'snow'
    if (this.firstPass) {
      this.firstPass = false
      this.ctx.shadowColor = 'transparent'
    }

    this.buttonText.render()
  }
}
