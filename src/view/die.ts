class Die implements iView {
  static faces: [ImageData] = [new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1)]
  static frozenFaces: [ImageData] = [new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1),new ImageData(1,1)]

  id: string
  geometry: iGeometry
  ctx: CanvasRenderingContext2D
  path: Path2D
  color: string
  enabled: boolean
  visible: boolean
  children: iView[]
  frozen: boolean
  viewModel: DieVM

  constructor(id: string, geometry: iGeometry, enabled: boolean, container: Container, viewModel: DieVM) {
    this.id = id
    this.viewModel = viewModel
    this.enabled = enabled
    this.geometry = geometry
    this.ctx = container.ctx
    this.color = 'transparent'
    this.children = []
    if (enabled) {this.register(container)}
    this.buildPath()
    this.render()
    Events.on(this.id, () => this.render())
  }

  register(container: Container){
    container.targetElements.push(this)
  }

  buildPath() {
     this.path = Factories.BuildRectangle(
       new PathGeometry(this.geometry, 10 )
    )
  }

  touched(broadcast: boolean, x: number, y: number) {
    this.viewModel.touched(broadcast, x, y)
  }

  render() {
    if (this.viewModel._frozen) {
      this.ctx.putImageData(Die.frozenFaces[this.viewModel._value], this.geometry.left, this.geometry.top)
    }
    else {
      this.ctx.putImageData(Die.faces[this.viewModel._value], this.geometry.left, this.geometry.top)
    }
  }
}