class PathBuilder {
  static Radius: number = 10


  static BuildRightScore(left: number, top: number): Path2D {
    let path = new Path2D
    let radius = PathBuilder.Radius
    let height = Board.scoreHeight
    let width = Board.scoreWidth
    let right = left + width
    let bottom = top + height
    let halfWidth = width * 0.5
    let farRight = right + halfWidth + radius
    let halfHeight = height * 0.5

    // start just below top-left corner-arc
    path.moveTo(left, top + halfHeight + radius);
    // |'' line to just above bottom left corner-arc
    path.lineTo(left, bottom - radius);
    // \..  bottom left corner (ends at left + radius)
    path.arcTo(left, bottom, left + radius, bottom, radius);
    // .__.  bottom line (ends at right - radius)
    path.lineTo(farRight - radius, bottom);
    // ../ bottom-right corner (ends at bottom - radius)
    path.arcTo(farRight, bottom, farRight, bottom - radius, radius);

    // ..|  upper right line
    path.lineTo(farRight, top + radius);
    // ''\ top-right corner
    path.arcTo(farRight, top, farRight - radius, top, radius);

    let centerlineX = left + halfWidth + radius

    // '--' top line
    path.lineTo(centerlineX + radius, top);
    // ./'' top-left corner
    path.arcTo(centerlineX, top, centerlineX, top + radius, radius);

    // leave a gap for the partner rightScoreBox
    let centerlineY = top + halfHeight + 10 - radius

    // .|' upper center line down (ends at middle of center)
    path.lineTo(centerlineX, centerlineY - radius);

    // /'' arc to left from middle (ends at left + radius)
    path.arcTo(centerlineX, centerlineY, centerlineX - radius, centerlineY, radius);

    // __  middle left line
    path.lineTo(left + radius, centerlineY);

    // ''/ mid-center corner (ends at centerline - radius)
    path.arcTo(left, centerlineY, left, centerlineY + radius, radius);
    return path
  }

  static BuildLeftScore(left: number, top: number): Path2D {
    let radius = PathBuilder.Radius
    let height = Board.scoreHeight
    let width = Board.scoreWidth
    let right = left + width
    let bottom = top + height
    let path = new Path2D
    let halfWidth = width * 0.5
    let farRight = right + halfWidth + radius
    let halfHeight = height * 0.5
    // start just below top-left corner-arc
    path.moveTo(left, top + radius);
    // |'' line to just above bottom left corner-arc
    path.lineTo(left, bottom - radius);
    // \..  bottom left corner (ends at left + radius)
    path.arcTo(left, bottom, left + radius, bottom, radius);
    // .__.  bottom line (ends at right - radius)
    path.lineTo(right - radius, bottom);
    // ../ bottom-right corner (ends at bottom - radius)
    path.arcTo(right, bottom, right, bottom - radius, radius);
    // ..|  lower right line (ends at middle of right side
    path.lineTo(right, top + halfHeight + radius);

    // leave a gap for the partner rightScoreBox
    let centerlineY = top + halfHeight - 5

    // /'' arc to right from middle right side (ends at right + radius)
    path.arcTo(right, centerlineY, right + radius, centerlineY, radius);
    // __  outer right line
    path.lineTo(farRight - radius, centerlineY);

    // ''/ mid-right corner (ends at centerline - radius)
    path.arcTo(farRight, centerlineY, farRight, centerlineY - radius, radius);

    // ..|  upper right line
    path.lineTo(farRight, top + radius);
    // ''\ top-right corner
    path.arcTo(farRight, top, farRight - radius, top, radius);
    // '--' top line
    path.lineTo(left + radius, top);
    // ./'' top-left corner
    path.arcTo(left, top, left, top + radius, radius);
    return path
  }

  static BuildRectangle(left: number, top: number, width: number, height: number): Path2D {
    let path = new Path2D
    let pathArgs = { left: left, top: top,
      x: left, y: top, right: left + width, bottom: top + height, path: path
    }
    // start just before top-left corner-arc
    // moving counter-clockwise
    path.moveTo(left + PathBuilder.Radius, top);

    PathBuilder.moveDown(pathArgs, pathArgs.bottom)
    PathBuilder.moveRight(pathArgs)
    PathBuilder.moveUp(pathArgs)
    PathBuilder.moveLeft(pathArgs)
    return path
  }

  static moveDown(a: any, to: number) {
    let radius = PathBuilder.Radius
    a.path.arcTo(a.x, a.y, a.x, a.y + radius, radius);
    a.y = to - radius
    a.path.lineTo(a.x, a.y);
  }

  static moveRight(a:any) {
    let radius = PathBuilder.Radius
    a.y += radius
    a.path.arcTo(a.x, a.y, a.x + radius, a.y, radius);
    a.x = a.right - radius
    a.path.lineTo(a.x, a.y);
  }

  static moveUp(a:any) {
    let radius = PathBuilder.Radius
    a.x += radius
    a.path.arcTo(a.x, a.y, a.x, a.y - radius, radius);
    a.y = a.top + radius
    a.path.lineTo(a.x, a.y);
  }

  static moveLeft(a:any) {
    let radius = PathBuilder.Radius
    a.y -= radius
    a.path.arcTo(a.x, a.y, a.x - radius, a.y, radius);
    a.x = a.left + radius
    a.path.lineTo(a.x, a.y);
  }

}