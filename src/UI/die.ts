class Die implements iUIElement {
  static faces: [ImageData] = [new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1)]
  static frozenFaces: [ImageData] = [new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1)]
  id: number
  location: iLocation
  size: iSize
  path: Path2D
  color = ''
  text = ''
  children:iUIElement[] = null
  value: number = 1
  frozen: boolean

  constructor(id: number, location: iLocation, size: iSize) {
    this.id = id
    this.location = location
    this.size = size
    this.value = 1
    this.buildPath()
    UI.clickables.push(this)
    this.render()
  }

  buildPath(){
     this.path = PathBuilder.BuildRectangle(this.location,this.size,0)
  }

  clicked(broadcast: boolean) {
    if (this.value > 0) {
      this.frozen = !this.frozen
      this.render()
      app.sounds.play(app.sounds.select)
      if (broadcast) {
        App.socketSend('dieClicked', { 'dieNumber': this.id })
      }
    }
  }

  reset() {
    this.frozen = false
    this.value = 0
    this.render()
  }

  hitTest(x: number, y: number): boolean {
    return surface.isPointInPath(this.path, x, y)
  }

  render() {
    if (this.frozen) {
      surface.putImageData(Die.frozenFaces[this.value], this.location.left, this.location.top)
    }
    else {
      surface.putImageData(Die.faces[this.value], this.location.left, this.location.top)
    }
  }
}