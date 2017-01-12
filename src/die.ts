class Die {

  location: iLocation
  size: number = 80
  value: number = 1
  lastValue: number = 1
  frozen: boolean
  static faces: [ImageData] = [new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1)]
  static frozenFaces: [ImageData] = [new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1)]
  index: number

  constructor(index: number, location: iLocation, size: number) {
    this.index = index
    this.location = location
    //this.y = y
    this.size = size
    this.value = 1
    this.render()
  }

  clicked() {
    if (this.value > 0) {
      this.frozen = !this.frozen
      this.render()
      app.sounds.play(app.sounds.select)
    }
  }

  hitTest(x: number, y: number): boolean {
    if ( x < this.location.left || x > this.location.left + this.size) {return false}
    if ( y < this.location.top || y > this.location.top  + this.size) {return false}
    return true
  }

  render() {
    if (this.frozen) {
      surface.putImageData(Die.frozenFaces[this.value], this.location.left, this.location.top)
    }
    else {
      surface.putImageData(Die.faces[this.value], this.location.left, this.location.top)
    }
  }

  reset() {
    this.frozen = false
    this.value = 0
    this.render()
  }
}