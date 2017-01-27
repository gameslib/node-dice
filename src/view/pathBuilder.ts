class PathBuilder {

  static BuildRightScore(geometry: PathGeometry) {
    const { left, right, top, bottom, width, height, radius } = geometry
    let halfWidth = left + (width * 0.3)
    let halfHeight = top + (height * 0.5) + 3
    let p = new Path2D()
    p.moveTo(halfWidth + radius, top);
    p.arcTo(right, top, right, top + radius, radius);
    p.arcTo(right, bottom, right - radius, bottom, radius);
    p.arcTo(left, bottom, left, bottom - radius, radius);
    p.arcTo(left, halfHeight, left + radius, halfHeight, radius);
    p.arcTo(halfWidth, halfHeight, halfWidth, halfHeight - radius, radius);
    p.arcTo(halfWidth, top, halfWidth + radius, top, radius);
    return p
  }

  static BuildLeftScore(geometry: PathGeometry) {
    const { left, right, top, bottom, width, height, radius } = geometry
    let halfWidth = left + (width * 0.7)
    let halfHeight = top + (height * 0.5) - 3
    let p = new Path2D()
    p.moveTo(left + radius, top);
    p.arcTo(right, top, right, top + radius, radius);
    p.arcTo(right, halfHeight, right - radius, halfHeight, radius);
    p.arcTo(halfWidth, halfHeight, halfWidth, halfHeight + radius, radius);
    p.arcTo(halfWidth, bottom, halfWidth - radius, bottom, radius);
    p.arcTo(left, bottom, left, bottom - radius, radius);
    p.arcTo(left, top, left + radius, top, radius);
    return p
  }

  static BuildRectangle(geometry: PathGeometry): Path2D {
    const { left, right, top, bottom, width, height, radius } = geometry
    let path = new Path2D
    if (radius < 7) {
      path.moveTo(left, top);
      path.lineTo(right, top); // top
      path.lineTo(right, bottom); // right
      path.lineTo(left, bottom); // bottom
      path.lineTo(left, top); // left
    } else {
      path.moveTo(left + radius, top);
      path.arcTo(right, top, right, top + radius, radius); // top
      path.arcTo(right, bottom, right - radius, bottom, radius); // right
      path.arcTo(left, bottom, left, bottom - radius, radius); // bottom
      path.arcTo(left, top, left + radius, top, radius); // left
    }
    return path
  }
}

class PathGeometry {
  left: number
  right: number
  top: number
  bottom: number
  width: number
  height: number
  radius: number

  constructor(geo: iGeometry, radius?: number) {
    const { left, top, width, height} = geo
    this.left = left
    this.right = left + width
    this.top = top
    this.bottom = top + height
    this.width = width
    this.height = height
    this.radius = radius || 10
  }
}