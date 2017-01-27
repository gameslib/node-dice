class Die extends UIElement {
  static faces: [ImageData] = [new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1)]
  static frozenFaces: [ImageData] = [new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1)]
  value: number = 1
  frozen: boolean

  constructor(id: string, geometry: iGeometry, enabled: boolean) {
    super(id, geometry, 'white', enabled)
    this.value = 1
    this.buildPath()
    this.render()
  }

  buildPath() {
     this.path = PathBuilder.BuildRectangle(
       new PathGeometry(this.geometry, 8)
    )
  }

  touched(broadcast: boolean, x: number, y: number) {
    if (this.value > 0) {
      this.frozen = !this.frozen
      this.render()
      app.sounds.play(app.sounds.select)
      if (broadcast) {
        App.socketSend('DieClicked', { 'dieNumber': this.id })
      }
    }
  }

  reset() {
    this.frozen = false
    this.value = 0
    this.render()
  }

  render() {
    if (this.frozen) {
      surface.putImageData(Die.frozenFaces[this.value], this.geometry.left, this.geometry.top)
    }
    else {
      surface.putImageData(Die.faces[this.value], this.geometry.left, this.geometry.top)
    }
  }
}