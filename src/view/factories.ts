class Factories {

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

class DieBuilder {

  buildDieFaces(size: number) {
    var size = size
    let c = document.createElement('canvas')
    c.width = size
    c.height = size
    let ctx = c.getContext('2d')
    ctx.fillStyle = 'snow'
    ctx.fillRect(0, 0, size, size)
    for (var i = 0; i < 7; i++) {
      Die.faces[i] = this.drawDie(ctx, size, false, i)
      Die.frozenFaces[i] = this.drawDie(ctx, size, true, i)
    }
    c = undefined
  }

  drawDie(ctx: CanvasRenderingContext2D, size: number, frozen: boolean, value: number) {
    ctx.fillStyle = 'transparent'
    ctx.fillRect(0, 0, size, size)
    ctx.save()
    if (frozen) {
      ctx.strokeStyle = 'silver'
      ctx.fillStyle = 'WhiteSmoke'
    } else {
      ctx.strokeStyle = 'black'
      ctx.fillStyle = 'white'
    }
    this.drawDieFace(ctx, size)
    this.drawGlare(ctx, size)
    ctx.fillStyle = (frozen) ? 'silver' :'black'
    this.drawDots(ctx, value, size)
    ctx.restore()
    return ctx.getImageData(0, 0, size, size)
  }

  drawDieFace(ctx: CanvasRenderingContext2D, size: number) {
    var radius = size / 5
    ctx.beginPath()
    ctx.moveTo(radius, 0)
    ctx.arcTo(size, 0, size, size, radius)
    ctx.arcTo(size, size, 0, size, radius)
    ctx.arcTo(0, size, 0, 0, radius)
    ctx.arcTo(0, 0, radius, 0, radius)
    ctx.closePath()
    ctx.fill()
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.lineWidth = 1
  }

  drawGlare(ctx: CanvasRenderingContext2D, size: number) {
    var offset = 5,
      bottomLeftX = offset,
      bottomLeftY = size - offset,
      bottomRightX = size - offset,
      bottomRightY = size - offset,
      quarter = size * 0.25,
      threeQuarter = quarter * 3
    ctx.fillStyle = 'rgba(200, 200, 200, 0.4)'
    ctx.beginPath()
    ctx.moveTo(bottomLeftX, bottomLeftY)
    ctx.lineTo(bottomRightX, bottomRightY)
    ctx.bezierCurveTo(quarter, threeQuarter, quarter, threeQuarter, offset, offset)
    ctx.closePath()
    ctx.fill()
    ctx.save()
  }

  drawDots(ctx: CanvasRenderingContext2D, dieValue: number, size: number) {
    var quarter = size / 4,
      center = quarter * 2,
      middle = quarter * 2,
      left = quarter,
      top = quarter,
      right = quarter * 3,
      bottom = quarter * 3,
      dotSize = size / 12,
      doDot = this.drawDot

    if (dieValue === 1) {
      doDot(ctx, middle, center, dotSize)
    }
    else if (dieValue === 2) {
      doDot(ctx, top, left, dotSize)
      doDot(ctx, bottom, right, dotSize)
    }
    else if (dieValue === 3) {
      this.drawDot(ctx, top, left, dotSize)
      this.drawDot(ctx, middle, center, dotSize)
      this.drawDot(ctx, bottom, right, dotSize)
    }
    else if (dieValue === 4) {
      this.drawDot(ctx, top, left, dotSize)
      this.drawDot(ctx, top, right, dotSize)
      this.drawDot(ctx, bottom, left, dotSize)
      this.drawDot(ctx, bottom, right, dotSize)
    }
    else if (dieValue === 5) {
      this.drawDot(ctx, top, left, dotSize)
      this.drawDot(ctx, top, right, dotSize)
      this.drawDot(ctx, middle, center, dotSize)
      this.drawDot(ctx, bottom, left, dotSize)
      this.drawDot(ctx, bottom, right, dotSize)
    }
    else if (dieValue === 6) {
      this.drawDot(ctx, top, left, dotSize)
      this.drawDot(ctx, top, right, dotSize)
      this.drawDot(ctx, middle, left, dotSize)
      this.drawDot(ctx, middle, right, dotSize)
      this.drawDot(ctx, bottom, left, dotSize)
      this.drawDot(ctx, bottom, right, dotSize)
    }
  }

  drawDot(ctx: CanvasRenderingContext2D, y: number, x: number, dotSize: number) {
    ctx.beginPath()
    ctx.arc(x, y, dotSize, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.fill()
  }
}