
class Popup implements iView {
  id: string
  geometry: iGeometry
  ctx: CanvasRenderingContext2D
  path: Path2D
  color: string
  enabled: boolean
  visible: boolean
  children: iView[]
  text: string
  buffer: ImageData
  viewModel: iViewModel

  constructor(id: string, geometry: iGeometry, container: Container, viewModel: iViewModel) {
    this.viewModel = viewModel
    this.id = id
    this.enabled = true
    this.geometry = geometry
    this.ctx = container.ctx
    this.color = 'white'
    this.children = []
    if (this.enabled) { this.register(container) }
    this.path = Factories.BuildRectangle(
      new PathGeometry({ left: 1, top: 1, width: 1, height: 1 }, 0)
    )
  }

  register(container: Container) {
    container.targetElements.push(this)
  }

  show(msg: string) {
    this.text = msg
    this.buildPath()
    this.visible = true
    this.saveScreenToBuffer()
    this.render()
  }

  hide() {
    this.path = Factories.BuildRectangle(
      new PathGeometry({ left: 1, top: 1, width: 1, height: 1 }, 0)
    )
    this.restoreScreenFromBuffer()
    this.visible = false
  }

  saveScreenToBuffer() {
    this.buffer = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
  }

  restoreScreenFromBuffer() {
    return this.ctx.putImageData(this.buffer, 0, 0)

  }

  buildPath() {
    this.path = Factories.BuildRectangle(
      new PathGeometry(this.geometry, 30)
    )
  }

  touched(broadcast: boolean, x: number, y: number) {
    this.hide()
    Events.fire('ResetGame', '')
  }

  render() {
    let ctx = this.ctx
    ctx.save()
    ctx.shadowColor = '#404040'
    ctx.shadowBlur = 45
    ctx.shadowOffsetX = 5
    ctx.shadowOffsetY = 5
    ctx.fillStyle = 'snow'
    ctx.fill(this.path)
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.lineWidth = 1
    ctx.strokeStyle = 'black'
    ctx.stroke(this.path)
    ctx.strokeText(this.text, this.geometry.left + 200, this.geometry.top + 200)
    ctx.restore()
    this.visible = true
  }
}
