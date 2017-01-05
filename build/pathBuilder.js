class PathBuilder {
    static BuildRightScore(left, top) {
        let path = new Path2D;
        let radius = PathBuilder.Radius;
        let height = Board.scoreHeight;
        let width = Board.scoreWidth;
        let right = left + width;
        let bottom = top + height;
        let halfWidth = width * 0.5;
        let farRight = right + halfWidth + radius;
        let halfHeight = height * 0.5;
        path.moveTo(left, top + halfHeight + radius);
        path.lineTo(left, bottom - radius);
        path.arcTo(left, bottom, left + radius, bottom, radius);
        path.lineTo(farRight - radius, bottom);
        path.arcTo(farRight, bottom, farRight, bottom - radius, radius);
        path.lineTo(farRight, top + radius);
        path.arcTo(farRight, top, farRight - radius, top, radius);
        let centerlineX = left + halfWidth + radius;
        path.lineTo(centerlineX + radius, top);
        path.arcTo(centerlineX, top, centerlineX, top + radius, radius);
        let centerlineY = top + halfHeight + 10 - radius;
        path.lineTo(centerlineX, centerlineY - radius);
        path.arcTo(centerlineX, centerlineY, centerlineX - radius, centerlineY, radius);
        path.lineTo(left + radius, centerlineY);
        path.arcTo(left, centerlineY, left, centerlineY + radius, radius);
        return path;
    }
    static BuildLeftScore(left, top) {
        let radius = PathBuilder.Radius;
        let height = Board.scoreHeight;
        let width = Board.scoreWidth;
        let right = left + width;
        let bottom = top + height;
        let path = new Path2D;
        let halfWidth = width * 0.5;
        let farRight = right + halfWidth + radius;
        let halfHeight = height * 0.5;
        path.moveTo(left, top + radius);
        path.lineTo(left, bottom - radius);
        path.arcTo(left, bottom, left + radius, bottom, radius);
        path.lineTo(right - radius, bottom);
        path.arcTo(right, bottom, right, bottom - radius, radius);
        path.lineTo(right, top + halfHeight + radius);
        let centerlineY = top + halfHeight - 5;
        path.arcTo(right, centerlineY, right + radius, centerlineY, radius);
        path.lineTo(farRight - radius, centerlineY);
        path.arcTo(farRight, centerlineY, farRight, centerlineY - radius, radius);
        path.lineTo(farRight, top + radius);
        path.arcTo(farRight, top, farRight - radius, top, radius);
        path.lineTo(left + radius, top);
        path.arcTo(left, top, left, top + radius, radius);
        return path;
    }
    static BuildRectangle(left, top, width, height) {
        let path = new Path2D;
        let pathArgs = { left: left, top: top,
            x: left, y: top, right: left + width, bottom: top + height, path: path
        };
        path.moveTo(left + PathBuilder.Radius, top);
        PathBuilder.moveDown(pathArgs, pathArgs.bottom);
        PathBuilder.moveRight(pathArgs);
        PathBuilder.moveUp(pathArgs);
        PathBuilder.moveLeft(pathArgs);
        return path;
    }
    static moveDown(a, to) {
        let radius = PathBuilder.Radius;
        a.path.arcTo(a.x, a.y, a.x, a.y + radius, radius);
        a.y = to - radius;
        a.path.lineTo(a.x, a.y);
    }
    static moveRight(a) {
        let radius = PathBuilder.Radius;
        a.y += radius;
        a.path.arcTo(a.x, a.y, a.x + radius, a.y, radius);
        a.x = a.right - radius;
        a.path.lineTo(a.x, a.y);
    }
    static moveUp(a) {
        let radius = PathBuilder.Radius;
        a.x += radius;
        a.path.arcTo(a.x, a.y, a.x, a.y - radius, radius);
        a.y = a.top + radius;
        a.path.lineTo(a.x, a.y);
    }
    static moveLeft(a) {
        let radius = PathBuilder.Radius;
        a.y -= radius;
        a.path.arcTo(a.x, a.y, a.x - radius, a.y, radius);
        a.x = a.left + radius;
        a.path.lineTo(a.x, a.y);
    }
}
PathBuilder.Radius = 10;
