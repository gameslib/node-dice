class Die {
  value: number
  lastValue: number
  frozen: boolean
  static faces: [ImageData] = [new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1)]
  static frozenFaces: [ImageData] = [new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1)]
  index: number
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D

  constructor(index: number, canvas: any) {
    this.index = index
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
  }

  clicked() {
    if (this.value > 0) {
      this.frozen = !this.frozen
      this.render()
      app.sounds.play(app.sounds.select)
    }
  }

  render() {
    if (this.frozen) {
      this.ctx.putImageData(Die.frozenFaces[this.value], 0, 0)
    }
    else {
      this.ctx.putImageData(Die.faces[this.value], 0, 0)
    }
  }

  reset() {
    this.frozen = false
    this.value = 0
    this.render()
  }
}