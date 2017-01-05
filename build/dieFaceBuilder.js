class DieFaceBuilder {
    buildDieFaces(size) {
        var size = size;
        let c = document.createElement('canvas');
        c.width = size;
        c.height = size;
        let ctx = c.getContext('2d');
        ctx.fillStyle = 'snow';
        ctx.fillRect(0, 0, size, size);
        for (var i = 0; i < 7; i++) {
            Die.faces[i] = this.drawDie(ctx, size, false, i);
            Die.frozenFaces[i] = this.drawDie(ctx, size, true, i);
        }
        c = undefined;
    }
    drawDie(ctx, size, frozen, value) {
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, size, size);
        ctx.save();
        if (frozen) {
            ctx.strokeStyle = 'silver';
            ctx.fillStyle = 'WhiteSmoke';
        }
        else {
            ctx.strokeStyle = 'black';
            ctx.fillStyle = 'white';
        }
        this.drawDieFace(ctx, size);
        this.drawGlare(ctx, size);
        ctx.fillStyle = (frozen) ? 'silver' : 'black';
        this.drawDots(ctx, value, size);
        ctx.restore();
        return ctx.getImageData(0, 0, size, size);
    }
    drawDieFace(ctx, size) {
        var radius = size / 5;
        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.arcTo(size, 0, size, size, radius);
        ctx.arcTo(size, size, 0, size, radius);
        ctx.arcTo(0, size, 0, 0, radius);
        ctx.arcTo(0, 0, radius, 0, radius);
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.lineWidth = 1;
    }
    drawGlare(ctx, size) {
        var offset = 5, bottomLeftX = offset, bottomLeftY = size - offset, bottomRightX = size - offset, bottomRightY = size - offset, quarter = size * 0.25, threeQuarter = quarter * 3;
        ctx.fillStyle = 'rgba(200, 200, 200, 0.4)';
        ctx.beginPath();
        ctx.moveTo(bottomLeftX, bottomLeftY);
        ctx.lineTo(bottomRightX, bottomRightY);
        ctx.bezierCurveTo(quarter, threeQuarter, quarter, threeQuarter, offset, offset);
        ctx.closePath();
        ctx.fill();
        ctx.save();
    }
    drawDots(ctx, dieValue, size) {
        var quarter = size / 4, center = quarter * 2, middle = quarter * 2, left = quarter, top = quarter, right = quarter * 3, bottom = quarter * 3, dotSize = size / 12, doDot = this.drawDot;
        if (dieValue === 1) {
            doDot(ctx, middle, center, dotSize);
        }
        else if (dieValue === 2) {
            doDot(ctx, top, left, dotSize);
            doDot(ctx, bottom, right, dotSize);
        }
        else if (dieValue === 3) {
            this.drawDot(ctx, top, left, dotSize);
            this.drawDot(ctx, middle, center, dotSize);
            this.drawDot(ctx, bottom, right, dotSize);
        }
        else if (dieValue === 4) {
            this.drawDot(ctx, top, left, dotSize);
            this.drawDot(ctx, top, right, dotSize);
            this.drawDot(ctx, bottom, left, dotSize);
            this.drawDot(ctx, bottom, right, dotSize);
        }
        else if (dieValue === 5) {
            this.drawDot(ctx, top, left, dotSize);
            this.drawDot(ctx, top, right, dotSize);
            this.drawDot(ctx, middle, center, dotSize);
            this.drawDot(ctx, bottom, left, dotSize);
            this.drawDot(ctx, bottom, right, dotSize);
        }
        else if (dieValue === 6) {
            this.drawDot(ctx, top, left, dotSize);
            this.drawDot(ctx, top, right, dotSize);
            this.drawDot(ctx, middle, left, dotSize);
            this.drawDot(ctx, middle, right, dotSize);
            this.drawDot(ctx, bottom, left, dotSize);
            this.drawDot(ctx, bottom, right, dotSize);
        }
    }
    drawDot(ctx, y, x, dotSize) {
        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }
}
