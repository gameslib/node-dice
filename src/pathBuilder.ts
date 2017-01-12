class PathBuilder {

  static BuildRightScore(location: iLocation, size:iSize, radius: number) {
    let left = location.left
    let top = location.top
    let right = left + size.width
    let bottom = top + size.height
    let halfWidth = left + (size.width * 0.3)
    let halfHeight = top + (size.height * 0.5) + 3
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

  static BuildLeftScore(location: iLocation, size:iSize, radius: number) {
    let left = location.left
    let top = location.top
    let right = left + size.width
    let bottom = top + size.height
    let halfWidth = left + (size.width * 0.7)
    let halfHeight = top + (size.height * 0.5) - 3
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

  static BuildRectangle(location: iLocation, size:iSize, radius: number): Path2D {
    let left = location.left
    let top = location.top
    let right = left + size.width
    let bottom = top + size.height
    let path = new Path2D
    path.moveTo(left + radius, top);
    path.arcTo(right, top, right, top + radius, radius); // top
    path.arcTo(right, bottom, right - radius, bottom, radius); // right
    path.arcTo(left, bottom, left, bottom - radius, radius); // bottom
    path.arcTo(left, top, left + radius, top, radius); // left
    return path
  }
}