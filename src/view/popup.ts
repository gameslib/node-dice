
class Popup extends UIElement {

  text: string
  buffer: ImageData

  constructor(id: string, geometry: iGeometry) {
    super(id, geometry, 'white', true)
    this.path = PathBuilder.BuildRectangle(
      new PathGeometry({ left: 1, top: 1, width: 1, height: 1 }, 0)
    )
  }

  show(msg: string) {
    this.text = msg
    this.buildPath()
    this.visible = true
    this.saveScreenToBuffer()
    this.render()
  }

  hide() {
    this.path = PathBuilder.BuildRectangle(
      new PathGeometry({ left: 1, top: 1, width: 1, height: 1 }, 0)
    )
    this.restoreScreenFromBuffer()
    this.visible = false
  }

  saveScreenToBuffer() {
    this.buffer = surface.getImageData(0, 0, surface.canvas.width, surface.canvas.height)
  }

  restoreScreenFromBuffer() {
    return surface.putImageData(this.buffer, 0, 0)

  }

  buildPath() {
    this.path = PathBuilder.BuildRectangle(
      new PathGeometry(this.geometry, 30)
    )
  }

  touched(broadcast: boolean, x: number, y: number) {
    this.hide()
    Events.fire('ResetGame', '')
  }

  render() {
    surface.save()
    surface.shadowColor = '#404040'
    surface.shadowBlur = 45
    surface.shadowOffsetX = 5
    surface.shadowOffsetY = 5
    surface.fillStyle = 'snow'
    surface.fill(this.path)
    surface.shadowBlur = 0
    surface.shadowOffsetX = 0
    surface.shadowOffsetY = 0
    surface.lineWidth = 1
    surface.strokeStyle = 'black'
    surface.stroke(this.path)
    surface.strokeText(this.text, this.geometry.left + 200, this.geometry.top + 200)
    surface.restore()
    this.visible = true
  }
}
