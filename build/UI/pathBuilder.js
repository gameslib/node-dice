class PathBuilder {
    static BuildRightScore(location, size, radius) {
        let left = location.left;
        let top = location.top;
        let right = left + size.width;
        let bottom = top + size.height;
        let halfWidth = left + (size.width * 0.3);
        let halfHeight = top + (size.height * 0.5) + 3;
        let p = new Path2D();
        p.moveTo(halfWidth + radius, top);
        p.arcTo(right, top, right, top + radius, radius);
        p.arcTo(right, bottom, right - radius, bottom, radius);
        p.arcTo(left, bottom, left, bottom - radius, radius);
        p.arcTo(left, halfHeight, left + radius, halfHeight, radius);
        p.arcTo(halfWidth, halfHeight, halfWidth, halfHeight - radius, radius);
        p.arcTo(halfWidth, top, halfWidth + radius, top, radius);
        return p;
    }
    static BuildLeftScore(location, size, radius) {
        let left = location.left;
        let top = location.top;
        let right = left + size.width;
        let bottom = top + size.height;
        let halfWidth = left + (size.width * 0.7);
        let halfHeight = top + (size.height * 0.5) - 3;
        let p = new Path2D();
        p.moveTo(left + radius, top);
        p.arcTo(right, top, right, top + radius, radius);
        p.arcTo(right, halfHeight, right - radius, halfHeight, radius);
        p.arcTo(halfWidth, halfHeight, halfWidth, halfHeight + radius, radius);
        p.arcTo(halfWidth, bottom, halfWidth - radius, bottom, radius);
        p.arcTo(left, bottom, left, bottom - radius, radius);
        p.arcTo(left, top, left + radius, top, radius);
        return p;
    }
    static BuildRectangle(location, size, radius) {
        let left = location.left;
        let top = location.top;
        let right = left + size.width;
        let bottom = top + size.height;
        let path = new Path2D;
        if (radius < 7) {
            path.moveTo(left, top);
            path.lineTo(right, top);
            path.lineTo(right, bottom);
            path.lineTo(left, bottom);
            path.lineTo(left, top);
        }
        else {
            path.moveTo(left + radius, top);
            path.arcTo(right, top, right, top + radius, radius);
            path.arcTo(right, bottom, right - radius, bottom, radius);
            path.arcTo(left, bottom, left, bottom - radius, radius);
            path.arcTo(left, top, left + radius, top, radius);
        }
        return path;
    }
}
