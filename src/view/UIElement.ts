
class UIElement {

  id: string
  geometry: iGeometry
  path: Path2D
  color: string
  enabled: boolean
  visible: boolean
  children: UIElement[]

  constructor(id: string, geometry: iGeometry, color = 'black', enabled: boolean) {
    this.id = id
    this.enabled = enabled
    this.geometry = geometry
    this.color = color
    this.children = []
    if (enabled) {this.register()}
  }

  register(){
    UI.targetElements.push(this)
  }

  touched(broadcast: boolean, x: number, y: number): any {
  }
  render(): void {
  }
}