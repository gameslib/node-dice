/**
 * Views display information from the ViewModel,
 * pass commands to it (e.g a user clicking on an element)
 * and update as the state of the ViewModel changes.
 * Views and ViewModels communicate using data-bindings and events.
 * Views handle their own user-interface events, mapping them to the ViewModel as necessary.
 */


interface iView {
  id: string
  geometry: iGeometry
  ctx: CanvasRenderingContext2D
  path: Path2D
  color: string
  enabled: boolean
  visible: boolean
  children: iView[]

  viewModel: iViewModel

  register(container: Container): any
  touched(broadcast: boolean, x: number, y: number): any
  render(): void
}

interface iGeometry {
  left: number
  top: number
  width: number
  height: number
}