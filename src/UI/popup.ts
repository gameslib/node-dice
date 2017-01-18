
class Popup implements iUIElement {
  id: number
  location: iLocation
  size: iSize
  text: string
  clickable: boolean
  children: null
  color: string
  buffer: ImageData
  path: Path2D
  visible: boolean = false

  constructor(size: iSize) {
    this.location = { left: 100, top: 100 }
    this.path = PathBuilder.BuildRectangle(this.location, size, 30)
    UI.clickables.push(this)
  }

  show(msg: string) {
    this.text = msg
    if (this.visible) {
      this.restoreScreenFromBuffer()
      this.visible = false
    } else {
      this.render()
    }
  }

  saveScreenToBuffer() {
    this.buffer = surface.getImageData(0, 0, surface.canvas.width, surface.canvas.height)
  }

  restoreScreenFromBuffer() {
    return surface.putImageData(this.buffer, 0, 0)

  }

  buildPath() {

  }

  onClick(broadcast: boolean, x: number, y: number) {
    if (this.visible) {
      this.restoreScreenFromBuffer()
      this.visible = false
      Events.fire('ResetGame', '')
    }
  }

  render() {
    this.saveScreenToBuffer()
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
    surface.strokeText(this.text, this.location.left + 200, this.location.top + 200)
    surface.restore()
    this.visible = true
  }

}
